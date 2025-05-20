from django.utils import timezone
from django.http import JsonResponse
from .models import CustomerProfile

class PlanExpirationMiddleware:
    """Middleware to check if plan is expired for protected views"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Continue processing for non-authenticated users or non-plan-restricted paths
        if not request.user.is_authenticated or not self._is_plan_restricted_path(request.path):
            return self.get_response(request)

        # Check for expired plan
        try:
            profile = CustomerProfile.objects.get(user=request.user)
            if profile.is_plan_expired():
                # If plan restricted view and plan expired
                return JsonResponse(
                    {'error': 'Your plan has expired. Please upgrade to continue.'},
                    status=403
                )
        except CustomerProfile.DoesNotExist:
            pass
            
        return self.get_response(request)
        
    def _is_plan_restricted_path(self, path):
        """Check if the path should be restricted by plan status"""
        # Add your plan-restricted paths here
        restricted_paths = [
            '/api/premium-feature/',
            '/api/business-feature/',
            # Add other paths that should be restricted
        ]
        return any(path.startswith(restricted) for restricted in restricted_paths)