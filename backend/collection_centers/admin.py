from django.contrib import admin
from .models import CollectionCenter, CollectionReceipt, QualityCheck, ProduceBatch

@admin.register(CollectionCenter)
class CollectionCenterAdmin(admin.ModelAdmin):
    list_display = ('name', 'district', 'manager', 'capacity', 'current_capacity', 'status', 'contact_phone')
    list_filter = ('district', 'status')
    search_fields = ('name', 'district', 'manager__name')

@admin.register(CollectionReceipt)
class CollectionReceiptAdmin(admin.ModelAdmin):
    list_display = ('id', 'collection_center', 'farmer', 'expected_quantity', 'actual_quantity', 'status', 'received_at')
    list_filter = ('status', 'collection_center')
    search_fields = ('farmer__name',)

@admin.register(QualityCheck)
class QualityCheckAdmin(admin.ModelAdmin):
    list_display = ('id', 'collection_receipt', 'inspector', 'quality_grade', 'quality_score', 'checked_at')
    list_filter = ('quality_grade',)
    search_fields = ('notes', 'inspector__name')

@admin.register(ProduceBatch)
class ProduceBatchAdmin(admin.ModelAdmin):
    list_display = ('batch_number', 'product', 'collection_center', 'total_quantity', 'quality_grade', 'status')
    list_filter = ('quality_grade', 'status')
    search_fields = ('batch_number', 'product__name')
