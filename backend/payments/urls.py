from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, PriceBreakdownView

router = DefaultRouter()
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = [
    path('order/<uuid:order_id>/breakdown/', PriceBreakdownView.as_view(), name='order-price-breakdown'),
    path('', include(router.urls)),
]
