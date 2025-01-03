from django.urls import path
from .views import (
    ProductListView,
    ProductDetailView,
    RegisterView,
    LogoutView,
    CartView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Product Endpoints
    path('api/products/', ProductListView.as_view(), name='product-list'),
    path('api/products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # User Authentication Endpoints
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Cart Endpoints
    path('api/cart/', CartView.as_view(), name='cart'),
]
