"""
Symmetric encryption for secrets-at-rest (Instagram long-lived access tokens).
Requires FIELD_ENCRYPTION_KEY to be set in the environment — generate with:
    python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
"""
from cryptography.fernet import Fernet
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


def _fernet() -> Fernet:
    key = settings.FIELD_ENCRYPTION_KEY
    if not key:
        raise ImproperlyConfigured(
            "FIELD_ENCRYPTION_KEY is not set. Generate one with "
            "`python -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\"` "
            "and add it to your .env file."
        )
    return Fernet(key.encode() if isinstance(key, str) else key)


def encrypt_value(raw_value: str) -> str:
    return _fernet().encrypt(raw_value.encode()).decode()


def decrypt_value(encrypted_value: str) -> str:
    return _fernet().decrypt(encrypted_value.encode()).decode()
