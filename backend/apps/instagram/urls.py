from django.urls import path

from . import views

app_name = "instagram"

urlpatterns = [
    path("webhook/", views.webhook_view, name="webhook"),

    path("accounts/", views.AccountListView.as_view(), name="account-list"),
    path("accounts/connect/", views.ConnectAccountView.as_view(), name="account-connect"),
    path("accounts/<uuid:account_id>/", views.AccountDetailView.as_view(), name="account-detail"),
    path("accounts/<uuid:account_id>/reconnect/", views.ReconnectAccountView.as_view(), name="account-reconnect"),
    path("accounts/<uuid:account_id>/disconnect/", views.DisconnectAccountView.as_view(), name="account-disconnect"),
    path("accounts/<uuid:account_id>/sync/", views.SyncProfileView.as_view(), name="account-sync"),
    path("accounts/<uuid:account_id>/insights/", views.InsightsView.as_view(), name="account-insights"),
    path("accounts/<uuid:account_id>/messages/", views.MessageListView.as_view(), name="account-messages"),
    path("accounts/<uuid:account_id>/comments/", views.CommentListView.as_view(), name="account-comments"),
    path("accounts/<uuid:account_id>/events/", views.EventListView.as_view(), name="account-events"),
    path(
    "login-url/",
    views.InstagramLoginURLView.as_view(),
    name="instagram-login-url",
),
path(
    "callback/",
    views.InstagramCallbackView.as_view(),
    name="instagram-callback",
),
]
