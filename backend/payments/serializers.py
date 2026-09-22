from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    buyer_name = serializers.CharField(source='order.buyer.name', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'order_number', 'buyer_name', 'amount',
            'farmer_payout', 'collection_fee', 'logistics_fee', 'platform_fee',
            'payment_method', 'status', 'transaction_id', 'paid_at', 'created_at'
        ]
        read_only_fields = ['id', 'farmer_payout', 'collection_fee', 'logistics_fee', 'platform_fee', 'paid_at', 'created_at']

class PriceBreakdownSerializer(serializers.Serializer):
    order_id = serializers.UUIDField()
    order_number = serializers.CharField()
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2)
    farmer_payout = serializers.DecimalField(max_digits=12, decimal_places=2)
    collection_fee = serializers.DecimalField(max_digits=12, decimal_places=2)
    logistics_fee = serializers.DecimalField(max_digits=12, decimal_places=2)
    platform_fee = serializers.DecimalField(max_digits=12, decimal_places=2)
    total = serializers.DecimalField(max_digits=12, decimal_places=2)
