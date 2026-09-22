/**
 * Farm2Market AI - Service Layer
 * Cleanly abstracts all backend endpoints and transforms payloads between
 * backend Django models and frontend React TypeScript interfaces.
 */

import { api } from './client';
import { 
  User, 
  ProduceListing, 
  Order, 
  CollectionCenter, 
  QualityCheckRecord, 
  Vehicle, 
  DriverTask, 
  Notification, 
  Complaint, 
  DemandForecastData, 
  PriceInsight,
  OrderStatus,
  UserRole
} from '../types';

export const authService = {
  async login(email: string, password = '123456') {
    const res = await api.post('/auth/login/', { email, password });
    if (res.success && res.data?.access) {
      api.setTokens(res.data.access, res.data.refresh);
      return res.data.user;
    }
    return null;
  },

  async demoLogin(role: UserRole) {
    const roleEmailMap: Record<UserRole, string> = {
      farmer: 'farmer@demo.com',
      consumer: 'consumer@demo.com',
      bulk_buyer: 'buyer@demo.com',
      admin: 'admin@demo.com',
      collection_center: 'center@demo.com',
      driver: 'driver@demo.com'
    };
    const email = roleEmailMap[role] || 'farmer@demo.com';
    return this.login(email, '123456');
  },

  async logout() {
    api.clearTokens();
  },

  async getMe(): Promise<User | null> {
    const res = await api.get('/auth/me/');
    return res.success ? res.data : null;
  }
};

export const productService = {
  async getMarketplace(params?: any): Promise<ProduceListing[]> {
    const res = await api.get('/marketplace/', { params });
    if (!res.success || !Array.isArray(res.data)) return [];

    return res.data.map((item: any): ProduceListing => ({
      id: item.id,
      farmerId: item.farmer,
      farmerName: item.farmer_name || 'Farmer',
      farmerPhone: item.farmer_phone || '+91 98220 14589',
      fpoName: item.fpo_name || 'Sahyadri Farmers Producer Co.',
      cropName: item.product_name || 'Produce',
      category: item.category || 'Vegetables',
      variety: item.variety || 'Standard Select',
      quantity: Number(item.initial_quantity || item.quantity_available || 500),
      availableQuantity: Number(item.quantity_available || 0),
      unit: item.quantity_unit || 'kg',
      expectedHarvestDate: item.harvest_date || '25 Sept',
      harvestStatus: item.harvest_status || 'Growing',
      location: item.location || 'Sangli',
      qualityGrade: item.quality_grade || 'Grade A',
      farmerPrice: Number(item.price_per_unit || 24),
      marketRefPrice: Number(item.market_ref_price || 23),
      aiSuggestedMin: Number(item.ai_suggested_min || 22),
      aiSuggestedMax: Number(item.ai_suggested_max || 26),
      organic: Boolean(item.organic),
      description: item.description || '',
      imageUrl: item.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
      verified: true,
      createdAt: item.created_at || '2026-09-20'
    }));
  },

  async createListing(listingData: any) {
    return api.post('/listings/', listingData);
  },

  async updateHarvestStatus(id: string, harvestStatus: string) {
    return api.post(`/listings/${id}/harvest-status/`, { harvest_status: harvestStatus });
  },

  async updateFarmerPrice(id: string, price: number) {
    return api.post(`/listings/${id}/update-price/`, { price });
  }
};

