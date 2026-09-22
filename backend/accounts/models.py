import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)
        extra_fields.setdefault('is_verified', True)
        return self.create_user(email, name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        FARMER = 'FARMER', 'Farmer'
        CONSUMER = 'CONSUMER', 'Consumer'
        BULK_BUYER = 'BULK_BUYER', 'Bulk Buyer'
        ADMIN = 'ADMIN', 'Admin'
        COLLECTION_MANAGER = 'COLLECTION_MANAGER', 'Collection Manager'
        DRIVER = 'DRIVER', 'Driver'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(max_length=20, blank=True, default='')
    role = models.CharField(max_length=30, choices=Role.choices, default=Role.CONSUMER)
    is_verified = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return f"{self.name} ({self.role}) <{self.email}>"

class FPO(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    registration_number = models.CharField(max_length=100, unique=True)
    contact_person = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, default='')
    address = models.TextField(blank=True, default='')
    district = models.CharField(max_length=100, default='Sangli')
    state = models.CharField(max_length=100, default='Maharashtra')
    verification_status = models.CharField(max_length=30, default='VERIFIED')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class FarmerProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    fpo = models.ForeignKey(FPO, on_delete=models.SET_NULL, null=True, blank=True, related_name='farmers')
    farm_name = models.CharField(max_length=255, blank=True, default='')
    address = models.TextField(blank=True, default='')
    village = models.CharField(max_length=100, blank=True, default='')
    taluka = models.CharField(max_length=100, blank=True, default='')
    district = models.CharField(max_length=100, default='Sangli')
    state = models.CharField(max_length=100, default='Maharashtra')
    pincode = models.CharField(max_length=10, blank=True, default='')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    farm_size = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, help_text='In Acres')
    verification_status = models.CharField(max_length=30, default='VERIFIED')

    def __str__(self):
        return f"Farmer: {self.user.name} - {self.district}"

class BuyerProfile(models.Model):
    class BusinessType(models.TextChoices):
        RESTAURANT = 'RESTAURANT', 'Restaurant'
        HOTEL = 'HOTEL', 'Hotel'
        RETAILER = 'RETAILER', 'Retailer'
        SUPERMARKET = 'SUPERMARKET', 'Supermarket'
        PROCESSOR = 'PROCESSOR', 'Food Processor'
        WHOLESALER = 'WHOLESALER', 'Wholesaler'
        OTHER = 'OTHER', 'Other'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='buyer_profile')
    business_name = models.CharField(max_length=255)
    business_type = models.CharField(max_length=30, choices=BusinessType.choices, default=BusinessType.RESTAURANT)
    address = models.TextField(blank=True, default='')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    gst_number = models.CharField(max_length=50, blank=True, default='')
    verification_status = models.CharField(max_length=30, default='VERIFIED')

    def __str__(self):
        return f"{self.business_name} ({self.business_type})"

class DriverProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='driver_profile')
    license_number = models.CharField(max_length=50, blank=True, default='')
    availability = models.BooleanField(default=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.8)
    verification_status = models.CharField(max_length=30, default='VERIFIED')

    def __str__(self):
        return f"Driver: {self.user.name}"
