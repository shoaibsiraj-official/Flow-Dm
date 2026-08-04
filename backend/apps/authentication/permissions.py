
from rest_framework.permissions import BasePermission


class IsUnauthenticated(BasePermission):
    """Used on register/login-style endpoints that make no sense for an already-authenticated user."""

    def has_permission(self, request, view):
        return not (request.user and request.user.is_authenticated)


class IsAccountOwner(BasePermission):
    """Object-level: the target user IS the requesting user (used on profile mutation endpoints)."""

    def has_object_permission(self, request, view, obj):
        return obj == request.user
