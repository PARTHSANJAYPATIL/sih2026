import uuid
from decimal import Decimal
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order
from common.response import api_response, api_error

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Payment.objects.all().order_by('-created_at')
        if user.role in ['CONSUMER', 'BULK_BUYER']:
            return Payment.objects.filter(order__buyer=user).order_by('-created_at')
        if user.role == 'FARMER':
            return Payment.objects.filter(order__items__listing__farmer=user).distinct().order_by('-created_at')
        return Payment.objects.all().order_by('-created_at')

    def list(self, request, *args, **kwargs):
        payments = self.get_queryset()
        serializer = self.get_serializer(payments, many=True)
        return api_response(data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(data=serializer.data)

    @action(detail=False, methods=['post'], url_path='process-simulated')
    def process_simulated(self, request):
        order_id = request.data.get('order_id')
        payment_method = request.data.get('payment_method', 'UPI')

        if not order_id:
            return api_error(message="order_id is required", status_code=status.HTTP_400_BAD_REQUEST)

        order = get_object_or_404(Order, id=order_id)

        # Create or update payment
        payment, created = Payment.objects.get_or_create(
            order=order,
            defaults={
                'amount': order.total_amount,
                'farmer_payout': order.farmer_subtotal,
                'collection_fee': order.collection_fee,
                'logistics_fee': order.logistics_fee,
                'platform_fee': order.platform_fee,
                'payment_method': payment_method,
            }
        )

        txn_id = f"PAY-{uuid.uuid4().hex[:10].upper()}"
        payment.payment_method = payment_method
        payment.mark_as_paid(transaction_id=txn_id)

        serializer = self.get_serializer(payment)
        return api_response(
            data=serializer.data,
            message=f"Simulated payment of ₹{payment.amount} successful via {payment_method}. Transaction ID: {txn_id}"
        )

class PriceBreakdownView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        breakdown = {
            'order_id': str(order.id),
            'order_number': order.order_number,
            'subtotal': float(order.farmer_subtotal),
            'farmer_payout': float(order.farmer_subtotal),
            'collection_fee': float(order.collection_fee),
            'logistics_fee': float(order.logistics_fee),
            'platform_fee': float(order.platform_fee),
            'total_amount': float(order.total_amount),
            'savings_vs_traditional_mandi': round(float(order.total_amount) * 0.18, 2),
            'explanation': 'Farm2Market AI disintermediates secondary traders, passing 82% of realization directly to growers.'
        }
        return api_response(data=breakdown)
