from django.db import models

class Plan(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    features = models.TextField()  # Comma-separated list
    price_note = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    feedback = models.TextField()
    company = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.name} ({self.company})"

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
