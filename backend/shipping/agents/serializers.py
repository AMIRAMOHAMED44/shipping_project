from rest_framework import serializers
from .models import Agent , DeliveryRequest
from shipments.models import Shipment
from users.serializers import UserSerializer


class AgentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Agent
        fields = ['id', 'user', 'city', 'total_earnings','active','status']

class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = ['id', 'origin', 'destination','description','weight', 'status', 'cost', 'assigned_agent', 'created_at']

class DeliveryRequestSerializer(serializers.ModelSerializer):
    tracking_id = serializers.CharField(source='shipment.tracking_number', read_only=True)
    agent_name = serializers.CharField(source='agent.user.name', read_only=True)
    destination = serializers.CharField(source='shipment.destination', read_only=True)
    status = serializers.CharField(source='shipment.status')
    customer = serializers.CharField(source='shipment.user.name', read_only=True)

    class Meta:
        model = DeliveryRequest
        fields = ['agent_name', 'tracking_id', 'destination', 'status', 'customer']
        
    def update(self, instance, validated_data):
        # عشان نعدل حالة الشحنة اللي مرتبطة بالـ DeliveryRequest
        shipment_data = validated_data.get('shipment', {})
        status = shipment_data.get('status')
        if status:
            instance.shipment.status = status
            instance.shipment.save()
        return instance