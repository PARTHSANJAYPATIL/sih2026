import uuid
from django.db import models
from django.utils import timezone
from orders.models import Order

class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAID = 'PAID', 'Paid'
        FAILED = 'FAILED', 'Failed'
        REFUNDED = 'REFUNDED', 'Refunded'

    class PaymentMethod(models.TextChoices):
        UPI = 'UPI', 'UPI'
        CARD = 'Card', 'Credit/Debit Card'
        NET_BANKING = 'Net Banking', 'Net Banking'
        WALLET = 'Wallet', 'Digital Wallet'
        COD = 'COD', 'Cash on Delivery'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment_record')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    farmer_payout = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    collection_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    logistics_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    platform_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=50, choices=PaymentMethod.choices, default=PaymentMethod.UPI)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING)
    transaction_id = models.CharField(max_length=100, blank=True, default='')
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def mark_as_paid(self, transaction_id=None):
        self.status = self.Status.PAID
        self.transaction_id = transaction_id or f"TXN-{uuid.uuid4().hex[:12].upper()}"
        self.paid_at = timezone.now()
        self.save()

        # Update order status
        self.order.payment_status = Order.PaymentStatus.PAID
        if self.order.status == Order.Status.PENDING:
            self.order.status = Order.Status.CONFIRMED
        self.order.save()

    def __str__(self):
        return f"Payment #{self.transaction_id or self.id} for Order #{self.order.order_number} ({self.status})"
