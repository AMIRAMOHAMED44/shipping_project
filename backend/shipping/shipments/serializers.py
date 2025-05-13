from rest_framework import serializers
from .models import Shipment, City
from .utils import EGYPTIAN_CITIES
from datetime import datetime, date

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'arabic_name', 'region']

class ShipmentSerializer(serializers.ModelSerializer):
    origin_arabic = serializers.SerializerMethodField()
    destination_arabic = serializers.SerializerMethodField()
    delivery_time = serializers.SerializerMethodField()
    # estimated_delivery_date = serializers.DateField(source='estimated_delivery', read_only=True)

    class Meta:
        model = Shipment
        fields = '__all__'
        read_only_fields = ['tracking_id', 'status', 'cost', 'distance', 'created_at', 'updated_at']

    def get_origin_arabic(self, obj):
        return EGYPTIAN_CITIES.get(obj.origin, '')

    def get_destination_arabic(self, obj):
        return EGYPTIAN_CITIES.get(obj.destination, '')

    def get_delivery_time(self, obj):
        if obj.estimated_delivery:
            delivery_date = obj.estimated_delivery.date() if isinstance(obj.estimated_delivery, datetime) else obj.estimated_delivery
            delta = delivery_date - date.today()
            if delta.days > 0:
                return f"{delta.days} days remaining"
            elif delta.days == 0:
                return "Due today"
            return f"{-delta.days} days overdue"
        return "Not available"