from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Agent

User = get_user_model()

@receiver(post_save, sender=User)
def create_agent_profile(sender, instance, created, **kwargs):
    if created and instance.role == "agent":
        if not Agent.objects.filter(user=instance).exists():
            Agent.objects.create(user=instance, city=instance.city, active=True, total_earnings=0.0)