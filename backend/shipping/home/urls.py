from django.urls import path
from .views import PlanViewSet, TestimonialViewSet, CompanyInfoViewSet

plan_list = PlanViewSet.as_view({'get': 'list'})
testimonial_list = TestimonialViewSet.as_view({'get': 'list'})
company_info = CompanyInfoViewSet.as_view({'get': 'list'})

urlpatterns = [
    path('plans/', plan_list, name='plan-list'),
    path('testimonials/', testimonial_list, name='testimonial-list'),
    path('company/', company_info, name='company-info'),
]
