from django.urls import path
from .views import (
    ProductListView,
    MarketplaceListView,
    MarketplaceDetailView,
    FarmerListingListCreateView,
    FarmerListingDetailView
)

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('marketplace/', MarketplaceListView.as_view(), name='marketplace-list'),
    path('marketplace/<uuid:pk>/', MarketplaceDetailView.as_view(), name='marketplace-detail'),
    path('farmer/listings/', FarmerListingListCreateView.as_view(), name='farmer-listing-list-create'),
    path('farmer/listings/<uuid:pk>/', FarmerListingDetailView.as_view(), name='farmer-listing-detail'),
]
