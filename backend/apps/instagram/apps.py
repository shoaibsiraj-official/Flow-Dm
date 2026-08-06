from django.apps import AppConfig


class InstagramConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.instagram"
    verbose_name = "Instagram Integration"

    def ready(self):
        import apps.instagram.signals  # noqa: F401
