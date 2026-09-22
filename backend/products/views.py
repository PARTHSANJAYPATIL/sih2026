from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.db.models import Q
from common.response import api_response, api_error
from accounts.permissions import IsFarmer
from .models import Product, ProduceListing
from .serializers import ProductSerializer, ProduceListingSerializer

class ProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.all().order_by('name')
        serializer = ProductSerializer(products, many=True)
        return api_response(data=serializer.data)

class MarketplaceListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = ProduceListing.objects.filter(status=ProduceListing.Status.ACTIVE).select_related('farmer', 'product')

        # Filters
        category = request.query_params.get('category')
        if category and category != 'All':
            queryset = queryset.filter(product__category=category)

        crop = request.query_params.get('crop')
        if crop and crop != 'All':
            queryset = queryset.filter(product__name__icontains=crop)

        location = request.query_params.get('location')
        if location and location != 'All':
            queryset = queryset.filter(location__iexact=location)

        quality = request.query_params.get('quality')
        if quality and quality != 'All':
            queryset = queryset.filter(quality_grade=quality)

        organic = request.query_params.get('organic')
        if organic is not None and organic.lower() == 'true':
            queryset = queryset.filter(organic=True)

        max_price = request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(price_per_unit__lte=float(max_price))
            except ValueError:
                pass

        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(product__name__icontains=search) |
                Q(variety__icontains=search) |
                Q(farmer__name__icontains=search) |
                Q(location__icontains=search)
            )

        serializer = ProduceListingSerializer(queryset, many=True)
        return api_response(data=serializer.data)

class MarketplaceDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            listing = ProduceListing.objects.select_related('farmer', 'product').get(pk=pk)
            serializer = ProduceListingSerializer(listing)
            return api_response(data=serializer.data)
        except ProduceListing.DoesNotExist:
            return api_error(code="NOT_FOUND", message="Produce listing not found", status_code=404)

class FarmerListingListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Farmers see their own listings; Admins see all
        if request.user.role == 'ADMIN' or request.user.is_staff:
            listings = ProduceListing.objects.all().order_by('-created_at')
        else:
            listings = ProduceListing.objects.filter(farmer=request.user).order_by('-created_at')
        serializer = ProduceListingSerializer(listings, many=True)
        return api_response(data=serializer.data)

    def post(self, request):
        if request.user.role != 'FARMER' and not request.user.is_staff:
            return api_error(code="PERMISSION_DENIED", message="Only registered farmers can list produce", status_code=403)

        serializer = ProduceListingSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            listing = serializer.save()
            return api_response(data=ProduceListingSerializer(listing).data, message="Produce listed successfully", status_code=201)
        return api_error(code="VALIDATION_ERROR", message="Invalid listing data", details=serializer.errors)

class FarmerListingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            listing = ProduceListing.objects.get(pk=pk)
        except ProduceListing.DoesNotExist:
            return api_error(code="NOT_FOUND", message="Listing not found", status_code=404)

        if listing.farmer != request.user and request.user.role != 'ADMIN' and not request.user.is_staff:
            return api_error(code="PERMISSION_DENIED", message="You cannot edit another farmer's listing", status_code=403)

        serializer = ProduceListingSerializer(listing, data=request.data, partial=True)
        if serializer.is_valid():
            updated = serializer.save()
            return api_response(data=ProduceListingSerializer(updated).data, message="Listing updated successfully")
        return api_error(code="VALIDATION_ERROR", message="Update failed", details=serializer.errors)

    def delete(self, request, pk):
        try:
            listing = ProduceListing.objects.get(pk=pk)
        except ProduceListing.DoesNotExist:
            return api_error(code="NOT_FOUND", message="Listing not found", status_code=404)

        if listing.farmer != request.user and request.user.role != 'ADMIN' and not request.user.is_staff:
            return api_error(code="PERMISSION_DENIED", message="You cannot delete another farmer's listing", status_code=403)

        listing.status = ProduceListing.Status.EXPIRED
        listing.save()
        return api_response(message="Listing deactivated successfully")
