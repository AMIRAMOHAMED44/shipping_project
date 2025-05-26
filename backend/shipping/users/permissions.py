from rest_framework.permissions import BasePermission

class IsStaticAdmin(BasePermission):
    def has_permission(self, request, view):
        # تحقق من توكن المستخدم وصلاحيته كأدمن
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
