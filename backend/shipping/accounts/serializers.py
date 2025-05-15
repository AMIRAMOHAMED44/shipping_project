
from rest_framework import serializers
from .models import CustomerProfile, Plan

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class CustomerProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    current_plan = PlanSerializer()

    class Meta:
        model = CustomerProfile
        fields = ['user', 'current_plan', 'plan_expiry']
