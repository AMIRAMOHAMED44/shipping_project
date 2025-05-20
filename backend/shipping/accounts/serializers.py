from rest_framework import serializers
from .models import CustomerProfile, Plan
from django.utils import timezone

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