from django.urls import path
from .views import admin_login

urlpatterns = [
    path('login/', admin_login, name='admin-login'),
]