export const orderService = {
  async getOrders(params?: any): Promise<Order[]> {
    const res = await api.get('/orders/', { params });
    if (!res.success || !Array.isArray(res.data)) return [];

    return res.data.map((o: any): Order => {
      const items = (o.items || []).map((it: any) => ({
        id: it.id,
        listingId: it.produce_listing,
        cropName: it.crop_name || 'Produce',
        quantity: Number(it.quantity || 0),
        unitPrice: Number(it.price_per_unit || 0),
        farmerPrice: Number(it.price_per_unit ? it.price_per_unit - 4 : 20),
        totalPrice: Number(it.subtotal || 0),
        imageUrl: it.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80'
      }));

      return {
        id: o.order_number || o.id,
        buyerId: o.buyer,
        buyerName: o.buyer_name || 'Buyer',
        buyerType: o.order_type === 'BULK' ? 'bulk_buyer' : 'consumer',
        buyerPhone: o.buyer_phone || '+91 98500 78210',
        deliveryAddress: o.delivery_address || 'Pune Hub',
        deliveryCity: o.delivery_city || 'Pune',
        deliverySlot: o.delivery_slot || '05:00 PM – 07:00 PM',
        items,
        status: (o.status_display || o.status || 'Created') as OrderStatus,
        orderDate: o.created_at?.split('T')[0] || '2026-09-21',
        estimatedDeliveryDate: '2026-09-22',
        isBulkOrder: o.order_type === 'BULK',
        farmerSubtotal: Number(o.subtotal || 0),
        collectionHandlingFee: Number(o.collection_fee || 0),
        transportLogisticsFee: Number(o.transport_fee || 0),
        platformServiceFee: Number(o.platform_fee || 0),
        totalAmount: Number(o.total_amount || 0),
        paymentMethod: (o.payment_method || 'UPI') as any,
        paymentStatus: (o.payment_status || 'Paid') as any,
        actualReceivedWeight: o.actual_weight_received ? Number(o.actual_weight_received) : undefined,
        qualityInspectedGrade: o.quality_grade || 'Grade A',
        assignedDriverId: o.assigned_driver,
        assignedVehicleNumber: o.assigned_vehicle_number,
        collectionCenterId: o.collection_center
      };
    });
  },

  async createOrder(orderPayload: any) {
    return api.post('/orders/', orderPayload);
  },

  async updateOrderStatus(orderId: string, status: string) {
    return api.post(`/orders/${orderId}/status/`, { status });
  },

  async simulatePayment(orderId: string, paymentMethod = 'UPI') {
    return api.post('/payments/process-simulated/', {
      order_id: orderId,
      payment_method: paymentMethod
    });
  },

  async getPriceBreakdown(orderId: string) {
    return api.get(`/payments/order/${orderId}/breakdown/`);
  }
};

export const collectionService = {
  async getCenters(): Promise<CollectionCenter[]> {
    const res = await api.get('/collection/centers/');
    if (!res.success || !Array.isArray(res.data)) return [];

    return res.data.map((c: any): CollectionCenter => ({
      id: c.id,
      name: c.name,
      location: c.address || c.district,
      managerName: c.manager_name || 'Manager Anand',
      phone: c.contact_phone || '+91 97630 11980',
      capacityKg: Number(c.capacity || 15000),
      currentStockKg: Number(c.current_capacity || 8400),
      todaysExpectedKg: 3500,
      todaysReceivedKg: 2800,
      pendingPickupsCount: 12,
      readyDispatchCount: 8
    }));
  },

  async getQualityChecks(): Promise<QualityCheckRecord[]> {
    const res = await api.get('/collection/qc/');
    if (!res.success || !Array.isArray(res.data)) return [];

    return res.data.map((qc: any): QualityCheckRecord => ({
      id: qc.id,
      orderId: qc.order_number || 'FM1025',
      cropName: qc.crop_name || 'Tomato',
      farmerName: qc.farmer_name || 'Farmer Ramesh',
      expectedWeightKg: Number(qc.expected_quantity || 500),
      actualWeightKg: Number(qc.actual_quantity || 485),
      assignedGrade: qc.quality_grade || 'Grade A',
      moistureContent: '88.5%',
      defectPercentage: 1.2,
      inspectorName: qc.inspector_name || 'Anand Deshmukh',
      status: 'Verified',
      adjustedFarmerPayout: Number(qc.actual_quantity ? qc.actual_quantity * 24 : 11640),
      inspectedAt: qc.checked_at?.split('T')[0] || '2026-09-21 09:15 AM',
      notes: qc.notes || 'Verified Grade A'
    }));
  },

  async recordQualityCheck(qcData: any) {
    return api.post('/collection/qc/', qcData);
  }
};

