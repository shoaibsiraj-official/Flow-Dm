import logging
from django.utils import timezone

logger = logging.getLogger("flowdm.auth")


def send_verification_email(user_id: str, token: str):
    from apps.utils.email import send_verification_email
    from .models import User

    try:
        user = User.objects.get(id=user_id)

        send_verification_email(
            to_email=user.email,
            full_name=user.full_name,
            token=token,
        )

        logger.info("Verification email sent to %s", user.email)

    except Exception as exc:
        logger.error(
            "Failed to send verification email to user %s: %s",
            user_id,
            exc,
        )


def send_password_reset_email(user_id: str, token: str):
    from apps.utils.email import send_password_reset_email
    from .models import User

    try:
        user = User.objects.get(id=user_id)

        send_password_reset_email(
            to_email=user.email,
            full_name=user.full_name,
            token=token,
        )

        logger.info("Password reset email sent to %s", user.email)

    except Exception as exc:
        logger.error(
            "Failed to send password reset email to user %s: %s",
            user_id,
            exc,
        )


def cleanup_expired_tokens():
    from .models import EmailVerificationToken, PasswordResetToken

    now = timezone.now()

    EmailVerificationToken.objects.filter(
        expires_at__lt=now
    ).delete()

    PasswordResetToken.objects.filter(
        expires_at__lt=now
    ).delete()

    logger.info("Expired tokens cleaned.")