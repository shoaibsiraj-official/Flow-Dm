from django.core import mail
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import AuthenticationLog, EmailVerificationToken, User
from . import services


class RegistrationTests(APITestCase):
    def test_register_creates_user_and_sends_verification_email(self):
        url = reverse("authentication:register")
        payload = {"email": "founder@flowdm.ai", "username": "founder", "password": "SuperSecret123", "full_name": "Ada"}

        response = self.client.post(url, payload)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email="founder@flowdm.ai")
        self.assertFalse(user.is_verified)
        self.assertTrue(EmailVerificationToken.objects.filter(user=user).exists())
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("Verify", mail.outbox[0].subject)

    def test_register_duplicate_email_rejected(self):
        User.objects.create_user(email="dup@flowdm.ai", username="dupuser", password="SuperSecret123")
        url = reverse("authentication:register")

        response = self.client.post(url, {"email": "dup@flowdm.ai", "username": "another", "password": "SuperSecret123"})

        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertFalse(response.data["success"])

    def test_register_weak_password_rejected(self):
        url = reverse("authentication:register")
        response = self.client.post(url, {"email": "weak@flowdm.ai", "username": "weakuser", "password": "short"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_invalid_username_rejected(self):
        url = reverse("authentication:register")
        response = self.client.post(
            url, {"email": "bad@flowdm.ai", "username": "b a d!", "password": "SuperSecret123"}
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class EmailVerificationTests(APITestCase):
    def test_verify_email_activates_account(self):
        user = User.objects.create_user(email="verify@flowdm.ai", username="verifyme", password="SuperSecret123")
        token = services.issue_email_verification(user)

        url = reverse("authentication:verify-email")
        response = self.client.post(url, {"token": token.token})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.is_verified)

    def test_verify_email_invalid_token_rejected(self):
        url = reverse("authentication:verify-email")
        response = self.client.post(url, {"token": "not-a-real-token"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTests(APITestCase):
    def test_login_success_returns_tokens(self):
        User.objects.create_user(email="user@flowdm.ai", username="loginuser", password="SuperSecret123")
        url = reverse("authentication:login")

        response = self.client.post(url, {"email": "user@flowdm.ai", "password": "SuperSecret123"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_wrong_password_rejected(self):
        User.objects.create_user(email="user2@flowdm.ai", username="loginuser2", password="SuperSecret123")
        url = reverse("authentication:login")

        response = self.client.post(url, {"email": "user2@flowdm.ai", "password": "WrongPass123"})

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_account_locks_after_five_failed_attempts(self):
        User.objects.create_user(email="lockout@flowdm.ai", username="lockoutuser", password="SuperSecret123")
        url = reverse("authentication:login")

        for _ in range(5):
            self.client.post(url, {"email": "lockout@flowdm.ai", "password": "wrong"})

        response = self.client.post(url, {"email": "lockout@flowdm.ai", "password": "SuperSecret123"})
        self.assertEqual(response.status_code, status.HTTP_423_LOCKED)

    def test_failed_login_is_logged(self):
        User.objects.create_user(email="logged@flowdm.ai", username="loggeduser", password="SuperSecret123")
        url = reverse("authentication:login")

        self.client.post(url, {"email": "logged@flowdm.ai", "password": "wrong"})

        self.assertTrue(AuthenticationLog.objects.filter(action=AuthenticationLog.Action.LOGIN_FAILED).exists())


class PasswordResetTests(APITestCase):
    def test_forgot_password_does_not_leak_account_existence(self):
        url = reverse("authentication:forgot-password")
        response = self.client.post(url, {"email": "ghost@flowdm.ai"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reset_password_with_valid_token(self):
        user = User.objects.create_user(email="reset@flowdm.ai", username="resetuser", password="OldPassword123")
        services.request_password_reset(email=user.email)
        token = user.reset_tokens.first()

        url = reverse("authentication:reset-password")
        response = self.client.post(url, {"token": token.token, "new_password": "NewPassword456"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.check_password("NewPassword456"))


class ProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="profile@flowdm.ai", username="profileuser", password="SuperSecret123")
        self.client.force_authenticate(user=self.user)

    def test_get_current_user(self):
        response = self.client.get(reverse("authentication:me"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "profile@flowdm.ai")

    def test_update_profile(self):
        response = self.client.patch(reverse("authentication:me"), {"full_name": "New Name"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.full_name, "New Name")

    def test_change_password(self):
        url = reverse("authentication:change-password")
        response = self.client.post(url, {"old_password": "SuperSecret123", "new_password": "BrandNewPass123"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("BrandNewPass123"))

    def test_change_password_wrong_old_password_rejected(self):
        url = reverse("authentication:change-password")
        response = self.client.post(url, {"old_password": "WrongOld123", "new_password": "BrandNewPass123"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)