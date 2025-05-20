from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import CustomerProfile, Plan
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User)
def create_customer_profile(sender, instance, created, **kwargs):
    if created and instance.role == "customer":
        if not CustomerProfile.objects.filter(user=instance).exists():
            plan = Plan.objects.first()  # First plan
            profile = CustomerProfile.objects.create(user=instance, current_plan=plan)
            
            # Set the plan expiry date to 30 days from now
            profile.plan_expiry = timezone.now().date() + timedelta(days=30)
            profile.save()