from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    reporterName = serializers.CharField(source='reporter.name', read_only=True)
    reporterRole = serializers.CharField(source='reporter.role', read_only=True)
    reporterPhone = serializers.CharField(source='reporter.phone', read_only=True)
    orderId = serializers.CharField(source='order.order_number', read_only=True, default='')
    resolutionNotes = serializers.CharField(source='resolution_notes', required=False, allow_blank=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True, format='%Y-%m-%d')

    class Meta:
        model = Complaint
        fields = [
            'id', 'order', 'orderId', 'reporter', 'reporterName', 'reporterRole',
            'reporterPhone', 'category', 'description', 'status',
            'resolution_notes', 'resolutionNotes', 'resolved_by', 'resolved_at',
            'created_at', 'createdAt'
        ]
        read_only_fields = ['id', 'reporter', 'status', 'resolved_by', 'resolved_at', 'created_at']
