from django.urls import path
from .views import CustomerDashboardView
from .views import upgrade_plan

urlpatterns = [
    path('account/', CustomerDashboardView.as_view(), name='customer-dashboard'),
    path('upgrade/', upgrade_plan, name='upgrade-plan'),
    
]