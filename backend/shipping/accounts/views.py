from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
from .models import Plan, CustomerProfile


class CustomerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != "customer":
            return Response({'detail': 'Unauthorized'}, status=403)

        customer_profile, created = CustomerProfile.objects.get_or_create(user=user)

        # Check if plan is expired
        if customer_profile.is_plan_expired():
            # If plan is expired, you might want to reset to a free plan or handle differently
            # For now, we'll keep the current plan but inform the user it's expired
            plan_status = "expired"
        else:
            plan_status = "active"

        if not customer_profile.current_plan:
            first_plan = Plan.objects.first()
            # Set the plan with 30-day expiration
            customer_profile.set_plan(first_plan)
            plan_status = "active"

        plan = customer_profile.current_plan
        current_plan_data = None
        if plan:
            current_plan_data = {
                "name": plan.name,
                "price": plan.price,
                "features": plan.features,
                "weight_limit": plan.weight_limit,
                "status": plan_status
            }

        # Calculate days remaining until expiry
        days_remaining = None
        if customer_profile.plan_expiry:
            delta = customer_profile.plan_expiry - timezone.now().date()
            days_remaining = max(0, delta.days)

        return Response({
            "user": user.username,
            "email": user.email,
            "role": user.role,
            "current_plan": current_plan_data,
            "plan_expiry": customer_profile.plan_expiry,
            "days_remaining": days_remaining
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upgrade_plan(request):
    plan_id = request.data.get('plan_id')
    user = request.user

    # Get the plan from the Model
    try:
        selected_plan = Plan.objects.get(name__iexact=plan_id)
    except Plan.DoesNotExist:
        return Response({'error': 'Invalid plan'}, status=status.HTTP_400_BAD_REQUEST)

    # Get profile and update the plan with 30-day expiration
    customer_profile, created = CustomerProfile.objects.get_or_create(user=user)
    customer_profile.set_plan(selected_plan)  # Using our new method that also sets expiry

    return Response({
        'message': 'Plan upgraded successfully',
        'plan_name': selected_plan.name,
        'plan_expiry': customer_profile.plan_expiry
    })