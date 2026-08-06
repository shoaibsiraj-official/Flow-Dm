"""
Thin, typed wrapper around the Meta Graph API for Instagram Business messaging.
Framework-agnostic (only depends on `requests` + settings) so it's trivially
unit-testable with a mocked session.
"""
import logging

import requests
from django.conf import settings

logger = logging.getLogger("flowdm.instagram")

GRAPH_BASE = "https://graph.facebook.com"


class GraphAPIError(Exception):
    def __init__(self, message: str, status_code: int | None = None, payload: dict | None = None):
        super().__init__(message)
        self.status_code = status_code
        self.payload = payload or {}


class MetaGraphClient:
    def __init__(self, access_token: str = "", api_version: str | None = None):
        self.access_token = access_token
        self.api_version = api_version or settings.META_GRAPH_API_VERSION
        self.session = requests.Session()

    def _url(self, path: str) -> str:
        return f"{GRAPH_BASE}/{self.api_version}/{path.lstrip('/')}"

    def _request(self, method: str, path: str, **kwargs) -> dict:
        params = kwargs.pop("params", {}) or {}
        if self.access_token:
            params["access_token"] = self.access_token
        try:
            response = self.session.request(method, self._url(path), params=params, timeout=15, **kwargs)
        except requests.RequestException as exc:
            logger.error("Graph API request failed: %s %s — %s", method, path, exc)
            raise GraphAPIError(f"Network error calling Graph API: {exc}") from exc

        if response.status_code >= 400:
            payload = response.json() if response.content else {}
            logger.error("Graph API error %s on %s: %s", response.status_code, path, payload)
            raise GraphAPIError(f"Graph API error on {path}: {response.status_code}", response.status_code, payload)

        return response.json() if response.content else {}

    # ---- OAuth ----
    def exchange_code_for_token(self, code: str, redirect_uri: str) -> dict:
        return self._request(
            "GET",
            "oauth/access_token",
            params={
                "client_id": settings.META_APP_ID,
                "client_secret": settings.META_APP_SECRET,
                "redirect_uri": redirect_uri,
                "code": code,
            },
        )

    def exchange_for_long_lived_token(self, short_lived_token: str) -> dict:
        return self._request(
            "GET",
            "oauth/access_token",
            params={
                "grant_type": "fb_exchange_token",
                "client_id": settings.META_APP_ID,
                "client_secret": settings.META_APP_SECRET,
                "fb_exchange_token": short_lived_token,
            },
        )

    # ---- Account discovery / profile sync ----
    def get_managed_pages(self):
      return self._request(
        "GET",
        "me/accounts",
        params={
            "fields": "id,name,access_token,instagram_business_account"
        }
    ).get("data", [])

    def get_ig_business_profile(self, ig_business_id: str) -> dict:
        return self._request(
            "GET",
            ig_business_id,
            params={"fields": "id,username,profile_picture_url,followers_count,media_count,name"},
        )

    def get_ig_basic_insights(self, ig_business_id: str) -> dict:
        return self._request(
            "GET",
            f"{ig_business_id}/insights",
            params={"metric": "impressions,reach,profile_views", "period": "day"},
        )

    def subscribe_page_webhook(self, page_id: str, page_access_token: str):
      return self._request(
        "POST",
        f"{page_id}/subscribed_apps",
        params={
            "subscribed_fields": "messages"
        },
        data={
            "access_token": page_access_token,
        },
    )

    def unsubscribe_page_webhook(self, page_id: str, page_access_token: str) -> dict:
        return self._request("DELETE", f"{page_id}/subscribed_apps", data={"access_token": page_access_token})

    # ---- Messaging ----
    def send_text_message(self, ig_business_id: str, recipient_id: str, text: str) -> dict:
        return self._request(
            "POST",
            f"{ig_business_id}/messages",
            json={"recipient": {"id": recipient_id}, "message": {"text": text}},
        )

    def send_typing_indicator(self, ig_business_id: str, recipient_id: str) -> dict:
        return self._request(
            "POST",
            f"{ig_business_id}/messages",
            json={"recipient": {"id": recipient_id}, "sender_action": "typing_on"},
        )

    def reply_to_comment(self, comment_id: str, message: str) -> dict:
        return self._request("POST", f"{comment_id}/replies", data={"message": message})
