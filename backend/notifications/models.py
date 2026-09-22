import uuid
from django.db import models
from accounts.models import User

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        ORDER = 'order', 'Order'
        LOGISTICS = 'logistics', 'Logistics'
        QC = 'qc', 'Quality Check'
        SYSTEM = 'system', 'System'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    target_role = models.CharField(max_length=30, blank=True, default='')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=30, choices=NotificationType.choices, default=NotificationType.SYSTEM)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({'Read' if self.is_read else 'Unread'})"
