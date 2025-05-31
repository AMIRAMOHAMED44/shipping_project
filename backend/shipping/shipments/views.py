from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from .models import Shipment, City
from .serializers import ShipmentSerializer, CitySerializer
from .utils import EGYPTIAN_CITIES
from accounts.models import CustomerProfile  # Import CustomerProfile

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
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Shipment.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user
        try:
            customer_profile = CustomerProfile.objects.get(user=user)
            plan = customer_profile.current_plan
            if not plan:
                raise ValidationError("No plan assigned to your account.")
            shipment_weight = serializer.validated_data.get('weight')
            if shipment_weight > plan.weight_limit:
                raise ValidationError(
                    f"❌ Weight exceeds your plan limit of {plan.weight_limit} kg for {plan.name.capitalize()} plan")
        except CustomerProfile.DoesNotExist:
            raise ValidationError("Customer profile not found. Please contact support.")

        serializer.save(user=user)

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

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def track(self, request):
        tracking_id = request.query_params.get('tracking_id')
        if not tracking_id:
            return Response({"error": "Tracking ID required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            shipment = Shipment.objects.get(tracking_id=tracking_id)
            serializer = self.get_serializer(shipment)
            return Response(serializer.data)
        except Shipment.DoesNotExist:
            return Response({"error": "Shipment not found"}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, *args, **kwargs):
        shipment = self.get_object()
        if shipment.status != 'PENDING':
            return Response(
                {"error": "Only PENDING shipments can be deleted."},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(shipment)
        return Response({"status": "Shipment deleted successfully"}, status=status.HTTP_204_NO_CONTENT)