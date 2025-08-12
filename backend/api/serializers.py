from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class CustomTokenObtainPairSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=254)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        identifier = data.get('identifier')
        password = data.get('password')

        user = User.objects.filter(email=identifier).first() or User.objects.filter(username=identifier).first()

        if not user or not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")
        
        if not user.is_active:
            raise AuthenticationFailed("User is not active")
        
        refresh = RefreshToken.for_user(user)


        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }