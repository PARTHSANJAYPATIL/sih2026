from django.urls import path
from .views import DemandForecastAPIView, PriceRecommendationAPIView, AdminDashboardAPIView, AdminAnalyticsAPIView

urlpatterns = [
    path('ai/demand/', DemandForecastAPIView.as_view(), name='ai-demand'),
    path('ai/price-recommendation/', PriceRecommendationAPIView.as_view(), name='ai-price-recommendation'),
    path('admin/dashboard/', AdminDashboardAPIView.as_view(), name='admin-dashboard'),
    path('admin/analytics/', AdminAnalyticsAPIView.as_view(), name='admin-analytics'),
]
