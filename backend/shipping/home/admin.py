from django.contrib import admin
from .models import CompanyInfo, Plan, Testimonial, ContactMessage

admin.site.register(CompanyInfo)
admin.site.register(Plan)
admin.site.register(Testimonial)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email', 'message')
    list_filter = ('created_at',)
    readonly_fields = ('name', 'email', 'message', 'created_at')

