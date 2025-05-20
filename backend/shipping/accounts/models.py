from django.contrib.auth.models import User
from django.conf import settings
from django.db import models
from django.utils import timezone
from datetime import timedelta

class Plan(models.Model):
    PLAN_CHOICES = [
        ('regular', 'Regular'),
        ('premium', 'Premium'),
        ('business', 'Business'),
    ]
    name = models.CharField(max_length=20, choices=PLAN_CHOICES, unique=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    features = models.TextField()
    weight_limit = models.IntegerField()
    
    def __str__(self):
        return self.name

class CustomerProfile(models.Model):
    user = models.OneToOneField( settings.AUTH_USER_MODEL,on_delete=models.CASCADE
    )
    current_plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, blank=True)
    plan_expiry = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.username
    
    def is_plan_expired(self):
        
        if not self.plan_expiry:
            return True
        return self.plan_expiry < timezone.now().date()
    
    def set_plan(self, plan, days=30):
        
        self.current_plan = plan
        self.plan_expiry = timezone.now().date() + timedelta(days=days)
        self.save()
