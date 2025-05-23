from rest_framework import serializers
from .models import Shipment, City
from .utils import EGYPTIAN_CITIES
from datetime import datetime, date

from rest_framework import serializers
from .models import Shipment, City


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class ShipmentSerializer(serializers.ModelSerializer):
    origin_arabic = serializers.SerializerMethodField()
    destination_arabic = serializers.SerializerMethodField()

    class Meta:
        model = Shipment
        # ذكر الحقول المطلوبة فقط دون حقل user إن لم يكن ضرورياً للعرض
        fields = [
            'tracking_id',
            'origin',
            'destination',
            'weight',
            'description',
            'status',
            'cost',
            'distance',
            'estimated_delivery',
            'created_at',
            'origin_arabic',
            'destination_arabic',
        ]
        read_only_fields = ['tracking_id', 'status', 'cost', 'distance', 'estimated_delivery', 'created_at']

    def get_origin_arabic(self, obj):
        return obj.origin  # أو الترجمة المناسبة

    def get_destination_arabic(self, obj):
        return obj.destination  # أو الترجمة المناسبة
# --------------------------------------
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