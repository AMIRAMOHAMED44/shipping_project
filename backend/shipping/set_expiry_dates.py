# Run with: python manage.py shell < set_expiry_dates.py
from django.utils import timezone
from datetime import timedelta
from accounts.models import CustomerProfile

# Find profiles with plans but no expiry dates
profiles = CustomerProfile.objects.filter(
    current_plan__isnull=False,
    plan_expiry__isnull=True
)

# Set expiry date to 30 days from now
for profile in profiles:
    profile.plan_expiry = timezone.now().date() + timedelta(days=30)
    profile.save()
    print(f"Set expiry for {profile.user.username}")

print(f"Updated {profiles.count()} profiles")