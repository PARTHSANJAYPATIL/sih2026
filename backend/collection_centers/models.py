import uuid
from django.db import models
from accounts.models import User
from products.models import Product
from orders.models import Order, Harvest

class CollectionCenter(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        INACTIVE = 'INACTIVE', 'Inactive'
        FULL = 'FULL', 'Full'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='managed_centers')
    address = models.TextField()
    district = models.CharField(max_length=100, default='Sangli')
    state = models.CharField(max_length=100, default='Maharashtra')
    pincode = models.CharField(max_length=10, blank=True, default='')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    capacity = models.DecimalField(max_digits=10, decimal_places=2, default=15000, help_text='kg')
    current_capacity = models.DecimalField(max_digits=10, decimal_places=2, default=8400)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    contact_phone = models.CharField(max_length=20, default='+91 97630 11980')

    def __str__(self):
        return f"{self.name} ({self.district})"

class CollectionReceipt(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        VERIFIED = 'VERIFIED', 'Verified'
        FLAGGED = 'FLAGGED', 'Flagged'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    collection_center = models.ForeignKey(CollectionCenter, on_delete=models.CASCADE, related_name='receipts')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name='receipts')
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collection_receipts')
    harvest = models.ForeignKey(Harvest, on_delete=models.SET_NULL, null=True, blank=True)
    expected_quantity = models.DecimalField(max_digits=8, decimal_places=2)
    actual_quantity = models.DecimalField(max_digits=8, decimal_places=2)
    received_at = models.DateTimeField(auto_now_add=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_receipts')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.VERIFIED)

    def __str__(self):
        return f"Receipt #{self.id} - {self.farmer.name} ({self.actual_quantity}kg verified)"

class QualityCheck(models.Model):
    class Grade(models.TextChoices):
        GRADE_A = 'Grade A', 'Grade A'
        GRADE_B = 'Grade B', 'Grade B'
        GRADE_C = 'Grade C', 'Grade C'
        REJECTED = 'REJECTED', 'Rejected'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    collection_receipt = models.OneToOneField(CollectionReceipt, on_delete=models.CASCADE, related_name='quality_check')
    inspector = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='inspected_checks')
    quality_grade = models.CharField(max_length=20, choices=Grade.choices, default=Grade.GRADE_A)
    quality_score = models.DecimalField(max_digits=5, decimal_places=2, default=95.0, help_text='Out of 100')
    notes = models.TextField(blank=True, default='')
    image_url = models.URLField(max_length=500, blank=True, default='')
    checked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"QC #{self.id} - Grade: {self.quality_grade} ({self.quality_score}%)"

class ProduceBatch(models.Model):
    class Status(models.TextChoices):
        SORTED = 'SORTED', 'Sorted'
        PACKED = 'PACKED', 'Packed'
        DISPATCHED = 'DISPATCHED', 'Dispatched'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    batch_number = models.CharField(max_length=100, unique=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='batches')
    collection_center = models.ForeignKey(CollectionCenter, on_delete=models.CASCADE, related_name='batches')
    total_quantity = models.DecimalField(max_digits=10, decimal_places=2)
    quality_grade = models.CharField(max_length=20, default='Grade A')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PACKED)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Batch {self.batch_number} - {self.product.name} ({self.total_quantity}kg)"
