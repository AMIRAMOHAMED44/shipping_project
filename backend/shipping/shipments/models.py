from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings  # للتعامل مع users
from .utils import generate_tracking_id, calculate_distance, calculate_cost, calculate_delivery_time
from datetime import timedelta
from django.utils import timezone


class City(models.Model):
    name = models.CharField(max_length=100, unique=True)
    arabic_name = models.CharField(max_length=100, blank=True, null=True)
    # يمكن إضافة حقل منطقة إذا لزم الأمر
    region = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

class Shipment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_TRANSIT', 'In Transit'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    tracking_id = models.CharField(max_length=20, unique=True, blank=True)
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    weight = models.FloatField(validators=[MinValueValidator(0.1)])
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    cost = models.FloatField(null=True, blank=True)
    distance = models.FloatField(null=True, blank=True)
    estimated_delivery = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # إضافة علاقة المستخدم (يفترض أن المستخدم موجود في settings.AUTH_USER_MODEL)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shipments'
    )

    def save(self, *args, **kwargs):
        if not self.tracking_id:
            self.tracking_id = generate_tracking_id()
        if not self.distance or not self.cost or not self.estimated_delivery:
            self.calculate_shipment_details()
        super().save(*args, **kwargs)

    def calculate_shipment_details(self):
        from .utils import calculate_distance, calculate_cost, calculate_delivery_time
        try:
            self.distance = calculate_distance(self.origin, self.destination)
            self.cost = calculate_cost(self.distance, self.weight)
            delivery_days = calculate_delivery_time(self.distance)
            self.estimated_delivery = (timezone.now() + timedelta(days=delivery_days)).date()
        except Exception as e:
            self.distance = 100
            self.cost = 100 * self.weight
            delivery_days = calculate_delivery_time(self.distance)
            self.estimated_delivery = (timezone.now() + timedelta(days=delivery_days)).date()
