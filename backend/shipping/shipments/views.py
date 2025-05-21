from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Shipment, City
from .serializers import ShipmentSerializer, CitySerializer
from .utils import EGYPTIAN_CITIES
from rest_framework.exceptions import ValidationError

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    http_method_names = ['get']

    def get_queryset(self):
        queryset = super().get_queryset()
        region = self.request.query_params.get('region', None)
        if region:
            queryset = queryset.filter(region__iexact=region)
        return queryset

class ShipmentViewSet(viewsets.ModelViewSet):
    queryset = Shipment.objects.all().order_by('-created_at')
    serializer_class = ShipmentSerializer

    def validate_city(self, city_name):
        if city_name not in EGYPTIAN_CITIES:
            raise ValidationError(f"{city_name} is not a valid Egyptian city")

    def create(self, request, *args, **kwargs):
        try:
            self.validate_city(request.data.get('origin'))
            self.validate_city(request.data.get('destination'))
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        shipment = self.get_object()
        if shipment.status != 'PENDING':
            return Response(
                {"error": "Cannot cancel shipment. Only PENDING shipments can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )
        shipment.status = 'CANCELLED'
        shipment.save()
        return Response({"status": "Shipment cancelled successfully"})

    @action(detail=False, methods=['get'])
    def cities_list(self, request):
        return Response(EGYPTIAN_CITIES)

    def destroy(self, request, *args, **kwargs):
        shipment = self.get_object()
        if shipment.status != 'PENDING':
            return Response(
                {"error": "Only PENDING shipments can be deleted."},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(shipment)
        return Response({"status": "Shipment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)