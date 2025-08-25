from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import CustomUser, Deck, Flashcard
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ["id", "term", "definition", "index"]

class DeckSerializer(serializers.ModelSerializer):
    flashcards = FlashcardSerializer(many=True, write_only=True)
    class Meta:
        model = Deck
        fields = ['id', 'title', 'flashcards']
    
    def create(self, validated_data):
        flashcard_data = validated_data.pop('flashcards')
        deck = Deck.objects.create(**validated_data)
        for flashcard in flashcard_data:
            Flashcard.objects.create(deck=deck, **flashcard)
        return deck

class DeckListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ['id', 'title']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class CustomTokenObtainPairSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=254)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        identifier = data.get('identifier')
        password = data.get('password')

        user = CustomUser.objects.filter(email=identifier).first() or CustomUser.objects.filter(username=identifier).first()

        if not user or not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")
        
        if not user.is_active:
            raise AuthenticationFailed("User is not active")
        
        refresh = RefreshToken.for_user(user)


        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }