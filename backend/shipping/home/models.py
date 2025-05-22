from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class Plan(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    features = models.TextField()
    price_note = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Testimonial(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=100)
    feedback = models.TextField()
    company = models.CharField(max_length=100, blank=True)
    rating = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.rating}"

class CompanyInfo(models.Model):
    intro = models.TextField()
    contact_email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    facebook = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    def __str__(self):
        return "Company Info"

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Message from {self.name}"