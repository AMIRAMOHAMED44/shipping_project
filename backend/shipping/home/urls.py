from django.urls import path
from .views import PlanViewSet, TestimonialViewSet, CompanyInfoViewSet, ContactMessageView

plan_list = PlanViewSet.as_view({'get': 'list'})
testimonial_list = TestimonialViewSet.as_view({'get': 'list'})
testimonial_create = TestimonialViewSet.as_view({'post': 'create'})
company_info = CompanyInfoViewSet.as_view({'get': 'list'})

urlpatterns = [
    path('plans/', plan_list, name='plan-list'),
    path('testimonials/', testimonial_list, name='testimonial-list'),
    path('testimonials/create/', testimonial_create, name='testimonial-create'),
    path('company/', company_info, name='company-info'),
    path('contact/', ContactMessageView.as_view(), name='contact-message'),
]