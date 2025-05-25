from django.urls import path
from . import views

urlpatterns = [
    path('earnings/', views.my_earnings, name='my-earnings'),
    path('available-shipments/', views.available_shipments, name='available-shipments'),
    path('my-shipments/', views.my_shipments, name='my-shipments'),
    path('claim-shipment/<int:shipment_id>/', views.claim_shipment, name='claim-shipment'),
    path('confirm-delivery/<int:shipment_id>/', views.confirm_delivery, name='confirm-delivery'),
]
