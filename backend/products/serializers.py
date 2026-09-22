from rest_framework import serializers
from .models import Product, ProduceListing

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'description', 'unit', 'image_url', 'created_at']

class ProduceListingSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='product.name', read_only=True)
    category = serializers.CharField(source='product.category', read_only=True)
    farmer_name = serializers.CharField(source='farmer.name', read_only=True)
    farmer_phone = serializers.CharField(source='farmer.phone', read_only=True)
    fpo_name = serializers.SerializerMethodField()
    estimated_customer_price = serializers.SerializerMethodField()

    product_id = serializers.UUIDField(write_only=True, required=False)
    crop_name_input = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = ProduceListing
        fields = [
            'id', 'farmer', 'farmer_name', 'farmer_phone', 'fpo_name',
            'product', 'product_id', 'crop_name_input', 'crop_name', 'category',
            'variety', 'quantity_available', 'initial_quantity', 'quantity_unit',
            'price_per_unit', 'estimated_customer_price', 'market_ref_price',
            'ai_suggested_min', 'ai_suggested_max', 'quality_grade', 'harvest_date',
            'harvest_status', 'location', 'description', 'organic', 'image_url',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['farmer', 'product', 'initial_quantity']

    def get_fpo_name(self, obj):
        if hasattr(obj.farmer, 'farmer_profile') and obj.farmer.farmer_profile.fpo:
            return obj.farmer.farmer_profile.fpo.name
        return 'Sahyadri Farmers Producer Co.'

    def get_estimated_customer_price(self, obj):
        # Farmer price + 1 collection + 2 transport + 1 platform
        return float(obj.price_per_unit) + 4.0

    def create(self, validated_data):
        product_id = validated_data.pop('product_id', None)
        crop_name_input = validated_data.pop('crop_name_input', None)

        product = None
        if product_id:
            product = Product.objects.get(id=product_id)
        elif crop_name_input:
            product, _ = Product.objects.get_or_create(
                name=crop_name_input,
                defaults={'category': Product.Category.VEGETABLES}
            )
        else:
            product = Product.objects.first()

        qty = validated_data.get('quantity_available', 100)
        validated_data['initial_quantity'] = qty
        validated_data['product'] = product
        validated_data['farmer'] = self.context['request'].user

        return super().create(validated_data)
