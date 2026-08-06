from rest_framework.permissions import BasePermission


class IsAccountOwner(BasePermission):
    """Object-level: the Instagram account (or an object with an `account` FK) must belong to the requester."""

    message = "You do not have access to this Instagram account."

    def has_object_permission(self, request, view, obj):
        account = obj if hasattr(obj, "user") else getattr(obj, "account", None)
        return account is not None and account.user == request.user
