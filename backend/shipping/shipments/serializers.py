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
        # مثال، إذا كان لديك ترجمة المدينة
        return obj.origin  # أو الترجمة المناسبة

    def get_destination_arabic(self, obj):
        return obj.destination  # أو الترجمة المناسبة