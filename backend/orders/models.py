import uuid
from django.db import models
from accounts.models import User
from products.models import ProduceListing

class Order(models.Model):
    class OrderType(models.TextChoices):
        CONSUMER = 'CONSUMER', 'Consumer'
        BULK = 'BULK', 'Bulk'

    class Status(models.TextChoices):
        CREATED = 'CREATED', 'Created'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        FARMER_MATCHED = 'FARMER_MATCHED', 'Farmer Matched'
        HARVEST_SCHEDULED = 'HARVEST_SCHEDULED', 'Harvest Scheduled'
        PICKUP_ASSIGNED = 'PICKUP_ASSIGNED', 'Pickup Assigned'
        PRODUCE_COLLECTED = 'PRODUCE_COLLECTED', 'Produce Collected'
        AT_COLLECTION_CENTER = 'AT_COLLECTION_CENTER', 'At Collection Center'
        QUALITY_CHECKED = 'QUALITY_CHECKED', 'Quality Checked'
        PACKED = 'PACKED', 'Packed'
        DISPATCHED = 'DISPATCHED', 'Dispatched'
        OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', 'Out for Delivery'
        DELIVERED = 'DELIVERED', 'Delivered'
        CANCELLED = 'CANCELLED', 'Cancelled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_type = models.CharField(max_length=20, choices=OrderType.choices, default=OrderType.CONSUMER)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.CREATED)

    # Transparent Cost Breakdown (Requirement 25)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text='Farmer base total')
    collection_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    transport_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    platform_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    delivery_address = models.TextField()
    delivery_city = models.CharField(max_length=100, default='Pune')
    delivery_slot = models.CharField(max_length=100, default='05:00 PM – 07:00 PM')
    delivery_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    delivery_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.order_number} ({self.buyer.name}) - {self.status}"

class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    produce_listing = models.ForeignKey(ProduceListing, on_delete=models.SET_NULL, null=True, related_name='order_items')
    crop_name = models.CharField(max_length=150)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='farmer_order_items')
    quantity = models.DecimalField(max_digits=8, decimal_places=2)
    price_per_unit = models.DecimalField(max_digits=8, decimal_places=2, help_text='Locked historical purchase rate')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.crop_name} x {self.quantity}kg (Order #{self.order.order_number})"

class FarmerOrderAllocation(models.Model):
    class Status(models.TextChoices):
        MATCHED = 'MATCHED', 'Matched'
        READY = 'READY', 'Ready for Harvest'
        PICKED_UP = 'PICKED_UP', 'Picked Up'
        AT_CENTER = 'AT_CENTER', 'At Collection Center'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='allocations')
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='order_allocations')
    produce_listing = models.ForeignKey(ProduceListing, on_delete=models.SET_NULL, null=True, blank=True)
    requested_quantity = models.DecimalField(max_digits=8, decimal_places=2)
    confirmed_quantity = models.DecimalField(max_digits=8, decimal_places=2)
    agreed_price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.MATCHED)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.farmer.name} -> {self.confirmed_quantity}kg for Order #{self.order.order_number}"

class Harvest(models.Model):
    class Status(models.TextChoices):
        PLANNED = 'PLANNED', 'Planned'
        READY = 'READY', 'Ready for Harvest'
        HARVESTED = 'HARVESTED', 'Harvested'
        COLLECTED = 'COLLECTED', 'Collected'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='harvests')
    produce_listing = models.ForeignKey(ProduceListing, on_delete=models.SET_NULL, null=True, blank=True, related_name='harvests')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name='harvests')
    planned_date = models.CharField(max_length=50)
    actual_harvest_date = models.CharField(max_length=50, blank=True, default='')
    quantity = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLANNED)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Harvest: {self.farmer.name} - {self.quantity}kg ({self.status})"
