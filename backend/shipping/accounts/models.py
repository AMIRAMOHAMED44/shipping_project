
from django.contrib.auth.models import User
from django.db import models

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
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, blank=True)
    plan_expiry = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.username
