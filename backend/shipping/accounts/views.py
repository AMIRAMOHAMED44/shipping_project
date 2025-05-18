
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Plan, CustomerProfile

class CustomerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "customer":
            return Response({'detail': 'Unauthorized'}, status=403)

        
        customer_profile, created = CustomerProfile.objects.get_or_create(user=user)

       
        if not customer_profile.current_plan:
            first_plan = Plan.objects.first()
            customer_profile.current_plan = first_plan
            customer_profile.save()

        plan = customer_profile.current_plan

        current_plan_data = None
        if plan:
            current_plan_data = {
                "name": plan.name,
                "price": plan.price,
                "features": plan.features,
                "weight_limit": plan.weight_limit,
            }

        return Response({
            "user": user.username,
            "email": user.email,
            "role": user.role,
            "current_plan": current_plan_data,
            "plan_expiry": customer_profile.plan_expiry
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upgrade_plan(request):
    plan_id = request.data.get('plan_id')
    user = request.user

    # جيب البلان من الـ Model
    try:
        selected_plan = Plan.objects.get(name__iexact=plan_id)
    except Plan.DoesNotExist:
        return Response({'error': 'Invalid plan'}, status=status.HTTP_400_BAD_REQUEST)

    # جيب البروفايل وعدل الخطة
    customer_profile, created = CustomerProfile.objects.get_or_create(user=user)
    customer_profile.current_plan = selected_plan
    customer_profile.save()

    return Response({'message': 'Plan upgraded successfully'})
