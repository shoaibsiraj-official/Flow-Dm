from django.conf import settings
from django.db import models

from apps.core.models import BaseModel


class InstagramAccount(BaseModel):
    class Status(models.TextChoices):
        CONNECTED = "connected", "Connected"
        RECONNECT_REQUIRED = "reconnect_required", "Reconnect Required"
        DISCONNECTED = "disconnected", "Disconnected"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="instagram_accounts")

    ig_business_id = models.CharField(max_length=64, unique=True, db_index=True)
    ig_username = models.CharField(max_length=150, blank=True)
    ig_name = models.CharField(max_length=150, blank=True)
    profile_picture_url = models.URLField(blank=True)
    followers_count = models.PositiveIntegerField(default=0)
    media_count = models.PositiveIntegerField(default=0)

    facebook_page_id = models.CharField(max_length=64)
    facebook_page_name = models.CharField(max_length=150, blank=True)

    # Long-lived Graph API token, encrypted at rest — see apps.utils.encryption
    encrypted_access_token = models.TextField()
    token_expires_at = models.DateTimeField(null=True, blank=True)

    status = models.CharField(max_length=25, choices=Status.choices, default=Status.CONNECTED)
    webhook_subscribed = models.BooleanField(default=False)
    connected_at = models.DateTimeField(auto_now_add=True)
    last_synced_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "instagram_accounts"
        indexes = [models.Index(fields=["user", "status"])]

    def __str__(self):
        return f"@{self.ig_username or self.ig_business_id}"


class InstagramWebhook(BaseModel):
    """Raw webhook payload log — every verified Meta callback, used for replay/debugging and idempotency."""

    account = models.ForeignKey(
        InstagramAccount, on_delete=models.CASCADE, related_name="webhooks", null=True, blank=True
    )
    event_type = models.CharField(max_length=50, db_index=True)
    payload = models.JSONField()
    signature_valid = models.BooleanField(default=False)
    processed = models.BooleanField(default=False)
    processed_at = models.DateTimeField(null=True, blank=True)
    error = models.TextField(blank=True)

    class Meta:
        db_table = "instagram_webhooks"
        indexes = [models.Index(fields=["event_type", "processed"])]


class InstagramMessage(BaseModel):
    class Direction(models.TextChoices):
        INBOUND = "inbound", "Inbound"
        OUTBOUND = "outbound", "Outbound"

    class MessageType(models.TextChoices):
        TEXT = "text", "Text"
        IMAGE = "image", "Image"
        VIDEO = "video", "Video"
        AUDIO = "audio", "Audio"
        FILE = "file", "File"

    account = models.ForeignKey(InstagramAccount, on_delete=models.CASCADE, related_name="messages")
    ig_message_id = models.CharField(max_length=100, blank=True, db_index=True)
    sender_id = models.CharField(max_length=64, db_index=True)
    recipient_id = models.CharField(max_length=64)
    direction = models.CharField(max_length=10, choices=Direction.choices)
    message_type = models.CharField(max_length=10, choices=MessageType.choices, default=MessageType.TEXT)
    text = models.TextField(blank=True)
    media_url = models.URLField(blank=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        db_table = "instagram_messages"
        indexes = [
            models.Index(fields=["account", "sender_id", "-created_at"]),
            models.Index(fields=["account", "direction", "created_at"]),
        ]


class InstagramComment(BaseModel):
    account = models.ForeignKey(InstagramAccount, on_delete=models.CASCADE, related_name="comments")
    media_id = models.CharField(max_length=64)
    comment_id = models.CharField(max_length=64, unique=True)
    from_user_id = models.CharField(max_length=64)
    from_username = models.CharField(max_length=150, blank=True)
    text = models.TextField(blank=True)
    replied = models.BooleanField(default=False)

    class Meta:
        db_table = "instagram_comments"
        indexes = [models.Index(fields=["account", "-created_at"])]


class InstagramEvent(BaseModel):
    """Catch-all for non-message/comment webhook events: story mentions, story replies, follows."""

    class EventType(models.TextChoices):
        STORY_MENTION = "story_mention", "Story Mention"
        STORY_REPLY = "story_reply", "Story Reply"
        FOLLOW = "follow", "Follow"
        OTHER = "other", "Other"

    account = models.ForeignKey(InstagramAccount, on_delete=models.CASCADE, related_name="events")
    event_type = models.CharField(max_length=20, choices=EventType.choices, default=EventType.OTHER)
    sender_id = models.CharField(max_length=64, blank=True)
    payload = models.JSONField(default=dict)

    class Meta:
        db_table = "instagram_events"
        indexes = [models.Index(fields=["account", "event_type", "-created_at"])]
