from django.contrib import admin

from .models import InstagramAccount, InstagramComment, InstagramEvent, InstagramMessage, InstagramWebhook


@admin.register(InstagramAccount)
class InstagramAccountAdmin(admin.ModelAdmin):
    list_display = ["ig_username", "user", "status", "followers_count", "webhook_subscribed", "last_synced_at"]
    list_filter = ["status", "webhook_subscribed"]
    search_fields = ["ig_username", "ig_business_id", "user__email"]
    readonly_fields = ["encrypted_access_token", "connected_at"]


@admin.register(InstagramMessage)
class InstagramMessageAdmin(admin.ModelAdmin):
    list_display = ["account", "sender_id", "direction", "message_type", "created_at"]
    list_filter = ["direction", "message_type"]
    search_fields = ["sender_id", "text"]


@admin.register(InstagramComment)
class InstagramCommentAdmin(admin.ModelAdmin):
    list_display = ["account", "from_username", "replied", "created_at"]
    list_filter = ["replied"]
    search_fields = ["from_username", "text"]


@admin.register(InstagramEvent)
class InstagramEventAdmin(admin.ModelAdmin):
    list_display = ["account", "event_type", "sender_id", "created_at"]
    list_filter = ["event_type"]


@admin.register(InstagramWebhook)
class InstagramWebhookAdmin(admin.ModelAdmin):
    list_display = ["event_type", "account", "signature_valid", "processed", "created_at"]
    list_filter = ["event_type", "signature_valid", "processed"]
    readonly_fields = ["payload"]

    def has_add_permission(self, request):
        return False
