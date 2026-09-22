from django.contrib import admin
from .models import Product, ProduceListing

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'unit', 'created_at')
    list_filter = ('category',)
    search_fields = ('name',)

@admin.register(ProduceListing)
class ProduceListingAdmin(admin.ModelAdmin):
    list_display = ('product', 'farmer', 'variety', 'quantity_available', 'price_per_unit', 'quality_grade', 'harvest_status', 'status')
    list_filter = ('harvest_status', 'quality_grade', 'status', 'organic', 'location')
    search_fields = ('product__name', 'farmer__name', 'variety', 'location')
