"""
Write-side use-cases for the Instagram integration.
`handle_webhook_event` is the single entry point the webhook task calls for
every verified Meta payload — it stores the raw event, normalizes it into a
Message/Comment/Event row, and (for messages/comments) hands off to the
automation engine to evaluate triggers.
"""
import logging
import uuid
from django.db import transaction
from django.utils import timezone

from apps.core.exceptions import ApplicationError
from apps.services.meta_graph import GraphAPIError, MetaGraphClient
from apps.utils.encryption import decrypt_value, encrypt_value
from django.conf import settings

from .models import InstagramAccount, InstagramComment, InstagramEvent, InstagramMessage, InstagramWebhook

logger = logging.getLogger("flowdm.instagram")


def get_account_by_ig_id(ig_business_id: str) -> InstagramAccount | None:
    return InstagramAccount.objects.filter(ig_business_id=ig_business_id).select_related("user").first()


def get_user_accounts(user):
    return InstagramAccount.objects.filter(user=user)


@transaction.atomic
def connect_account(*, user, code: str, redirect_uri: str) -> InstagramAccount:
    """OAuth callback handler — exchanges the auth code, discovers the IG business account, persists it."""
    client = MetaGraphClient()
    try:
        token_data = client.exchange_code_for_token(code, redirect_uri)
        long_lived = client.exchange_for_long_lived_token(token_data["access_token"])
        access_token = long_lived["access_token"]

        client = MetaGraphClient(access_token=access_token)
        pages = client.get_managed_pages()
        print("PAGES =", pages)
        page = next((p for p in pages if p.get("instagram_business_account")), None)
        if not page:
            raise ApplicationError(
                "No Instagram Business account is linked to your Facebook Page.", code="no_ig_business_account"
            )

        ig_business_id = page["instagram_business_account"]["id"]
        profile = client.get_ig_business_profile(ig_business_id)
        client.subscribe_page_webhook(
    page["id"],
    page["access_token"],
)

        account, _ = InstagramAccount.objects.update_or_create(
            ig_business_id=ig_business_id,
            defaults={
                "user": user,
                "ig_username": profile.get("username", ""),
                "ig_name": profile.get("name", ""),
                "profile_picture_url": profile.get("profile_picture_url", ""),
                "followers_count": profile.get("followers_count", 0),
                "media_count": profile.get("media_count", 0),
                "facebook_page_id": page["id"],
                "facebook_page_name": page.get("name", ""),
                "encrypted_access_token": encrypt_value(access_token),
                "status": InstagramAccount.Status.CONNECTED,
                "webhook_subscribed": True,
                "last_synced_at": timezone.now(),
            },
        )
        return account
    except GraphAPIError as exc:
        logger.error("Failed to connect Instagram account for user %s: %s", user.id, exc)
        raise ApplicationError(f"Failed to connect Instagram account: {exc}", code="meta_api_error") from exc


def disconnect_account(account: InstagramAccount):
    try:
        client = MetaGraphClient(access_token=decrypt_value(account.encrypted_access_token))
        client.unsubscribe_page_webhook(account.facebook_page_id, decrypt_value(account.encrypted_access_token))
    except GraphAPIError as exc:
        logger.warning("Could not unsubscribe webhook on disconnect for account %s: %s", account.id, exc)

    account.status = InstagramAccount.Status.DISCONNECTED
    account.webhook_subscribed = False
    account.save(update_fields=["status", "webhook_subscribed"])


def reconnect_account(*, account: InstagramAccount, code: str, redirect_uri: str) -> InstagramAccount:
    return connect_account(user=account.user, code=code, redirect_uri=redirect_uri)


def sync_profile(account: InstagramAccount) -> InstagramAccount:
    """Refreshes username, profile picture, follower/media counts from the Graph API."""
    try:
        client = MetaGraphClient(access_token=decrypt_value(account.encrypted_access_token))
        profile = client.get_ig_business_profile(account.ig_business_id)
        account.ig_username = profile.get("username", account.ig_username)
        account.ig_name = profile.get("name", account.ig_name)
        account.profile_picture_url = profile.get("profile_picture_url", account.profile_picture_url)
        account.followers_count = profile.get("followers_count", account.followers_count)
        account.media_count = profile.get("media_count", account.media_count)
        account.last_synced_at = timezone.now()
        account.status = InstagramAccount.Status.CONNECTED
        account.save()
        return account
    except GraphAPIError as exc:
        logger.warning("Profile sync failed for account %s, marking reconnect_required: %s", account.id, exc)
        account.status = InstagramAccount.Status.RECONNECT_REQUIRED
        account.save(update_fields=["status"])
        raise


