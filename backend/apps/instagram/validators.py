import hashlib
import hmac

from django.conf import settings


def verify_webhook_signature(*, payload_body: bytes, signature_header: str) -> bool:
    """Verifies Meta's X-Hub-Signature-256 header against our app secret."""
    if not signature_header or not signature_header.startswith("sha256="):
        return False
    expected = hmac.new(settings.META_APP_SECRET.encode(), payload_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature_header)


def verify_webhook_challenge(*, mode: str, verify_token: str) -> bool:
    return mode == "subscribe" and verify_token == settings.META_WEBHOOK_VERIFY_TOKEN
