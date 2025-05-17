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
