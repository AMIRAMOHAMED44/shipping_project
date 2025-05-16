# from django.db import models
#
# # Create your models here.
# from django.db import models
# from django.contrib.auth import get_user_model
#
# User = get_user_model()
#
# class AgentProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='agent_profile')
#     id_document = models.FileField(upload_to='agent_ids/')
#     # You can add more agent-specific fields here later, like phone, address, etc.
#
#     def __str__(self):
#         return f"Profile for {self.user.username}"
