from django.contrib import admin
from .models import Order, OrderItem, FarmerOrderAllocation, Harvest

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class FarmerOrderAllocationInline(admin.TabularInline):
    model = FarmerOrderAllocation
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'buyer', 'order_type', 'status', 'total_amount', 'delivery_city', 'created_at')
    list_filter = ('order_type', 'status', 'delivery_city')
    search_fields = ('order_number', 'buyer__name', 'buyer__email')
    inlines = [OrderItemInline, FarmerOrderAllocationInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'crop_name', 'farmer', 'quantity', 'price_per_unit', 'subtotal')
    search_fields = ('order__order_number', 'crop_name', 'farmer__name')

@admin.register(FarmerOrderAllocation)
class FarmerOrderAllocationAdmin(admin.ModelAdmin):
    list_display = ('order', 'farmer', 'requested_quantity', 'confirmed_quantity', 'agreed_price', 'status')
    list_filter = ('status',)
    search_fields = ('order__order_number', 'farmer__name')

@admin.register(Harvest)
class HarvestAdmin(admin.ModelAdmin):
    list_display = ('farmer', 'produce_listing', 'planned_date', 'quantity', 'status')
    list_filter = ('status',)
    search_fields = ('farmer__name',)
