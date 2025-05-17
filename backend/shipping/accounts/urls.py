from django.urls import path
from .views import CustomerDashboardView

urlpatterns = [
    path('account/', CustomerDashboardView.as_view(), name='customer-dashboard'),
]
