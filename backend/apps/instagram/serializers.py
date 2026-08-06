from rest_framework import serializers

from .models import InstagramAccount, InstagramComment, InstagramEvent, InstagramMessage


class InstagramAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramAccount
        fields = [
            "id", "ig_business_id", "ig_username", "ig_name", "profile_picture_url",
            "followers_count", "media_count", "facebook_page_name", "status",
            "webhook_subscribed", "connected_at", "last_synced_at",
        ]
        read_only_fields = fields


class ConnectAccountSerializer(serializers.Serializer):
    code = serializers.CharField()
    redirect_uri = serializers.CharField()


class InstagramMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramMessage
        fields = [
            "id", "sender_id", "recipient_id", "direction", "message_type",
            "text", "media_url", "is_read", "created_at",
        ]
        read_only_fields = fields


class SendMessageSerializer(serializers.Serializer):
    recipient_id = serializers.CharField()
    text = serializers.CharField()


class InstagramCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramComment
        fields = ["id", "media_id", "comment_id", "from_user_id", "from_username", "text", "replied", "created_at"]
        read_only_fields = fields


class InstagramEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstagramEvent
        fields = ["id", "event_type", "sender_id", "payload", "created_at"]
        read_only_fields = fields
