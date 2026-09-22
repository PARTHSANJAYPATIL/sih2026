from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    read = serializers.BooleanField(source='is_read')
    type = serializers.CharField(source='notification_type')
    userId = serializers.CharField(source='user_id', read_only=True)
    targetRole = serializers.CharField(source='target_role', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'userId', 'target_role', 'targetRole', 'title', 'message', 'notification_type', 'type', 'is_read', 'read', 'created_at']
