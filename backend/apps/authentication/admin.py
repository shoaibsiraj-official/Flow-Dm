


from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import AuthenticationLog, EmailVerificationToken, PasswordResetToken, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ["-created_at"]
    list_display = ["email", "username", "full_name", "is_verified", "is_active", "is_staff", "created_at"]
    list_filter = ["is_active", "is_verified", "is_staff"]
    search_fields = ["email", "username", "full_name"]
    readonly_fields = ["id", "created_at", "updated_at", "last_login"]
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Profile", {"fields": ("full_name", "avatar")}),
        ("Security", {"fields": ("is_verified", "failed_login_attempts", "locked_until", "last_login_ip")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Timestamps", {"fields": ("created_at", "updated_at", "last_login")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "username", "password1", "password2")}),
    )


@admin.register(AuthenticationLog)
class AuthenticationLogAdmin(admin.ModelAdmin):
    list_display = ["created_at", "user", "email_attempted", "action", "ip_address"]
    list_filter = ["action"]
    search_fields = ["user__email", "email_attempted", "ip_address"]
    readonly_fields = [f.name for f in AuthenticationLog._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


admin.site.register(EmailVerificationToken)
admin.site.register(PasswordResetToken)
