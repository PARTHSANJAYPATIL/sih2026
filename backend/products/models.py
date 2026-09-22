import uuid
from django.db import models
from accounts.models import User

class Product(models.Model):
    class Category(models.TextChoices):
        VEGETABLES = 'Vegetables', 'Vegetables'
        FRUITS = 'Fruits', 'Fruits'
        GRAINS_PULSES = 'Grains & Pulses', 'Grains & Pulses'
        COMMERCIAL = 'Commercial Crops', 'Commercial Crops'
        SPICES = 'Spices', 'Spices'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150, unique=True)
    category = models.CharField(max_length=50, choices=Category.choices, default=Category.VEGETABLES)
    description = models.TextField(blank=True, default='')
    unit = models.CharField(max_length=20, default='kg')
    image_url = models.URLField(max_length=500, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category})"

class ProduceListing(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        ACTIVE = 'ACTIVE', 'Active'
        PARTIALLY_SOLD = 'PARTIALLY_SOLD', 'Partially Sold'
        SOLD_OUT = 'SOLD_OUT', 'Sold Out'
        EXPIRED = 'EXPIRED', 'Expired'

    class QualityGrade(models.TextChoices):
        GRADE_A = 'Grade A', 'Grade A'
        GRADE_B = 'Grade B', 'Grade B'
        GRADE_C = 'Grade C', 'Grade C'

    class HarvestStatus(models.TextChoices):
        GROWING = 'Growing', 'Growing'
        READY_FOR_HARVEST = 'Ready for Harvest', 'Ready for Harvest'
        HARVESTED = 'Harvested', 'Harvested'
        PICKUP_SCHEDULED = 'Pickup Scheduled', 'Pickup Scheduled'
        COLLECTED = 'Collected', 'Collected'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='produce_listings')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='listings')
    variety = models.CharField(max_length=150, blank=True, default='')
    quantity_available = models.DecimalField(max_digits=10, decimal_places=2)
    initial_quantity = models.DecimalField(max_digits=10, decimal_places=2)
    quantity_unit = models.CharField(max_length=20, default='kg')
    price_per_unit = models.DecimalField(max_digits=8, decimal_places=2, help_text='₹ per unit set by farmer')
    market_ref_price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    ai_suggested_min = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    ai_suggested_max = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    quality_grade = models.CharField(max_length=20, choices=QualityGrade.choices, default=QualityGrade.GRADE_A)
    harvest_date = models.CharField(max_length=50, help_text='e.g. 25 Sept or YYYY-MM-DD')
    harvest_status = models.CharField(max_length=30, choices=HarvestStatus.choices, default=HarvestStatus.GROWING)
    location = models.CharField(max_length=100, default='Sangli')
    description = models.TextField(blank=True, default='')
    organic = models.BooleanField(default=False)
    image_url = models.URLField(max_length=500, blank=True, default='')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} ({self.quantity_available}{self.quantity_unit}) - {self.farmer.name}"
