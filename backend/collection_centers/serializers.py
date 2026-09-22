from rest_framework import serializers
from .models import CollectionCenter, CollectionReceipt, QualityCheck, ProduceBatch

class CollectionCenterSerializer(serializers.ModelSerializer):
    manager_name = serializers.CharField(source='manager.name', default='Anand Deshmukh', read_only=True)

    class Meta:
        model = CollectionCenter
        fields = [
            'id', 'name', 'manager', 'manager_name', 'address', 
            'district', 'state', 'pincode', 'latitude', 'longitude', 
            'capacity', 'current_capacity', 'status', 'contact_phone'
        ]

class QualityCheckSerializer(serializers.ModelSerializer):
    inspector_name = serializers.CharField(source='inspector.name', default='Anand Deshmukh', read_only=True)

    class Meta:
        model = QualityCheck
        fields = ['id', 'collection_receipt', 'inspector', 'inspector_name', 'quality_grade', 'quality_score', 'notes', 'image_url', 'checked_at']

class CollectionReceiptSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.name', read_only=True)
    center_name = serializers.CharField(source='collection_center.name', read_only=True)
    quality_check = QualityCheckSerializer(read_only=True)

    class Meta:
        model = CollectionReceipt
        fields = [
            'id', 'collection_center', 'center_name', 'order', 'farmer',
            'farmer_name', 'harvest', 'expected_quantity', 'actual_quantity',
            'received_at', 'verified_by', 'status', 'quality_check'
        ]

class ProduceBatchSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = ProduceBatch
        fields = ['id', 'batch_number', 'product', 'product_name', 'collection_center', 'total_quantity', 'quality_grade', 'status', 'created_at']
