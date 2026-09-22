from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.db.models import Q
from common.response import api_response, api_error
from .models import Order, OrderItem, FarmerOrderAllocation, Harvest
from .serializers import OrderSerializer, OrderCreateSerializer, HarvestSerializer

# State Machine Sequence (Requirement 35)
VALID_ORDER_FLOW = [
    Order.Status.CREATED,
    Order.Status.CONFIRMED,
    Order.Status.FARMER_MATCHED,
    Order.Status.HARVEST_SCHEDULED,
    Order.Status.PICKUP_ASSIGNED,
    Order.Status.PRODUCE_COLLECTED,
    Order.Status.AT_COLLECTION_CENTER,
    Order.Status.QUALITY_CHECKED,
    Order.Status.PACKED,
    Order.Status.DISPATCHED,
    Order.Status.OUT_FOR_DELIVERY,
    Order.Status.DELIVERED
]

class OrderListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'ADMIN' or user.is_staff:
            orders = Order.objects.all().order_by('-created_at')
        elif user.role in ['CONSUMER', 'BULK_BUYER']:
            orders = Order.objects.filter(buyer=user).order_by('-created_at')
        elif user.role == 'FARMER':
            # Orders where this farmer's produce is included
            orders = Order.objects.filter(items__farmer=user).distinct().order_by('-created_at')
        elif user.role in ['DRIVER', 'COLLECTION_MANAGER']:
            orders = Order.objects.all().order_by('-created_at')
        else:
            orders = Order.objects.none()

        serializer = OrderSerializer(orders, many=True)
        return api_response(data=serializer.data)

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                order = serializer.save()
                return api_response(data=OrderSerializer(order).data, message="Order created successfully", status_code=201)
            except Exception as e:
                return api_error(code="INSUFFICIENT_STOCK", message=str(e), status_code=400)
        return api_error(code="VALIDATION_ERROR", message="Invalid order request", details=serializer.errors)

class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            return api_response(data=OrderSerializer(order).data)
        except Order.DoesNotExist:
            return api_error(code="NOT_FOUND", message="Order not found", status_code=404)

class OrderStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return api_error(code="NOT_FOUND", message="Order not found", status_code=404)

        new_status = request.data.get('status')
        if not new_status or new_status not in Order.Status.values:
            return api_error(code="INVALID_STATUS", message=f"Status '{new_status}' is invalid")

        # Allow cancellation if not dispatched
        if new_status == Order.Status.CANCELLED:
            if order.status in [Order.Status.DISPATCHED, Order.Status.OUT_FOR_DELIVERY, Order.Status.DELIVERED]:
                return api_error(code="STATE_MACHINE_ERROR", message="Cannot cancel order once dispatched")
            order.status = Order.Status.CANCELLED
            order.save()
            return api_response(data=OrderSerializer(order).data, message="Order cancelled")

        # State machine transition validation (Requirement 35)
        curr_idx = VALID_ORDER_FLOW.index(order.status) if order.status in VALID_ORDER_FLOW else 0
        new_idx = VALID_ORDER_FLOW.index(new_status) if new_status in VALID_ORDER_FLOW else 0

        # Allow transitioning forward
        if new_idx < curr_idx and request.user.role != 'ADMIN':
            return api_error(code="INVALID_TRANSITION", message=f"Cannot revert status from {order.status} to {new_status}")

        order.status = new_status
        order.save()
        return api_response(data=OrderSerializer(order).data, message=f"Order status updated to {new_status}")

class HarvestListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'FARMER':
            harvests = Harvest.objects.filter(farmer=request.user).order_by('-created_at')
        else:
            harvests = Harvest.objects.all().order_by('-created_at')
        serializer = HarvestSerializer(harvests, many=True)
        return api_response(data=serializer.data)

    def post(self, request):
        serializer = HarvestSerializer(data=request.data)
        if serializer.is_valid():
            harvest = serializer.save(farmer=request.user)
            return api_response(data=HarvestSerializer(harvest).data, message="Harvest scheduled", status_code=201)
        return api_error(code="VALIDATION_ERROR", message="Invalid harvest data", details=serializer.errors)

class HarvestUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            harvest = Harvest.objects.get(pk=pk)
        except Harvest.DoesNotExist:
            return api_error(code="NOT_FOUND", message="Harvest record not found", status_code=404)

        new_status = request.data.get('status')
        if new_status:
            harvest.status = new_status
            harvest.save()

            # If marked READY, auto-trigger pickup request
            if new_status == Harvest.Status.READY:
                from logistics.models import Pickup
                import random
                Pickup.objects.get_or_create(
                    harvest=harvest,
                    defaults={
                        'pickup_number': f"PKP-{random.randint(1000, 9999)}",
                        'farmer': harvest.farmer,
                        'status': Pickup.Status.REQUESTED,
                        'scheduled_time': 'Tomorrow 08:30 AM – 09:30 AM',
                        'pickup_address': 'Plot 14, Miraj Farm Belt, Sangli'
                    }
                )

        return api_response(data=HarvestSerializer(harvest).data, message="Harvest status updated")
