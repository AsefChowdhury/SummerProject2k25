from django.shortcuts import render
from rest_framework import generics
from .serializers import CustomTokenRefreshSerializer, DeckListSerializer, DeckSerializer, UserSerializer, CustomTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework import viewsets
from rest_framework.views import APIView
from .models import Deck
User = get_user_model()

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
        response = Response()
        response.delete_cookie('refresh')
        return response