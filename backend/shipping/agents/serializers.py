from rest_framework import serializers
from .models import Agent
from shipments.models import Shipment
from users.serializers import UserSerializer 


class AgentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Agent
        fields = ['id', 'user', 'city', 'total_earnings']

class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = ['id', 'origin', 'destination','description','weight', 'status', 'cost', 'assigned_agent', 'created_at']
