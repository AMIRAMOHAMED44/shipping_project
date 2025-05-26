from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework_simplejwt.tokens import RefreshToken

@csrf_exempt
def admin_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
        except Exception:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

        if email == settings.ADMIN_EMAIL and password == settings.ADMIN_PASSWORD:
            # إنشاء توكنات يدوياً
            # هنا ممكن تنشئ user افتراضي أو تستخدم أي object dummy
            # لكن لازم يكون فيه user عشان الـ RefreshToken يشتغل
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # ممكن تنشئ يوزر مؤقت لو مش موجود
                user = User(email=email, username="admin")
                user.set_password(password)
                user.save()

            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }, status=200)

        else:
            return JsonResponse({"error": "Invalid credentials"}, status=401)
    else:
        return JsonResponse({"error": "Only POST method allowed"}, status=405)
