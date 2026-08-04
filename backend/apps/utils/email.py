from django.conf import settings
from django.core.mail import send_mail


def send_verification_email(to_email, full_name, token):
    subject = "Verify your FlowDM account"

    message = f"""
Hi {full_name},

Welcome to FlowDM.

Your verification token is:

{token}

Thank you,
FlowDM Team
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[to_email],
        fail_silently=False,
    )


def send_password_reset_email(to_email, full_name, token):
    subject = "Reset your FlowDM password"

    message = f"""
Hi {full_name},

Your password reset token is:

{token}

If you didn't request this, ignore this email.

FlowDM Team
"""

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[to_email],
        fail_silently=False,
    )