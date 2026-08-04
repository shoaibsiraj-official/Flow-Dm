import re

from django.core.exceptions import ValidationError

USERNAME_RE = re.compile(r"^[a-zA-Z0-9_]{3,30}$")


def validate_strong_password(value: str):
    if len(value) < 10:
        raise ValidationError("Password must be at least 10 characters long.")
    if not re.search(r"[A-Z]", value):
        raise ValidationError("Password must contain at least one uppercase letter.")
    if not re.search(r"[a-z]", value):
        raise ValidationError("Password must contain at least one lowercase letter.")
    if not re.search(r"[0-9]", value):
        raise ValidationError("Password must contain at least one number.")


def validate_username_format(value: str):
    if not USERNAME_RE.match(value):
        raise ValidationError(
            "Username must be 3-30 characters and contain only letters, numbers, and underscores."
        )


def validate_avatar_file(file):
    max_size_mb = 5
    allowed_types = {"image/jpeg", "image/png", "image/webp"}
    if file.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f"Avatar must be smaller than {max_size_mb}MB.")
    content_type = getattr(file, "content_type", None)
    if content_type and content_type not in allowed_types:
        raise ValidationError("Avatar must be a JPEG, PNG, or WEBP image.")