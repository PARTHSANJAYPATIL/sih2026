from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, PickupViewSet, DeliveryViewSet, RouteViewSet, DriverDashboardView

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'pickups', PickupViewSet, basename='pickup')
router.register(r'deliveries', DeliveryViewSet, basename='delivery')
router.register(r'routes', RouteViewSet, basename='route')

urlpatterns = [
    path('driver-dashboard/', DriverDashboardView.as_view(), name='driver-dashboard'),
    path('', include(router.urls)),
]
