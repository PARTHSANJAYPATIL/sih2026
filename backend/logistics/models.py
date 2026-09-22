import uuid
from django.db import models
from accounts.models import User
from orders.models import Order, Harvest
from collection_centers.models import CollectionCenter

class Vehicle(models.Model):
    class VehicleType(models.TextChoices):
        PICKUP = 'Pickup Truck (1 Ton)', 'Pickup Truck (1 Ton)'
        VAN = 'Refrigerated Van (1.5 Ton)', 'Refrigerated Van (1.5 Ton)'
        MINI_CARGO = 'Mini Cargo (750 kg)', 'Mini Cargo (750 kg)'
        TRUCK = 'Medium Truck (3 Ton)', 'Medium Truck (3 Ton)'
        EV = 'Electric Cargo (1 Ton)', 'Electric Cargo (1 Ton)'

    class Status(models.TextChoices):
        AVAILABLE = 'Available for pickup', 'Available for pickup'
        ON_PICKUP = 'On Pickup Route', 'On Pickup Route'
        LOADED = 'Loaded', 'Loaded'
        IN_TRANSIT = 'In Transit to Hub', 'In Transit to Hub'
        DELIVERING = 'Delivering', 'Delivering'
        MAINTENANCE = 'Maintenance', 'Maintenance'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle_number = models.CharField(max_length=50, unique=True, default='MH-10-AB-1234')
    vehicle_type = models.CharField(max_length=50, choices=VehicleType.choices, default=VehicleType.PICKUP)
    capacity_kg = models.DecimalField(max_digits=8, decimal_places=2, default=1000)
    current_load_kg = models.DecimalField(max_digits=8, decimal_places=2, default=750)
    driver = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_vehicles')
    current_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    current_location_name = models.CharField(max_length=255, default='Miraj Ring Road, Sangli')
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.AVAILABLE)

    def __str__(self):
        return f"{self.vehicle_number} ({self.vehicle_type}) - {self.status}"

class Pickup(models.Model):
    class Status(models.TextChoices):
        REQUESTED = 'REQUESTED', 'Requested'
        ASSIGNED = 'ASSIGNED', 'Assigned'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        DRIVER_ARRIVED = 'DRIVER_ARRIVED', 'Driver Arrived'
        PICKED_UP = 'PICKED_UP', 'Picked Up'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pickup_number = models.CharField(max_length=50, unique=True)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pickups')
    harvest = models.ForeignKey(Harvest, on_delete=models.SET_NULL, null=True, blank=True, related_name='pickups')
    driver = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='driver_pickups')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True)
    collection_center = models.ForeignKey(CollectionCenter, on_delete=models.SET_NULL, null=True, blank=True)
    scheduled_date = models.CharField(max_length=50, default='Today')
    scheduled_time = models.CharField(max_length=50, default='07:30 AM – 08:30 AM')
    pickup_address = models.TextField(default='Miraj Farm Plot #14, Sangli')
    quantity_kg = models.DecimalField(max_digits=8, decimal_places=2, default=300)
    proof_image_url = models.URLField(max_length=500, blank=True, default='')
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.REQUESTED)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pickup #{self.pickup_number} - {self.farmer.name} ({self.status})"

class Delivery(models.Model):
    class Status(models.TextChoices):
        ASSIGNED = 'ASSIGNED', 'Assigned'
        PICKED_UP = 'PICKED_UP', 'Picked Up'
        IN_TRANSIT = 'IN_TRANSIT', 'In Transit'
        OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', 'Out for Delivery'
        DELIVERED = 'DELIVERED', 'Delivered'
        FAILED = 'FAILED', 'Failed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    delivery_number = models.CharField(max_length=50, unique=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='deliveries')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True, blank=True)
    driver = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='driver_deliveries')
    source = models.CharField(max_length=255, default='Sangli Agro Collection Hub #4')
    destination = models.TextField(default='Kothrud, Pune')
    scheduled_time = models.CharField(max_length=50, default='05:00 PM – 07:00 PM')
    estimated_time = models.CharField(max_length=50, default='06:15 PM')
    actual_delivery_time = models.CharField(max_length=50, blank=True, default='')
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.OUT_FOR_DELIVERY)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Delivery #{self.delivery_number} for Order #{self.order.order_number}"

class Route(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, null=True, blank=True, related_name='routes')
    distance_km = models.DecimalField(max_digits=6, decimal_places=2, default=42.0)
    estimated_duration = models.CharField(max_length=50, default='1 hr 35 min')
    route_data = models.JSONField(default=dict)
    is_optimal_claimed = models.BooleanField(default=False, help_text='Disclaim absolute optimality')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Route: {self.distance_km} km ({self.estimated_duration})"
