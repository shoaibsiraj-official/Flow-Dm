from rest_framework.permissions import BasePermission


class IsVerifiedUser(BasePermission):
    """Blocks unverified accounts from touching Instagram/automation endpoints."""

    message = "Please verify your email address before accessing this resource."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_verified)


class IsOwner(BasePermission):
    """Generic object-level permission — object must have a `user` attribute equal to request.user."""

    message = "You do not own this resource."

    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, "user", None) or getattr(getattr(obj, "account", None), "user", None) or getattr(
            getattr(obj, "automation", None), "user", None
        )
        return owner == request.user
