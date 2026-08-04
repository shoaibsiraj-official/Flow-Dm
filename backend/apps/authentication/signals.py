import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User

logger = logging.getLogger("flowdm.auth")


@receiver(post_save, sender=User)
def log_user_created(sender, instance: User, created, **kwargs):
    if created:
        logger.info("New user registered: %s (%s)", instance.email, instance.id)