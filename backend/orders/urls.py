from django.urls import path
from .views import (
    OrderListCreateView,
    OrderDetailView,
    OrderStatusUpdateView,
    HarvestListCreateView,
    HarvestUpdateView
)

urlpatterns = [
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<uuid:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<uuid:pk>/status/', OrderStatusUpdateView.as_view(), name='order-status-update'),
    path('harvests/', HarvestListCreateView.as_view(), name='harvest-list-create'),
    path('harvests/<uuid:pk>/', HarvestUpdateView.as_view(), name='harvest-update'),
]
