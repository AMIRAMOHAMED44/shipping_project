from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'cities', views.CityViewSet, basename='city')
router.register(r'shipments', views.ShipmentViewSet, basename='shipment')

urlpatterns = [
    path('', include(router.urls)),
]

