from rest_framework import serializers

from .models import User
from .validators import validate_avatar_file, validate_strong_password, validate_username_format


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "email", "username", "full_name", "avatar_url",
            "is_verified", "created_at",
        ]
        read_only_fields = fields


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(validators=[validate_username_format])
    password = serializers.CharField(write_only=True, validators=[validate_strong_password])
    full_name = serializers.CharField(required=False, allow_blank=True, default="")


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class RefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_strong_password])


class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.CharField()


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_strong_password])


class UpdateProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, validators=[validate_username_format])

    class Meta:
        model = User
        fields = ["username", "full_name"]

    def update(self, instance, validated_data):
        from . import services

        return services.update_profile(user=instance, **validated_data)


class AvatarUploadSerializer(serializers.Serializer):
    avatar = serializers.ImageField(validators=[validate_avatar_file])


class TokenResponseSerializer(serializers.Serializer):
    """Documentation-only serializer for OpenAPI schema generation."""

    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()