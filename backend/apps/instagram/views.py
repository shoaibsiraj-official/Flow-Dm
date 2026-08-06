import json
import logging
import uuid

from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView, settings

from apps.common.permissions import IsVerifiedUser

from . import services
from .models import InstagramAccount, InstagramComment, InstagramEvent, InstagramMessage
from .permissions import IsAccountOwner
from .serializers import (
    ConnectAccountSerializer,
    InstagramAccountSerializer,
    InstagramCommentSerializer,
    InstagramEventSerializer,
    InstagramMessageSerializer,
    SendMessageSerializer,
)
from .tasks import process_webhook_task
from .validators import verify_webhook_challenge, verify_webhook_signature

logger = logging.getLogger("flowdm.instagram")


class AccountListView(ListAPIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser]
    serializer_class = InstagramAccountSerializer

    def get_queryset(self):
        return services.get_user_accounts(self.request.user)


class ConnectAccountView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser]

    @extend_schema(request=ConnectAccountSerializer, responses=InstagramAccountSerializer)
    def post(self, request):
        serializer = ConnectAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        account = services.connect_account(user=request.user, **serializer.validated_data)
        return Response(InstagramAccountSerializer(account).data, status=status.HTTP_201_CREATED)


class AccountDetailView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser, IsAccountOwner]

    def get_object(self, account_id):
        account = get_object_or_404(InstagramAccount, id=account_id)
        self.check_object_permissions(self.request, account)
        return account

    def get(self, request, account_id):
        return Response(InstagramAccountSerializer(self.get_object(account_id)).data)


class ReconnectAccountView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser, IsAccountOwner]

    @extend_schema(request=ConnectAccountSerializer, responses=InstagramAccountSerializer)
    def post(self, request, account_id):
        account = get_object_or_404(InstagramAccount, id=account_id)
        self.check_object_permissions(request, account)
        serializer = ConnectAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        account = services.reconnect_account(account=account, **serializer.validated_data)
        return Response(InstagramAccountSerializer(account).data)


class DisconnectAccountView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser, IsAccountOwner]

    def post(self, request, account_id):
        account = get_object_or_404(InstagramAccount, id=account_id)
        self.check_object_permissions(request, account)
        services.disconnect_account(account)
        return Response({"detail": "Instagram account disconnected."})


class SyncProfileView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser, IsAccountOwner]

    def post(self, request, account_id):
        account = get_object_or_404(InstagramAccount, id=account_id)
        self.check_object_permissions(request, account)
        account = services.sync_profile(account)
        return Response(InstagramAccountSerializer(account).data)


class InsightsView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser, IsAccountOwner]

    def get(self, request, account_id):
        account = get_object_or_404(InstagramAccount, id=account_id)
        self.check_object_permissions(request, account)
        return Response(services.get_basic_insights(account))


class MessageListView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser, IsAccountOwner]

    def get(self, request, account_id):
        account = get_object_or_404(InstagramAccount, id=account_id)
        self.check_object_permissions(request, account)
        messages = InstagramMessage.objects.filter(account=account)
        sender_id = request.query_params.get("sender_id")
        if sender_id:
            messages = messages.filter(sender_id=sender_id)
        return Response(InstagramMessageSerializer(messages[:200], many=True).data)

    @extend_schema(request=SendMessageSerializer, responses=InstagramMessageSerializer)
    def post(self, request, account_id):
        account = get_object_or_404(InstagramAccount, id=account_id)
        self.check_object_permissions(request, account)
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = services.send_text_message(account=account, **serializer.validated_data)
        return Response(InstagramMessageSerializer(message).data, status=status.HTTP_201_CREATED)


class CommentListView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser, IsAccountOwner]

    def get(self, request, account_id):
        account = get_object_or_404(InstagramAccount, id=account_id)
        self.check_object_permissions(request, account)
        comments = InstagramComment.objects.filter(account=account)[:200]
        return Response(InstagramCommentSerializer(comments, many=True).data)


class EventListView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser, IsAccountOwner]

    def get(self, request, account_id):
        account = get_object_or_404(InstagramAccount, id=account_id)
        self.check_object_permissions(request, account)
        events = InstagramEvent.objects.filter(account=account)[:200]
        return Response(InstagramEventSerializer(events, many=True).data)


@csrf_exempt
def webhook_view(request):
    """
    Meta requires:
    GET  -> hub.challenge verification handshake
    POST -> signed event delivery (messages, comments, mentions, ...)
    """
    if request.method == "GET":
        if verify_webhook_challenge(
            mode=request.GET.get("hub.mode", ""), verify_token=request.GET.get("hub.verify_token", "")
        ):
            return HttpResponse(request.GET.get("hub.challenge", ""), status=200)
        return HttpResponse(status=403)

    if request.method == "POST":
        signature_header = request.headers.get("X-Hub-Signature-256", "")
        signature_valid = verify_webhook_signature(payload_body=request.body, signature_header=signature_header)
        if not signature_valid:
            logger.warning("Rejected Instagram webhook with invalid signature")
            return HttpResponse(status=403)

        payload = json.loads(request.body)
        process_webhook_task.delay(payload, signature_valid)
        return JsonResponse({"status": "received"})

    return HttpResponse(status=405)



class InstagramLoginURLView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        url = services.get_instagram_login_url(request.user)

        print("LOGIN URL =", url)  # <-- ye add karo

        return Response({
            "url": url
        })



from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings

User = get_user_model()


class InstagramCallbackView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):

        code = request.GET.get("code")
        state = request.GET.get("state")

        if not code:
            return Response({"error": "No code received"}, status=400)

        if not state:
            return Response({"error": "Missing state"}, status=400)

        try:
            user = User.objects.get(id=state)
        except User.DoesNotExist:
            return Response({"error": "Invalid state"}, status=400)

        services.connect_account(
            user=user,
            code=code,
            redirect_uri=settings.META_REDIRECT_URI,
        )

        return redirect("http://localhost:3000/dashboard?instagram=connected")