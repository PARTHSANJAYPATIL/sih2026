from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Notification
from .serializers import NotificationSerializer
from common.response import api_response

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = user.role.lower()
        return Notification.objects.filter(
            Q(user=user) | Q(target_role__iexact=role) | Q(target_role='')
        ).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        notifications = self.get_queryset()
        serializer = self.get_serializer(notifications, many=True)
        return api_response(data=serializer.data)

    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return api_response(data=serializer.data, message="Notification marked as read")

    @action(detail=False, methods=['post'], url_path='read-all')
    def read_all(self, request):
        self.get_queryset().update(is_read=True)
        return api_response(message="All notifications marked as read")