def get_basic_insights(account: InstagramAccount) -> dict:
    client = MetaGraphClient(access_token=decrypt_value(account.encrypted_access_token))
    return client.get_ig_basic_insights(account.ig_business_id)


def send_text_message(*, account: InstagramAccount, recipient_id: str, text: str) -> InstagramMessage:
    client = MetaGraphClient(access_token=decrypt_value(account.encrypted_access_token))
    client.send_typing_indicator(account.ig_business_id, recipient_id)
    response = client.send_text_message(account.ig_business_id, recipient_id, text)

    return InstagramMessage.objects.create(
        account=account,
        ig_message_id=response.get("message_id", ""),
        sender_id=account.ig_business_id,
        recipient_id=recipient_id,
        direction=InstagramMessage.Direction.OUTBOUND,
        message_type=InstagramMessage.MessageType.TEXT,
        text=text,
        is_read=True,
    )


# --------------------------------------------------------------------------
# Webhook ingestion
# --------------------------------------------------------------------------
@transaction.atomic
def record_webhook(*, account: InstagramAccount | None, event_type: str, payload: dict, signature_valid: bool) -> InstagramWebhook:
    return InstagramWebhook.objects.create(
        account=account, event_type=event_type, payload=payload, signature_valid=signature_valid
    )


def handle_webhook_event(*, webhook: InstagramWebhook):
    """Normalizes one raw Meta payload into Message/Comment/Event rows and fires automation triggers."""
    from apps.automation.services import evaluate_triggers_for_comment, evaluate_triggers_for_message

    try:
        for entry in webhook.payload.get("entry", []):
            ig_business_id = entry.get("id")
            account = get_account_by_ig_id(ig_business_id)
            if account is None:
                continue

            for messaging_event in entry.get("messaging", []):
                message = _ingest_message_event(account, messaging_event)
                if message:
                    evaluate_triggers_for_message(message)

            for change in entry.get("changes", []):
                field = change.get("field")
                value = change.get("value", {})
                if field == "comments":
                    comment = _ingest_comment_event(account, value)
                    if comment:
                        evaluate_triggers_for_comment(comment)
                elif field in ("mentions",):
                    _ingest_generic_event(account, InstagramEvent.EventType.STORY_MENTION, value)

        webhook.processed = True
        webhook.processed_at = timezone.now()
        webhook.save(update_fields=["processed", "processed_at"])
    except Exception as exc:
        logger.exception("Failed to process webhook %s", webhook.id)
        webhook.error = str(exc)[:2000]
        webhook.save(update_fields=["error"])
        raise


def _ingest_message_event(account: InstagramAccount, event: dict) -> InstagramMessage | None:
    sender_id = event.get("sender", {}).get("id")
    message_data = event.get("message", {})
    if not sender_id or not message_data or message_data.get("is_echo"):
        return None  # echoes of our own outbound sends — already recorded by send_text_message

    text = message_data.get("text", "")
    attachments = message_data.get("attachments", [])
    message_type, media_url = InstagramMessage.MessageType.TEXT, ""
    if attachments:
        attachment = attachments[0]
        raw_type = attachment.get("type", "image")
        message_type = raw_type if raw_type in InstagramMessage.MessageType.values else InstagramMessage.MessageType.FILE
        media_url = attachment.get("payload", {}).get("url", "")

    return InstagramMessage.objects.create(
        account=account,
        ig_message_id=message_data.get("mid", ""),
        sender_id=sender_id,
        recipient_id=account.ig_business_id,
        direction=InstagramMessage.Direction.INBOUND,
        message_type=message_type,
        text=text,
        media_url=media_url,
    )


def _ingest_comment_event(account: InstagramAccount, value: dict) -> InstagramComment | None:
    comment_id = value.get("id")
    if not comment_id:
        return None
    comment, _ = InstagramComment.objects.update_or_create(
        comment_id=comment_id,
        defaults={
            "account": account,
            "media_id": value.get("media", {}).get("id", ""),
            "from_user_id": value.get("from", {}).get("id", ""),
            "from_username": value.get("from", {}).get("username", ""),
            "text": value.get("text", ""),
        },
    )
    return comment


def _ingest_generic_event(account: InstagramAccount, event_type: str, value: dict) -> InstagramEvent:
    return InstagramEvent.objects.create(
        account=account, event_type=event_type, sender_id=value.get("sender_id", ""), payload=value
    )




from urllib.parse import urlencode
import secrets

def get_instagram_login_url(user):

    params = {
        "client_id": settings.META_APP_ID,
        "redirect_uri": settings.META_REDIRECT_URI,
        "response_type": "code",
        "config_id": settings.META_CONFIG_ID,
        "state": str(user.id),
    }

    return (
        f"https://www.facebook.com/{settings.META_GRAPH_API_VERSION}/dialog/oauth?"
        + urlencode(params)
    )