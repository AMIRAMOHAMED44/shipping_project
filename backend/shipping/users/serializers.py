from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from accounts.models import CustomerProfile, Plan
from agents.models import Agent
from django.utils import timezone
from users.models import CustomUser



User = get_user_model()

# ---------------------
# AgentSerializer FIRST
# ---------------------
class AgentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Agent
        fields = ['id', 'user', 'city', 'total_earnings']


# -------------------------------
# CustomerProfileSerializer NEXT
# -------------------------------

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class CustomerProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    current_plan = PlanSerializer()
    days_remaining = serializers.SerializerMethodField()
    plan_status = serializers.SerializerMethodField()

    class Meta:
        model = CustomerProfile
        fields = ['user', 'current_plan', 'plan_expiry', 'days_remaining', 'plan_status']

    def get_days_remaining(self, obj):
        if not obj.plan_expiry:
            return 0
        delta = obj.plan_expiry - timezone.now().date()
        return max(0, delta.days)

    def get_plan_status(self, obj):
        if not obj.plan_expiry:
            return "no plan"
        return "expired" if obj.is_plan_expired() else "active"

# User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'role', 'phone_number', 'city']
        extra_kwargs = {
            'phone_number': {'required': False},
            'city': {'required': False}
        }

    def validate(self, data):
        if data.get('role') == 'agent':
            if not data.get('city'):
                raise serializers.ValidationError({"city": "City is required for agent registration."})
        return data

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'customer'),
            phone_number=validated_data.get('phone_number', ''),
            city=validated_data.get('city', '')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    agent_profile = AgentSerializer(source='agent', read_only=True)
    customer_profile = CustomerProfileSerializer(source='customerprofile', read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'city', 'agent_profile', 'customer_profile']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        return token

    def validate(self, attrs):
        return super().validate(attrs)