import uuid
from django.db import models
from django.utils import timezone
from accounts.models import User
from orders.models import Order

class Complaint(models.Model):
    class Category(models.TextChoices):
        DAMAGED = 'Damaged produce', 'Damaged produce'
        LATE_DELIVERY = 'Late delivery', 'Late delivery'
        WRONG_QUANTITY = 'Wrong quantity', 'Wrong quantity'
        QUALITY_MISMATCH = 'Quality mismatch', 'Quality mismatch'
        PAYMENT_ISSUE = 'Payment issue', 'Payment issue'
        OTHER = 'Other', 'Other'

    class Status(models.TextChoices):
        SUBMITTED = 'Submitted', 'Submitted'
        UNDER_INVESTIGATION = 'Under Investigation', 'Under Investigation'
        RESOLVED = 'Resolved', 'Resolved'
        REJECTED = 'Rejected', 'Rejected'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name='complaints')
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='filed_complaints')
    category = models.CharField(max_length=50, choices=Category.choices, default=Category.DAMAGED)
    description = models.TextField()
    status = models.CharField(max_length=50, choices=Status.choices, default=Status.SUBMITTED)
    resolution_notes = models.TextField(blank=True, default='')
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='resolved_complaints')
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def resolve(self, resolver_user, notes="Issue resolved"):
        self.status = self.Status.RESOLVED
        self.resolution_notes = notes
        self.resolved_by = resolver_user
        self.resolved_at = timezone.now()
        self.save()

    def __str__(self):
        return f"Complaint #{str(self.id)[:8]} ({self.category}) - {self.status}"
