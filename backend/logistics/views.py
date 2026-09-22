from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Vehicle, Pickup, Delivery, Route
from .serializers import VehicleSerializer, PickupSerializer, DeliverySerializer, RouteSerializer
from common.response import api_response, api_error
from orders.models import Order, Harvest

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        vehicles = self.get_queryset()
        serializer = self.get_serializer(vehicles, many=True)
        return api_response(data=serializer.data)

class PickupViewSet(viewsets.ModelViewSet):
    serializer_class = PickupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Pickup.objects.all().order_by('-created_at')
        if user.role == 'DRIVER':
            return Pickup.objects.filter(Q(driver=user) | Q(driver__isnull=True)).order_by('-created_at')
        if user.role == 'FARMER':
            return Pickup.objects.filter(farmer=user).order_by('-created_at')
        return Pickup.objects.all().order_by('-created_at')

    def list(self, request, *args, **kwargs):
        pickups = self.get_queryset()
        serializer = self.get_serializer(pickups, many=True)
        return api_response(data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(data=serializer.data)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        pickup = self.get_object()
        user = request.user
        pickup.driver = user
        pickup.status = Pickup.Status.ACCEPTED
        pickup.save()
        serializer = self.get_serializer(pickup)
        return api_response(data=serializer.data, message="Pickup accepted by driver.")

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        pickup = self.get_object()
        new_status = request.data.get('status')
        proof_image_url = request.data.get('proof_image_url', '')

        if not new_status or new_status not in Pickup.Status.values:
            return api_error(message=f"Invalid status. Choose from {Pickup.Status.values}", status_code=status.HTTP_400_BAD_REQUEST)

        pickup.status = new_status
        if proof_image_url:
            pickup.proof_image_url = proof_image_url
        pickup.save()

        # Update harvest status if linked
        if pickup.harvest:
            if new_status in [Pickup.Status.PICKED_UP, Pickup.Status.COMPLETED]:
                pickup.harvest.status = Harvest.Status.IN_TRANSIT
                pickup.harvest.save()

        serializer = self.get_serializer(pickup)
        return api_response(data=serializer.data, message=f"Pickup status updated to {new_status}")

class DeliveryViewSet(viewsets.ModelViewSet):
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Delivery.objects.all().order_by('-created_at')
        if user.role == 'DRIVER':
            return Delivery.objects.filter(Q(driver=user) | Q(driver__isnull=True)).order_by('-created_at')
        return Delivery.objects.all().order_by('-created_at')

    def list(self, request, *args, **kwargs):
        deliveries = self.get_queryset()
        serializer = self.get_serializer(deliveries, many=True)
        return api_response(data=serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(data=serializer.data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        delivery = self.get_object()
        new_status = request.data.get('status')

        if not new_status or new_status not in Delivery.Status.values:
            return api_error(message=f"Invalid status. Choose from {Delivery.Status.values}", status_code=status.HTTP_400_BAD_REQUEST)

        delivery.status = new_status
        delivery.save()

        # If delivered, update associated order
        if new_status == Delivery.Status.DELIVERED and delivery.order:
            delivery.order.status = Order.Status.DELIVERED
            delivery.order.save()

        serializer = self.get_serializer(delivery)
        return api_response(data=serializer.data, message=f"Delivery status updated to {new_status}")

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        routes = self.get_queryset()
        serializer = self.get_serializer(routes, many=True)
        return api_response(data=serializer.data)

class DriverDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        vehicle = Vehicle.objects.filter(driver=user).first()
        pickups = Pickup.objects.filter(Q(driver=user) | Q(driver__isnull=True))[:10]
        deliveries = Delivery.objects.filter(Q(driver=user) | Q(driver__isnull=True))[:10]

        # Format driver tasks for frontend compatibility
        tasks = []
        for p in pickups:
            crop_name = 'Produce'
            if p.harvest and p.harvest.listing and p.harvest.listing.product:
                crop_name = p.harvest.listing.product.name
            tasks.append({
                'id': f"pickup-{p.id}",
                'raw_id': str(p.id),
                'orderId': f"PU-{p.pickup_number}",
                'type': 'Farmer Pickup',
                'title': f"{p.farmer.name} — Pickup {p.quantity_kg} kg {crop_name}",
                'location': p.pickup_address,
                'quantityKg': float(p.quantity_kg),
                'status': 'Accepted' if p.status == Pickup.Status.ACCEPTED else ('Completed' if p.status == Pickup.Status.COMPLETED else 'Pending'),
                'rawStatus': p.status,
                'timeSlot': p.scheduled_time,
                'contactPerson': p.farmer.name,
                'contactPhone': p.farmer.phone or '+91 98220 14589',
                'proofImage': p.proof_image_url
            })

        for d in deliveries:
            tasks.append({
                'id': f"delivery-{d.id}",
                'raw_id': str(d.id),
                'orderId': d.order.order_number,
                'type': 'Customer Delivery',
                'title': f"Customer Order #{d.order.order_number} to {d.destination}",
                'location': d.destination,
                'quantityKg': 25,
                'status': 'Completed' if d.status == Delivery.Status.DELIVERED else ('En Route' if d.status == Delivery.Status.OUT_FOR_DELIVERY else 'Pending'),
                'rawStatus': d.status,
                'timeSlot': d.scheduled_time,
                'contactPerson': d.order.buyer.name if d.order and d.order.buyer else 'Customer',
                'contactPhone': d.order.buyer.phone if d.order and d.order.buyer else '+91 98500 78210',
                'proofImage': ''
            })

        vehicle_data = VehicleSerializer(vehicle).data if vehicle else None

        return api_response(data={
            'vehicle': vehicle_data,
            'tasks': tasks,
            'pickups': PickupSerializer(pickups, many=True).data,
            'deliveries': DeliverySerializer(deliveries, many=True).data,
            'completedCount': len([t for t in tasks if t['status'] == 'Completed']),
            'pendingCount': len([t for t in tasks if t['status'] != 'Completed']),
        })
