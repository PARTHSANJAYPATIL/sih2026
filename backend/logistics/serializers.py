from rest_framework import serializers
from .models import Vehicle, Pickup, Delivery, Route

class VehicleSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source='driver.name', read_only=True, default='')
    driver_phone = serializers.CharField(source='driver.phone', read_only=True, default='')
    registrationNumber = serializers.CharField(source='vehicle_number', read_only=True)
    currentStatus = serializers.CharField(source='status', read_only=True)
    currentLocation = serializers.CharField(source='current_location_name', read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            'id', 'vehicle_number', 'registrationNumber', 'vehicle_type',
            'capacity_kg', 'current_load_kg', 'driver', 'driver_name',
            'driver_phone', 'current_latitude', 'current_longitude',
            'current_location_name', 'currentLocation', 'status', 'currentStatus'
        ]

class PickupSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.name', read_only=True)
    farmer_phone = serializers.CharField(source='farmer.phone', read_only=True)
    driver_name = serializers.CharField(source='driver.name', read_only=True, default='')
    vehicle_number = serializers.CharField(source='vehicle.vehicle_number', read_only=True, default='')
    collection_center_name = serializers.CharField(source='collection_center.name', read_only=True, default='')
    crop_name = serializers.SerializerMethodField()

    class Meta:
        model = Pickup
        fields = [
            'id', 'pickup_number', 'farmer', 'farmer_name', 'farmer_phone',
            'harvest', 'crop_name', 'driver', 'driver_name', 'vehicle',
            'vehicle_number', 'collection_center', 'collection_center_name',
            'scheduled_date', 'scheduled_time', 'pickup_address',
            'quantity_kg', 'proof_image_url', 'status', 'created_at'
        ]

    def get_crop_name(self, obj):
        if obj.harvest and obj.harvest.listing and obj.harvest.listing.product:
            return obj.harvest.listing.product.name
        return 'Produce'

class DeliverySerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    driver_name = serializers.CharField(source='driver.name', read_only=True, default='')
    vehicle_number = serializers.CharField(source='vehicle.vehicle_number', read_only=True, default='')

    class Meta:
        model = Delivery
        fields = [
            'id', 'delivery_number', 'order', 'order_number', 'vehicle',
            'vehicle_number', 'driver', 'driver_name', 'source', 'destination',
            'scheduled_time', 'estimated_time', 'actual_delivery_time',
            'status', 'created_at'
        ]

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = [
            'id', 'delivery', 'distance_km', 'estimated_duration',
            'route_data', 'is_optimal_claimed', 'created_at'
        ]
