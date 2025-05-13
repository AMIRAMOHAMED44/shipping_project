from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'shipments', views.ShipmentViewSet, basename='shipment')
router.register(r'cities', views.CityViewSet, basename='city')

urlpatterns = [
    path('', include(router.urls)),
]