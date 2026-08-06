"""Domain-event hooks for the instagram app."""
import logging

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import InstagramAccount

logger = logging.getLogger("flowdm.instagram")


@receiver(post_save, sender=InstagramAccount)
def log_account_status_change(sender, instance: InstagramAccount, created, **kwargs):
    if created:
        logger.info("Instagram account connected: @%s (user=%s)", instance.ig_username, instance.user_id)
