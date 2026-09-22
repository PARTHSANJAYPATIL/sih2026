from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, FPO, FarmerProfile, BuyerProfile, DriverProfile

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'phone', 'is_verified', 'is_staff', 'is_active')
    list_filter = ('role', 'is_verified', 'is_staff', 'is_active')
    search_fields = ('email', 'name', 'phone')
    ordering = ('email',)

@admin.register(FPO)
class FPOAdmin(admin.ModelAdmin):
    list_display = ('name', 'registration_number', 'district', 'contact_person', 'phone')
    search_fields = ('name', 'registration_number', 'district')

@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'fpo', 'district', 'farm_size', 'verification_status')
    list_filter = ('district', 'verification_status')
    search_fields = ('user__name', 'user__email', 'district')

@admin.register(BuyerProfile)
class BuyerProfileAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'user', 'business_type', 'gst_number')
    list_filter = ('business_type', 'verification_status')
    search_fields = ('business_name', 'user__name')

@admin.register(DriverProfile)
class DriverProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'license_number', 'availability', 'rating')
    list_filter = ('availability',)
    search_fields = ('user__name', 'license_number')
