"""
Write-side (and small read-side) business logic for authentication.
Kept framework-light: no request/response objects, so it's independently testable.
"""
import logging
from datetime import timedelta

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.core.exceptions import ApplicationError, PermissionDeniedError
from apps.utils.tokens import generate_secure_token

from .models import AuthenticationLog, EmailVerificationToken, PasswordResetToken, User
from .tasks import (send_password_reset_email,send_verification_email,)

logger = logging.getLogger("flowdm.auth")

MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


def get_user_by_email(email: str) -> User | None:
    return User.objects.filter(email__iexact=email).first()


def get_user_by_username(username: str) -> User | None:
    return User.objects.filter(username__iexact=username).first()


def get_valid_email_token(token: str) -> EmailVerificationToken | None:
    return (
        EmailVerificationToken.objects.filter(token=token, used_at__isnull=True, expires_at__gt=timezone.now())
        .select_related("user")
        .first()
    )


def get_valid_reset_token(token: str) -> PasswordResetToken | None:
    return (
        PasswordResetToken.objects.filter(token=token, used_at__isnull=True, expires_at__gt=timezone.now())
        .select_related("user")
        .first()
    )


def log_auth_event(*, user=None, email_attempted="", action: str, ip=None, user_agent=""):
    AuthenticationLog.objects.create(
        user=user, email_attempted=email_attempted, action=action, ip_address=ip, user_agent=user_agent[:255]
    )


@transaction.atomic
def register_user(*, email: str, username: str, password: str, full_name: str = "", ip=None) -> User:
    if get_user_by_email(email):
        raise ApplicationError("An account with this email already exists.", code="email_taken", status_code=409)
    if get_user_by_username(username):
        raise ApplicationError("This username is already taken.", code="username_taken", status_code=409)

    user = User.objects.create_user(email=email, username=username, password=password, full_name=full_name)
    log_auth_event(user=user, action=AuthenticationLog.Action.REGISTER, ip=ip)
    issue_email_verification(user)
    return user


def issue_email_verification(user: User) -> EmailVerificationToken:
    EmailVerificationToken.objects.filter(user=user, used_at__isnull=True).update(used_at=timezone.now())
    token = EmailVerificationToken.objects.create(
        user=user,
        token=generate_secure_token(),
        expires_at=timezone.now() + timedelta(hours=settings.EMAIL_VERIFICATION_TOKEN_TTL_HOURS),
    )
    send_verification_email(str(user.id), token.token)
    return token


@transaction.atomic
def verify_email(*, token_obj: EmailVerificationToken) -> User:
    user = token_obj.user
    user.is_verified = True
    user.save(update_fields=["is_verified"])
    token_obj.used_at = timezone.now()
    token_obj.save(update_fields=["used_at"])
    log_auth_event(user=user, action=AuthenticationLog.Action.EMAIL_VERIFIED)
    return user


def resend_verification_email(*, user: User):
    if user.is_verified:
        raise ApplicationError("This account is already verified.", code="already_verified")
    issue_email_verification(user)


def authenticate_user(*, email: str, password: str, ip=None, user_agent="") -> User:
    user = get_user_by_email(email)
    if user is None or not user.check_password(password):
        if user:
            _register_failed_attempt(user, ip=ip, user_agent=user_agent)
        else:
            log_auth_event(email_attempted=email, action=AuthenticationLog.Action.LOGIN_FAILED, ip=ip, user_agent=user_agent)
        raise ApplicationError("Invalid email or password.", code="invalid_credentials", status_code=401)

    if user.is_locked:
        raise ApplicationError(
            "Account temporarily locked due to failed login attempts. Try again later.",
            code="account_locked",
            status_code=423,
        )
    if not user.is_active:
        raise PermissionDeniedError("This account has been deactivated.")

    user.failed_login_attempts = 0
    user.last_login_ip = ip
    user.save(update_fields=["failed_login_attempts", "last_login_ip", "last_login"])
    log_auth_event(user=user, action=AuthenticationLog.Action.LOGIN_SUCCESS, ip=ip, user_agent=user_agent)
    return user


def _register_failed_attempt(user: User, ip=None, user_agent=""):
    user.failed_login_attempts += 1
    locked = False
    if user.failed_login_attempts >= MAX_FAILED_ATTEMPTS:
        user.locked_until = timezone.now() + timedelta(minutes=LOCKOUT_MINUTES)
        locked = True
    user.save(update_fields=["failed_login_attempts", "locked_until"])
    log_auth_event(user=user, action=AuthenticationLog.Action.LOGIN_FAILED, ip=ip, user_agent=user_agent)
    if locked:
        log_auth_event(user=user, action=AuthenticationLog.Action.ACCOUNT_LOCKED, ip=ip, user_agent=user_agent)


def issue_tokens_for_user(user: User) -> dict:
    from rest_framework_simplejwt.tokens import RefreshToken

    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


def logout_user(*, refresh_token: str, user: User):
    from rest_framework_simplejwt.tokens import RefreshToken

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
    except Exception as exc:
        raise ApplicationError("Invalid refresh token.", code="invalid_token", status_code=400) from exc
    log_auth_event(user=user, action=AuthenticationLog.Action.LOGOUT)


@transaction.atomic
def request_password_reset(*, email: str, ip=None):
    user = get_user_by_email(email)
    if user is None:
        return  # never leak account existence
    PasswordResetToken.objects.filter(user=user, used_at__isnull=True).update(used_at=timezone.now())
    reset = PasswordResetToken.objects.create(
        user=user,
        token=generate_secure_token(),
        expires_at=timezone.now() + timedelta(hours=settings.PASSWORD_RESET_TOKEN_TTL_HOURS),
        requested_ip=ip,
    )
    send_password_reset_email(str(user.id), reset.token)


@transaction.atomic
def reset_password(*, token_obj: PasswordResetToken, new_password: str):
    user = token_obj.user
    user.set_password(new_password)
    user.failed_login_attempts = 0
    user.locked_until = None
    user.save(update_fields=["password", "failed_login_attempts", "locked_until"])
    token_obj.used_at = timezone.now()
    token_obj.save(update_fields=["used_at"])
    log_auth_event(user=user, action=AuthenticationLog.Action.PASSWORD_RESET)


@transaction.atomic
def change_password(*, user: User, old_password: str, new_password: str):
    if not user.check_password(old_password):
        raise ApplicationError("Current password is incorrect.", code="invalid_password", status_code=400)
    user.set_password(new_password)
    user.save(update_fields=["password"])
    log_auth_event(user=user, action=AuthenticationLog.Action.PASSWORD_CHANGED)


@transaction.atomic
def update_profile(*, user: User, **fields) -> User:
    new_username = fields.get("username")
    if new_username and new_username.lower() != user.username.lower():
        if get_user_by_username(new_username):
            raise ApplicationError("This username is already taken.", code="username_taken", status_code=409)

    for key, value in fields.items():
        setattr(user, key, value)
    user.save(update_fields=list(fields.keys()) or None)
    return user


def update_avatar(*, user: User, avatar_file) -> User:
    user.avatar = avatar_file
    user.save(update_fields=["avatar"])
    return user