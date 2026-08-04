import secrets


def generate_secure_token(length=32):
    """
    Generate a secure random token.
    """
    return secrets.token_urlsafe(length)