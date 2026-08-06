from unittest.mock import patch

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.authentication.models import User

from .models import InstagramAccount, InstagramMessage, InstagramWebhook
from .validators import verify_webhook_signature
from . import services


class WebhookSignatureTests(APITestCase):
    def test_invalid_signature_rejected(self):
        with self.settings(META_APP_SECRET="testsecret"):
            valid = verify_webhook_signature(payload_body=b'{"a":1}', signature_header="sha256=deadbeef")
        self.assertFalse(valid)

    def test_valid_signature_accepted(self):
        import hashlib
        import hmac

        body = b'{"entry": []}'
        with self.settings(META_APP_SECRET="testsecret"):
            expected = hmac.new(b"testsecret", body, hashlib.sha256).hexdigest()
            valid = verify_webhook_signature(payload_body=body, signature_header=f"sha256={expected}")
        self.assertTrue(valid)

    def test_webhook_get_verification_challenge(self):
        with self.settings(META_WEBHOOK_VERIFY_TOKEN="mytoken"):
            url = reverse("instagram:webhook")
            response = self.client.get(url, {"hub.mode": "subscribe", "hub.verify_token": "mytoken", "hub.challenge": "12345"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content.decode(), "12345")

    def test_webhook_get_verification_wrong_token_rejected(self):
        with self.settings(META_WEBHOOK_VERIFY_TOKEN="mytoken"):
            url = reverse("instagram:webhook")
            response = self.client.get(url, {"hub.mode": "subscribe", "hub.verify_token": "wrong", "hub.challenge": "12345"})
        self.assertEqual(response.status_code, 403)


class InstagramMessageIngestionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="ig@flowdm.ai", username="iguser", password="SuperSecret123")
        self.account = InstagramAccount.objects.create(
            user=self.user,
            ig_business_id="17841400000000000",
            ig_username="mybrand",
            facebook_page_id="1234567890",
            encrypted_access_token="unused-in-this-test",
        )

    def test_ingest_message_event_creates_message(self):
        webhook = InstagramWebhook.objects.create(
            account=self.account,
            event_type="messages",
            payload={
                "entry": [
                    {
                        "id": self.account.ig_business_id,
                        "messaging": [
                            {
                                "sender": {"id": "999888777"},
                                "recipient": {"id": self.account.ig_business_id},
                                "message": {"mid": "mid.123", "text": "Hey, what's the price?"},
                            }
                        ],
                    }
                ]
            },
            signature_valid=True,
        )

        with patch("apps.automation.services.evaluate_triggers_for_message") as mock_eval:
            services.handle_webhook_event(webhook=webhook)

        message = InstagramMessage.objects.get(sender_id="999888777")
        self.assertEqual(message.text, "Hey, what's the price?")
        self.assertEqual(message.direction, InstagramMessage.Direction.INBOUND)
        mock_eval.assert_called_once()
        webhook.refresh_from_db()
        self.assertTrue(webhook.processed)


class AccountManagementTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="owner@flowdm.ai", username="owneruser", password="SuperSecret123", is_verified=True
        )
        self.other_user = User.objects.create_user(
            email="other@flowdm.ai", username="otheruser", password="SuperSecret123", is_verified=True
        )
        self.account = InstagramAccount.objects.create(
            user=self.user,
            ig_business_id="17841400000000001",
            ig_username="ownerbrand",
            facebook_page_id="1111111111",
            encrypted_access_token="unused",
        )
        self.client.force_authenticate(user=self.user)

    def test_list_accounts_returns_only_own_accounts(self):
        InstagramAccount.objects.create(
            user=self.other_user,
            ig_business_id="17841400000000002",
            facebook_page_id="2222222222",
            encrypted_access_token="unused",
        )
        response = self.client.get(reverse("instagram:account-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"] if "results" in response.data else response.data
        self.assertEqual(len(results), 1)

    def test_cannot_access_other_users_account(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(reverse("instagram:account-detail", args=[self.account.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_disconnect_account(self):
        with patch("apps.instagram.services.MetaGraphClient.unsubscribe_page_webhook"):
            response = self.client.post(reverse("instagram:account-disconnect", args=[self.account.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.account.refresh_from_db()
        self.assertEqual(self.account.status, InstagramAccount.Status.DISCONNECTED)
