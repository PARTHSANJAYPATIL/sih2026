from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root_view(request):
    """
    API Root providing an index of all available services, documentation, and endpoints.
    """
    return Response({
        "success": True,
        "name": "Farm2Market AI REST API",
        "version": "1.0.0",
        "status": "online",
        "description": "AI-Powered Farm-to-Buyer Direct Agricultural Supply Chain Platform",
        "documentation": {
            "swagger_ui": request.build_absolute_uri('/api/docs/'),
            "redoc": request.build_absolute_uri('/api/redoc/'),
            "openapi_schema": request.build_absolute_uri('/api/schema/')
        },
        "endpoints": {
            "auth": {
                "login": request.build_absolute_uri('/api/auth/login/'),
                "register": request.build_absolute_uri('/api/auth/register/'),
                "token_refresh": request.build_absolute_uri('/api/auth/token/refresh/'),
                "me": request.build_absolute_uri('/api/auth/me/')
            },
            "marketplace": request.build_absolute_uri('/api/marketplace/'),
            "farmer_listings": request.build_absolute_uri('/api/farmer/listings/'),
            "products": request.build_absolute_uri('/api/products/'),
            "orders": request.build_absolute_uri('/api/orders/'),
            "harvests": request.build_absolute_uri('/api/harvests/'),
            "collection_centers": request.build_absolute_uri('/api/collection/centers/'),
            "quality_checks": request.build_absolute_uri('/api/collection/qc/'),
            "logistics": {
                "vehicles": request.build_absolute_uri('/api/logistics/vehicles/'),
                "pickups": request.build_absolute_uri('/api/logistics/pickups/'),
                "deliveries": request.build_absolute_uri('/api/logistics/deliveries/'),
                "routes": request.build_absolute_uri('/api/logistics/routes/'),
                "driver_dashboard": request.build_absolute_uri('/api/logistics/driver-dashboard/')
            },
            "payments": {
                "list": request.build_absolute_uri('/api/payments/'),
                "simulate_payment": request.build_absolute_uri('/api/payments/process-simulated/')
            },
            "notifications": request.build_absolute_uri('/api/notifications/'),
            "complaints": request.build_absolute_uri('/api/complaints/'),
            "ai": {
                "demand_forecast": request.build_absolute_uri('/api/ai/demand/?crop=Tomato'),
                "price_recommendation": request.build_absolute_uri('/api/ai/price-recommendation/?crop=Tomato')
            },
            "admin": {
                "dashboard": request.build_absolute_uri('/api/admin/dashboard/'),
                "analytics": request.build_absolute_uri('/api/admin/analytics/')
            }
        }
    })

def root_redirect(request):
    return redirect('/api/docs/')

urlpatterns = [
    # Root redirect to Swagger Documentation
    path('', root_redirect, name='root-redirect'),

    # Admin Panel
    path('admin/', admin.site.urls),
    
    # OpenAPI Documentation (Requirement 40)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # API Root Index
    path('api/', api_root_view, name='api-root'),

    # Domain REST Endpoints (Requirement 28)
    path('api/auth/', include('accounts.urls')),
    path('api/', include('products.urls')),
    path('api/', include('orders.urls')),
    path('api/collection/', include('collection_centers.urls')),
    path('api/logistics/', include('logistics.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/complaints/', include('complaints.urls')),
    path('api/', include('analytics.urls')),
]
