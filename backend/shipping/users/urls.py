from django.urls import path
from .views import RegisterView, CurrentUserView, CustomLoginView, UserListView,UserDeleteView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('all/', UserListView.as_view(), name='user-list'),
    path('users/<int:id>/', UserDeleteView.as_view(), name='user-delete')
   
]
