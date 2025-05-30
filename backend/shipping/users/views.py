import logging
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer
from agents.models import Agent
from rest_framework.permissions import IsAuthenticated
from django.db import IntegrityError
from .permissions import IsStaticAdmin


logger = logging.getLogger(__name__)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        try:
            user = serializer.save()
            if user.role == 'agent':
                Agent.objects.get_or_create(user=user, defaults={"city" : user.city})
            logger.info(f"User registered: {user.username}, role: {user.role}")
            return user
        except IntegrityError as e:
            logger.error(f"IntegrityError during registration: {str(e)}")
            return Response(
                {"error": f"Registration failed: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        result = self.perform_create(serializer)
        if isinstance(result, Response):
            return result
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Registration successful"}, status=status.HTTP_201_CREATED, headers=headers)

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# customers data
class CustomerListView(generics.ListAPIView):
    queryset = User.objects.filter(role='customer')
    serializer_class = UserSerializer
    permission_classes = [IsStaticAdmin]

# agents data
class AgentListView(generics.ListAPIView):
    queryset = User.objects.filter(role='agent')
    serializer_class = UserSerializer
    permission_classes = [IsStaticAdmin] 

# delete users from admindashboard
class UserDeleteView(generics.RetrieveDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsStaticAdmin]