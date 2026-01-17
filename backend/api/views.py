from django.shortcuts import render
from rest_framework import generics
from .serializers import CustomTokenRefreshSerializer, DeckListSerializer, DeckSerializer, ForgotPasswordSerializer, ResetPasswordSerializer, UserSerializer, CustomTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework import viewsets
from rest_framework.views import APIView
from .models import Deck
import threading
User = get_user_model()
from rest_framework.decorators import api_view, permission_classes
from dotenv import load_dotenv
import os

load_dotenv()


# Create your views here.

class DeckViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Deck.objects.filter(author=user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return DeckListSerializer
        else:
            return DeckSerializer
        
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        tokens = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        return Response({**serializer.data, **tokens}, status=status.HTTP_201_CREATED)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        response = Response({
            "access": serializer.validated_data['access'],
        }, status=status.HTTP_200_OK)
        response.set_cookie(key='refresh', value=serializer.validated_data['refresh'], httponly=True)
        return response
    
class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        token = RefreshToken(request.COOKIES.get("refresh"))
        token.blacklist()
        response = Response()
        response.delete_cookie('refresh')
        return response

def sendPasswordResetEmail(email):
    user = User.objects.filter(email=email).first()
    if user:
        token = PasswordResetTokenGenerator().make_token(user)
        send_mail('Password Reset', f'Hi {user.username}, Your password reset link is http://localhost:5173/reset-password/{user.id}/{token}', f'django@{os.getenv("EMAIL_DOMAIN", "example.com")}', [email])

def resetPassword(uid, token, password):
    user = User.objects.filter(id=uid).first()
    if user and PasswordResetTokenGenerator().check_token(user, token):
        user.set_password(password)
        user.save()

@api_view(['POST'])
@permission_classes([AllowAny])
def passwordForgotRequest(request):
    serializer = ForgotPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = request.data.get('email')
    threading.Thread(target=sendPasswordResetEmail, args=(email,)).start()
    return Response({"message": "If the email exists, a reset link was sent"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def passwordResetRequest(request):
    serializer = ResetPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    threading.Thread(target=resetPassword, args=(request.data.get('uid'), request.data.get('token'), request.data.get('password'),)).start()
    return Response({"message": "If the user exists, their password has been reset"}, status=status.HTTP_200_OK)