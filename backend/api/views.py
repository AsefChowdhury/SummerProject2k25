from django.shortcuts import render
from rest_framework import generics
from .serializers import DeckListSerializer, DeckSerializer, UserSerializer, CustomTokenObtainPairSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import Deck, Note
User = get_user_model()



# Create your views here.

class NoteViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    serializer_class=NoteSerializer

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user).order_by('-updated_at')
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
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