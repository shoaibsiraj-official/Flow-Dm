import logging

from celery import shared_task
from django.utils import timezone

logger = logging.getLogger("flowdm.instagram")


@shared_task(bind=True, max_retries=5, default_retry_delay=15)
def process_webhook_task(self, payload: dict, signature_valid: bool):
    """Async worker for every verified Meta webhook POST — kept off the request/response cycle."""
    from . import services
    from .models import InstagramWebhook

    entry = payload.get("entry", [{}])[0]
    event_type = "messages" if entry.get("messaging") else ("comments" if entry.get("changes") else "unknown")
    ig_business_id = entry.get("id")
    account = services.get_account_by_ig_id(ig_business_id) if ig_business_id else None

    webhook = services.record_webhook(
        account=account, event_type=event_type, payload=payload, signature_valid=signature_valid
    )
    try:
        services.handle_webhook_event(webhook=webhook)
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task
def sync_all_accounts():
    """Celery Beat: periodic reconciliation sync — catches drift and dead tokens between webhook deliveries."""
    from .models import InstagramAccount

    account_ids = InstagramAccount.objects.filter(status=InstagramAccount.Status.CONNECTED).values_list(
        "id", flat=True
    )
    for account_id in account_ids:
        sync_account_profile.delay(str(account_id))


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def sync_account_profile(self, account_id: str):
    from . import services
    from .models import InstagramAccount
    from apps.services.meta_graph import GraphAPIError

    try:
        account = InstagramAccount.objects.get(id=account_id)
        services.sync_profile(account)
    except InstagramAccount.DoesNotExist:
        return
    except GraphAPIError:
        return  # sync_profile already flips status to reconnect_required
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task
def refresh_expiring_tokens():
    """
    Celery Beat: Meta long-lived tokens last ~60 days. Flag accounts nearing
    expiry as reconnect_required so the frontend can prompt the user.
    """
    from datetime import timedelta

    from .models import InstagramAccount

    soon = timezone.now() + timedelta(days=5)
    expiring = InstagramAccount.objects.filter(
        status=InstagramAccount.Status.CONNECTED, token_expires_at__lte=soon, token_expires_at__isnull=False
    )
    count = expiring.update(status=InstagramAccount.Status.RECONNECT_REQUIRED)
    if count:
        logger.info("Flagged %s Instagram accounts as reconnect_required (token expiring soon)", count)
