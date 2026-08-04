from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.exceptions import ApplicationError

from . import services
from .models import User
from .serializers import (
    AvatarUploadSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    LogoutSerializer,
    RefreshSerializer,
    RegisterSerializer,
    ResendVerificationSerializer,
    ResetPasswordSerializer,
    TokenResponseSerializer,
    UpdateProfileSerializer,
    UserSerializer,
    VerifyEmailSerializer,
)


def _client_ip(request) -> str | None:
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    return xff.split(",")[0].strip() if xff else request.META.get("REMOTE_ADDR")


def _user_agent(request) -> str:
    return request.META.get("HTTP_USER_AGENT", "")


class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    @extend_schema(request=RegisterSerializer, responses=UserSerializer)
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not serializer.is_valid():
         print("=" * 50)
         print(serializer.errors)
         print("=" * 50)
         
         return Response(serializer.errors, status=400)
         
        user = services.register_user(**serializer.validated_data, ip=_client_ip(request))
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    @extend_schema(request=VerifyEmailSerializer, responses=UserSerializer)
    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token_obj = services.get_valid_email_token(serializer.validated_data["token"])
        if not token_obj:
            raise ApplicationError("Invalid or expired verification token.", code="invalid_token")
        user = services.verify_email(token_obj=token_obj)
        return Response(UserSerializer(user).data)


class ResendVerificationEmailView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    @extend_schema(request=ResendVerificationSerializer)
    def post(self, request):
        serializer = ResendVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = services.get_user_by_email(serializer.validated_data["email"])
        if user:
            services.resend_verification_email(user=user)
        return Response({"detail": "If that account exists and is unverified, a new email has been sent."})


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    @extend_schema(request=LoginSerializer, responses=TokenResponseSerializer)
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = services.authenticate_user(
            email=data["email"], password=data["password"], ip=_client_ip(request), user_agent=_user_agent(request)
        )
        tokens = services.issue_tokens_for_user(user)
        return Response({**tokens, "user": UserSerializer(user).data})


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    @extend_schema(request=RefreshSerializer)
    def post(self, request):
        from rest_framework_simplejwt.tokens import RefreshToken

        serializer = RefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            token = RefreshToken(serializer.validated_data["refresh"])
            return Response({"access": str(token.access_token)})
        except Exception as exc:
            raise ApplicationError("Invalid or expired refresh token.", code="invalid_token", status_code=401) from exc


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(request=LogoutSerializer)
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        services.logout_user(refresh_token=serializer.validated_data["refresh"], user=request.user)
        return Response(status=status.HTTP_205_RESET_CONTENT)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    @extend_schema(request=ForgotPasswordSerializer)
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        services.request_password_reset(email=serializer.validated_data["email"], ip=_client_ip(request))
        return Response({"detail": "If that email exists, a password reset link has been sent."})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "auth"

    @extend_schema(request=ResetPasswordSerializer)
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token_obj = services.get_valid_reset_token(serializer.validated_data["token"])
        if not token_obj:
            raise ApplicationError("Invalid or expired reset token.", code="invalid_token")
        services.reset_password(token_obj=token_obj, new_password=serializer.validated_data["new_password"])
        return Response({"detail": "Password has been reset successfully. Please log in."})


class ChangePasswordView(APIView):
    @extend_schema(request=ChangePasswordSerializer)
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        services.change_password(user=request.user, **serializer.validated_data)
        return Response({"detail": "Password changed successfully."})


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data)


class AvatarUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    @extend_schema(request=AvatarUploadSerializer, responses=UserSerializer)
    def post(self, request):
        serializer = AvatarUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = services.update_avatar(user=request.user, avatar_file=serializer.validated_data["avatar"])
        return Response(UserSerializer(user).data)