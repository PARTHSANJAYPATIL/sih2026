from django.contrib import admin
from .models import Vehicle, Pickup, Delivery, Route

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('vehicle_number', 'vehicle_type', 'capacity_kg', 'current_load_kg', 'driver', 'status')
    list_filter = ('vehicle_type', 'status')
    search_fields = ('vehicle_number', 'driver__name')

@admin.register(Pickup)
class PickupAdmin(admin.ModelAdmin):
    list_display = ('pickup_number', 'farmer', 'driver', 'scheduled_date', 'quantity_kg', 'status')
    list_filter = ('status', 'scheduled_date')
    search_fields = ('pickup_number', 'farmer__name', 'driver__name')

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('delivery_number', 'order', 'driver', 'destination', 'scheduled_time', 'status')
    list_filter = ('status',)
    search_fields = ('delivery_number', 'destination', 'driver__name')

@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ('id', 'delivery', 'distance_km', 'estimated_duration', 'is_optimal_claimed')
