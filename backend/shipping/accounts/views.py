from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomerProfile
from .serializers import CustomerProfileSerializer

class CustomerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = CustomerProfile.objects.get(user=request.user)
        serializer = CustomerProfileSerializer(profile)
        return Response(serializer.data)
