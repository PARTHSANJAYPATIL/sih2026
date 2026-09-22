from rest_framework import serializers
from django.db import transaction
from products.models import ProduceListing
from .models import Order, OrderItem, FarmerOrderAllocation, Harvest

class OrderItemSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.name', read_only=True)
    image_url = serializers.CharField(source='produce_listing.image_url', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'crop_name', 'farmer', 'farmer_name', 'quantity', 'price_per_unit', 'subtotal', 'image_url']

class FarmerOrderAllocationSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.name', read_only=True)
    location = serializers.CharField(source='farmer.farmer_profile.district', default='Sangli', read_only=True)

    class Meta:
        model = FarmerOrderAllocation
        fields = ['id', 'farmer', 'farmer_name', 'location', 'requested_quantity', 'confirmed_quantity', 'agreed_price', 'status']

class OrderSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.name', read_only=True)
    buyer_phone = serializers.CharField(source='buyer.phone', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    allocations = FarmerOrderAllocationSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'buyer', 'buyer_name', 'buyer_phone',
            'order_type', 'status', 'subtotal', 'collection_fee',
            'transport_fee', 'platform_fee', 'total_amount',
            'delivery_address', 'delivery_city', 'delivery_slot',
            'delivery_latitude', 'delivery_longitude',
            'items', 'allocations', 'created_at', 'updated_at'
        ]

class OrderCreateItemInputSerializer(serializers.Serializer):
    listing_id = serializers.UUIDField()
    quantity = serializers.DecimalField(max_digits=8, decimal_places=2)

class OrderCreateSerializer(serializers.Serializer):
    items = OrderCreateItemInputSerializer(many=True)
    delivery_address = serializers.CharField()
    delivery_city = serializers.CharField(default='Pune')
    delivery_slot = serializers.CharField(default='05:00 PM – 07:00 PM')
    order_type = serializers.ChoiceField(choices=Order.OrderType.choices, default=Order.OrderType.CONSUMER)

    def create(self, validated_data):
        items_data = validated_data['items']
        buyer = self.context['request'].user

        with transaction.atomic():
            # Check stock for all items first (Requirement 37)
            listings = {}
            for item in items_data:
                try:
                    listing = ProduceListing.objects.select_for_update().get(id=item['listing_id'])
                except ProduceListing.DoesNotExist:
                    raise serializers.ValidationError(f"Produce listing {item['listing_id']} not found.")

                req_qty = item['quantity']
                if listing.quantity_available < req_qty:
                    raise serializers.ValidationError(
                        f"Only {listing.quantity_available} {listing.quantity_unit} of {listing.product.name} is currently available."
                    )
                listings[str(listing.id)] = listing

            # Calculate transparent breakdown
            farmer_subtotal = 0
            total_kg = 0
            for item in items_data:
                listing = listings[str(item['listing_id'])]
                qty = item['quantity']
                farmer_subtotal += float(listing.price_per_unit) * float(qty)
                total_kg += float(qty)

            collection_fee = total_kg * 1.0
            transport_fee = total_kg * 2.0
            platform_fee = total_kg * 1.0
            total_amount = farmer_subtotal + collection_fee + transport_fee + platform_fee

            # Create Order
            import random
            order_num = f"FM{random.randint(1000, 9999)}"
            order = Order.objects.create(
                order_number=order_num,
                buyer=buyer,
                order_type=validated_data.get('order_type', Order.OrderType.CONSUMER),
                status=Order.Status.CREATED,
                subtotal=farmer_subtotal,
                collection_fee=collection_fee,
                transport_fee=transport_fee,
                platform_fee=platform_fee,
                total_amount=total_amount,
                delivery_address=validated_data['delivery_address'],
                delivery_city=validated_data.get('delivery_city', 'Pune'),
                delivery_slot=validated_data.get('delivery_slot', '05:00 PM – 07:00 PM')
            )

            # Create items & decrement inventory
            for item in items_data:
                listing = listings[str(item['listing_id'])]
                qty = item['quantity']
                item_subtotal = float(listing.price_per_unit) * float(qty)

                OrderItem.objects.create(
                    order=order,
                    produce_listing=listing,
                    crop_name=listing.product.name,
                    farmer=listing.farmer,
                    quantity=qty,
                    price_per_unit=listing.price_per_unit,
                    subtotal=item_subtotal
                )

                # Deduct stock
                listing.quantity_available -= qty
                if listing.quantity_available == 0:
                    listing.status = ProduceListing.Status.SOLD_OUT
                else:
                    listing.status = ProduceListing.Status.PARTIALLY_SOLD
                listing.save()

            return order

class HarvestSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.name', read_only=True)
    crop_name = serializers.CharField(source='produce_listing.product.name', default='Tomato', read_only=True)

    class Meta:
        model = Harvest
        fields = ['id', 'farmer', 'farmer_name', 'crop_name', 'planned_date', 'actual_harvest_date', 'quantity', 'status', 'created_at']
