from django.db import models
from django.conf import settings

class Agent(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    city = models.CharField(max_length=100)
    active = models.BooleanField(default=True)
    available_shipments = models.ManyToManyField('shipments.Shipment', blank=True, related_name='available_agents')

    total_earnings = models.FloatField(default=0)  # <-- add this field

    def __str__(self):
        return f"Agent: {self.user.username} - {self.city}"

    # Optionally, remove the property or rename it
    # @property
    # def calculated_total_earnings(self):
    #     delivered_shipments = self.shipments.filter(status='DELIVERED')
    #     total = sum(shipment.cost * 0.7 for shipment in delivered_shipments if shipment.cost)
    #     return round(total, 2)
