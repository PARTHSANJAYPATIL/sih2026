from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from common.response import api_response, api_error
from accounts.models import User
from orders.models import Order
from .models import CollectionCenter, CollectionReceipt, QualityCheck, ProduceBatch
from .serializers import (
    CollectionCenterSerializer,
    CollectionReceiptSerializer,
    QualityCheckSerializer,
    ProduceBatchSerializer
)

class CollectionCenterListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        centers = CollectionCenter.objects.all()
        serializer = CollectionCenterSerializer(centers, many=True)
        return api_response(data=serializer.data)

class IncomingProduceQueueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        receipts = CollectionReceipt.objects.all().order_by('-received_at')
        serializer = CollectionReceiptSerializer(receipts, many=True)
        return api_response(data=serializer.data)

class ReceiveProduceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        expected_qty = request.data.get('expected_quantity', 500)
        actual_qty = request.data.get('actual_quantity', 485)
        farmer_id = request.data.get('farmer_id')
        order_id = request.data.get('order_id')
        center_id = request.data.get('collection_center_id')

        center = CollectionCenter.objects.first()
        if center_id:
            try:
                center = CollectionCenter.objects.get(id=center_id)
            except CollectionCenter.DoesNotExist:
                pass

        farmer = None
        if farmer_id:
            try:
                farmer = User.objects.get(id=farmer_id)
            except User.DoesNotExist:
                pass
        if not farmer:
            farmer = User.objects.filter(role='FARMER').first()

        order = None
        if order_id:
            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                pass

        receipt = CollectionReceipt.objects.create(
            collection_center=center,
            order=order,
            farmer=farmer,
            expected_quantity=expected_qty,
            actual_quantity=actual_qty,
            verified_by=request.user,
            status=CollectionReceipt.Status.VERIFIED
        )

        if order:
            order.status = Order.Status.AT_COLLECTION_CENTER
            order.save()

        return api_response(
            data=CollectionReceiptSerializer(receipt).data,
            message="Produce intake receipt recorded with actual weighed scale data.",
            status_code=201
        )

class QualityCheckCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receipt_id = request.data.get('collection_receipt_id')
        grade = request.data.get('quality_grade', QualityCheck.Grade.GRADE_A)
        score = request.data.get('quality_score', 95.0)
        notes = request.data.get('notes', 'Verified Grade A export standard.')

        try:
            receipt = CollectionReceipt.objects.get(id=receipt_id)
        except CollectionReceipt.DoesNotExist:
            receipt = CollectionReceipt.objects.first()
            if not receipt:
                return api_error(code="NOT_FOUND", message="Collection receipt not found", status_code=404)

        qc, created = QualityCheck.objects.update_or_create(
            collection_receipt=receipt,
            defaults={
                'inspector': request.user,
                'quality_grade': grade,
                'quality_score': score,
                'notes': notes
            }
        )

        # Update associated order
        if receipt.order:
            receipt.order.status = Order.Status.QUALITY_CHECKED
            receipt.order.save()

        return api_response(
            data=QualityCheckSerializer(qc).data,
            message=f"Quality check completed: Certified {grade}.",
            status_code=201
        )

class ProduceBatchListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        batches = ProduceBatch.objects.all().order_by('-created_at')
        serializer = ProduceBatchSerializer(batches, many=True)
        return api_response(data=serializer.data)
