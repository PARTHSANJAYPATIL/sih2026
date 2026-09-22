from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Complaint
from .serializers import ComplaintSerializer
from common.response import api_response, api_error

class ComplaintViewSet(viewsets.ModelViewSet):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['ADMIN', 'COLLECTION_MANAGER']:
            return Complaint.objects.all().order_by('-created_at')
        return Complaint.objects.filter(reporter=user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        complaints = self.get_queryset()
        serializer = self.get_serializer(complaints, many=True)
        return api_response(data=serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        complaint = serializer.save(reporter=request.user)
        return api_response(data=self.get_serializer(complaint).data, message="Complaint registered successfully", status_code=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        complaint = self.get_object()
        notes = request.data.get('notes', 'Complaint verified and resolved.')
        new_status = request.data.get('status', Complaint.Status.RESOLVED)

        complaint.status = new_status
        complaint.resolution_notes = notes
        complaint.resolved_by = request.user
        complaint.save()

        serializer = self.get_serializer(complaint)
        return api_response(data=serializer.data, message="Complaint status updated")