export const logisticsService = {
  async getVehicles(): Promise<Vehicle[]> {
    const res = await api.get('/logistics/vehicles/');
    if (!res.success || !Array.isArray(res.data)) return [];

    return res.data.map((v: any): Vehicle => ({
      id: v.id,
      registrationNumber: v.registrationNumber || v.vehicle_number,
      driverId: v.driver,
      driverName: v.driver_name || 'Rahul Patil',
      driverPhone: v.driver_phone || '+91 99750 33812',
      capacityKg: Number(v.capacity_kg || 1000),
      currentLoadKg: Number(v.current_load_kg || 750),
      vehicleType: v.vehicle_type || 'Pickup Truck (1 Ton)',
      currentStatus: v.currentStatus || v.status || 'Available for pickup',
      currentLocation: v.currentLocation || v.current_location_name || 'Sangli Corridor',
      routeSummary: 'Sangli Farms → Sangli Collection Hub'
    }));
  },

  async getDriverDashboard(): Promise<{ vehicle: any; tasks: DriverTask[]; completedCount: number; pendingCount: number }> {
    const res = await api.get('/logistics/driver-dashboard/');
    if (res.success && res.data) {
      return res.data;
    }
    return { vehicle: null, tasks: [], completedCount: 0, pendingCount: 0 };
  },

  async acceptPickup(pickupId: string) {
    return api.post(`/logistics/pickups/${pickupId}/accept/`);
  },

  async updatePickupStatus(pickupId: string, status: string, proofImageUrl?: string) {
    return api.post(`/logistics/pickups/${pickupId}/status/`, {
      status,
      proof_image_url: proofImageUrl
    });
  },

  async updateDeliveryStatus(deliveryId: string, status: string) {
    return api.post(`/logistics/deliveries/${deliveryId}/status/`, { status });
  }
};

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const res = await api.get('/notifications/');
    if (!res.success || !Array.isArray(res.data)) return [];

    return res.data.map((n: any): Notification => ({
      id: n.id,
      targetRole: (n.targetRole || n.target_role || 'farmer').toLowerCase() as any,
      userId: n.userId || n.user,
      title: n.title,
      message: n.message,
      timestamp: 'Recently',
      read: Boolean(n.read ?? n.is_read),
      type: n.type || n.notification_type || 'order'
    }));
  },

  async markAsRead(id: string) {
    return api.post(`/notifications/${id}/read/`);
  },

  async markAllAsRead() {
    return api.post('/notifications/read-all/');
  }
};

export const complaintService = {
  async getComplaints(): Promise<Complaint[]> {
    const res = await api.get('/complaints/');
    if (!res.success || !Array.isArray(res.data)) return [];

    return res.data.map((c: any): Complaint => ({
      id: c.id,
      orderId: c.orderId || 'FM1024',
      reporterName: c.reporterName || 'Customer',
      reporterRole: c.reporterRole || 'consumer',
      reporterPhone: c.reporterPhone || '+91 98230 44551',
      category: c.category || 'Damaged produce',
      description: c.description,
      status: c.status || 'Submitted',
      resolutionNotes: c.resolutionNotes || c.resolution_notes || '',
      createdAt: c.createdAt || '2026-09-20'
    }));
  },

  async createComplaint(data: any) {
    return api.post('/complaints/', data);
  },

  async resolveComplaint(id: string, notes: string) {
    return api.post(`/complaints/${id}/resolve/`, { notes });
  }
};

export const analyticsService = {
  async getDemandForecast(crop = 'Tomato', region = 'Western Maharashtra'): Promise<DemandForecastData> {
    const res = await api.get('/ai/demand/', { params: { crop, region } });
    if (res.success && res.data) {
      return res.data;
    }
    // Fallback standard
    return {
      cropName: crop,
      expectedDemandKg: 12500,
      availableSupplyKg: 10000,
      demandStatus: 'High',
      warningMessage: 'Possible supply shortage in the next 7 days in Western Maharashtra corridor.',
      aiExplanation: 'Demand is predicted to increase based on historical sales and forward orders.',
      historicalDemand: [],
      sevenDayForecast: [],
      thirtyDayForecast: []
    };
  },

  async getPriceRecommendation(crop = 'Tomato', grade = 'Grade A', organic = false): Promise<PriceInsight> {
    const res = await api.get('/ai/price-recommendation/', { params: { crop, grade, organic } });
    if (res.success && res.data) {
      return res.data;
    }
    return {
      cropName: crop,
      marketRefPrice: 23,
      demandLevel: 'High',
      supplyLevel: 'Moderate',
      qualityGrade: grade as any,
      logisticsCostPerKg: 3,
      handlingCostPerKg: 1,
      platformFeePerKg: 1,
      aiSuggestedMin: 22,
      aiSuggestedMax: 26,
      farmerSelectedPrice: 24,
      disclaimer: 'AI provides a recommendation. The farmer decides the final selling price.'
    };
  },

  async getAdminDashboard() {
    return api.get('/admin/dashboard/');
  },

  async getAdminAnalytics() {
    return api.get('/admin/analytics/');
  }
};
