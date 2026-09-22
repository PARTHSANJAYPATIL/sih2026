import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  ProduceListing, 
  Order, 
  BulkRequirement, 
  CollectionCenter, 
  QualityCheckRecord, 
  Vehicle, 
  DriverTask, 
  Notification, 
  Complaint, 
  OrderStatus,
  UserRole
} from '../types';
import { 
  DEMO_USERS, 
  INITIAL_PRODUCE, 
  INITIAL_ORDERS, 
  INITIAL_BULK_REQUIREMENTS, 
  INITIAL_COLLECTION_CENTERS, 
  INITIAL_QC_RECORDS, 
  INITIAL_VEHICLES, 
  INITIAL_DRIVER_TASKS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_COMPLAINTS 
} from '../data/mockData';
import { 
  authService, 
  productService, 
  orderService, 
  collectionService, 
  logisticsService, 
  notificationService, 
  complaintService 
} from '../api/services';

export interface CartItem {
  listing: ProduceListing;
  quantityKg: number;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  
  produceListings: ProduceListing[];
  addProduce: (produce: Omit<ProduceListing, 'id' | 'createdAt'>) => void;
  updateHarvestStatus: (id: string, status: ProduceListing['harvestStatus']) => void;
  updateFarmerPrice: (id: string, price: number) => void;
  
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderDate'>) => string;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  
  bulkRequirements: BulkRequirement[];
  addBulkRequirement: (req: Omit<BulkRequirement, 'id' | 'createdAt' | 'fulfilledQuantity' | 'status' | 'matchedFarmers'>) => void;
  
  collectionCenters: CollectionCenter[];
  qcRecords: QualityCheckRecord[];
  recordQualityCheck: (qc: Omit<QualityCheckRecord, 'id' | 'inspectedAt'>) => void;
  
  vehicles: Vehicle[];
  driverTasks: DriverTask[];
  updateDriverTaskStatus: (taskId: string, status: DriverTask['status']) => void;
  
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  
  complaints: Complaint[];
  addComplaint: (comp: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => void;
  resolveComplaint: (id: string, resolution: string) => void;
  
  cart: CartItem[];
  addToCart: (listing: ProduceListing, quantityKg: number) => void;
  removeFromCart: (listingId: string) => void;
  updateCartQuantity: (listingId: string, quantityKg: number) => void;
  clearCart: () => void;
  
  activeView: string;
  setActiveView: (view: string) => void;
  
  demoScenarioStep: number;
  setDemoScenarioStep: (step: number) => void;
  advanceScenarioStep: () => void;
  resetDemoData: () => void;

  backendConnected: boolean;
  isSyncing: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('f2m_currentUser');
    return saved ? JSON.parse(saved) : DEMO_USERS[0];
  });

  const [produceListings, setProduceListings] = useState<ProduceListing[]>(() => {
    const saved = localStorage.getItem('f2m_produce');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCE;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('f2m_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [bulkRequirements, setBulkRequirements] = useState<BulkRequirement[]>(() => {
    const saved = localStorage.getItem('f2m_bulk_reqs');
    return saved ? JSON.parse(saved) : INITIAL_BULK_REQUIREMENTS;
  });

  const [collectionCenters, setCollectionCenters] = useState<CollectionCenter[]>(() => {
    const saved = localStorage.getItem('f2m_centers');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTION_CENTERS;
  });

  const [qcRecords, setQcRecords] = useState<QualityCheckRecord[]>(() => {
    const saved = localStorage.getItem('f2m_qc_records');
    return saved ? JSON.parse(saved) : INITIAL_QC_RECORDS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('f2m_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [driverTasks, setDriverTasks] = useState<DriverTask[]>(() => {
    const saved = localStorage.getItem('f2m_driver_tasks');
    return saved ? JSON.parse(saved) : INITIAL_DRIVER_TASKS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('f2m_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('f2m_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('f2m_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeView, setActiveView] = useState<string>('landing');
  const [demoScenarioStep, setDemoScenarioStep] = useState<number>(0);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('f2m_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('f2m_produce', JSON.stringify(produceListings));
  }, [produceListings]);

  useEffect(() => {
    localStorage.setItem('f2m_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('f2m_bulk_reqs', JSON.stringify(bulkRequirements));
  }, [bulkRequirements]);

  useEffect(() => {
    localStorage.setItem('f2m_centers', JSON.stringify(collectionCenters));
  }, [collectionCenters]);

  useEffect(() => {
    localStorage.setItem('f2m_qc_records', JSON.stringify(qcRecords));
  }, [qcRecords]);

  useEffect(() => {
    localStorage.setItem('f2m_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('f2m_driver_tasks', JSON.stringify(driverTasks));
  }, [driverTasks]);

  useEffect(() => {
    localStorage.setItem('f2m_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('f2m_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('f2m_cart', JSON.stringify(cart));
  }, [cart]);

  // Initial fetch and sync from backend database
  const syncWithBackend = useCallback(async (roleToLogin?: UserRole) => {
    setIsSyncing(true);
    try {
      // 1. Authenticate with backend
      const targetRole = roleToLogin || currentUser.role;
      await authService.demoLogin(targetRole);

      // 2. Concurrently fetch all datasets
      const [
        marketplaceData,
        ordersData,
        centersData,
        qcData,
        vehiclesData,
        driverData,
        notifsData,
        complaintsData
      ] = await Promise.all([
        productService.getMarketplace().catch(() => []),
        orderService.getOrders().catch(() => []),
        collectionService.getCenters().catch(() => []),
        collectionService.getQualityChecks().catch(() => []),
        logisticsService.getVehicles().catch(() => []),
        logisticsService.getDriverDashboard().catch(() => null),
        notificationService.getNotifications().catch(() => []),
        complaintService.getComplaints().catch(() => [])
      ]);

      if (marketplaceData && marketplaceData.length > 0) {
        setProduceListings(marketplaceData);
      }
      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData);
      }
      if (centersData && centersData.length > 0) {
        setCollectionCenters(centersData);
      }
      if (qcData && qcData.length > 0) {
        setQcRecords(qcData);
      }
      if (vehiclesData && vehiclesData.length > 0) {
        setVehicles(vehiclesData);
      }
      if (driverData && driverData.tasks && driverData.tasks.length > 0) {
        setDriverTasks(driverData.tasks);
      }
      if (notifsData && notifsData.length > 0) {
        setNotifications(notifsData);
      }
      if (complaintsData && complaintsData.length > 0) {
        setComplaints(complaintsData);
      }

      setBackendConnected(true);
    } catch {
      setBackendConnected(false);
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser.role]);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  const switchRole = async (role: UserRole) => {
    const matched = DEMO_USERS.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      if (activeView !== 'landing' && activeView !== 'marketplace') {
        if (role === 'farmer') setActiveView('farmer-dashboard');
        else if (role === 'consumer') setActiveView('consumer-dashboard');
        else if (role === 'bulk_buyer') setActiveView('bulk-dashboard');
        else if (role === 'admin') setActiveView('admin-dashboard');
        else if (role === 'collection_center') setActiveView('collection-dashboard');
        else if (role === 'driver') setActiveView('driver-dashboard');
      }
      // Re-authenticate and sync backend for this role
      await syncWithBackend(role);
    }
  };

  const addProduce = (produce: Omit<ProduceListing, 'id' | 'createdAt'>) => {
    const newId = `prod-${Date.now()}`;
    const newListing: ProduceListing = {
      ...produce,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    // Optimistic update
    setProduceListings(prev => [newListing, ...prev]);

    // Background backend call
    productService.createListing({
      crop_name: produce.cropName,
      category: produce.category,
      variety: produce.variety,
      initial_quantity: produce.quantity,
      price_per_unit: produce.farmerPrice,
      quality_grade: produce.qualityGrade,
      harvest_date: produce.expectedHarvestDate,
      harvest_status: produce.harvestStatus,
      location: produce.location,
      description: produce.description,
      organic: produce.organic,
      image_url: produce.imageUrl
    }).catch(() => {});
    
    addNotification({
      targetRole: 'admin',
      title: 'New Produce Listed',
      message: `${produce.farmerName} listed ${produce.quantity} kg of ${produce.cropName} (${produce.qualityGrade}) at ₹${produce.farmerPrice}/kg.`,
      type: 'harvest'
    });
  };

  const updateHarvestStatus = (id: string, status: ProduceListing['harvestStatus']) => {
    setProduceListings(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, harvestStatus: status };
      }
      return p;
    }));

    productService.updateHarvestStatus(id, status).catch(() => {});

    if (status === 'Ready for Harvest') {
      addNotification({
        targetRole: 'driver',
        title: 'Farm-Gate Pickup Triggered',
        message: 'Farmer marked lot ready for harvest. Scheduled auto-pickup routing.',
        type: 'logistics'
      });
      addNotification({
        targetRole: 'farmer',
        title: 'Harvest Status Updated',
        message: 'Your produce is marked "Ready for Harvest". Farm-gate pickup route scheduled.',
        type: 'harvest'
      });
    }
  };

  const updateFarmerPrice = (id: string, price: number) => {
    setProduceListings(prev => prev.map(p => p.id === id ? { ...p, farmerPrice: price } : p));
    productService.updateFarmerPrice(id, price).catch(() => {});
  };

  const addOrder = (newOrderData: Omit<Order, 'id' | 'orderDate'>): string => {
    const newId = `FM${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...newOrderData,
      id: newId,
      orderDate: new Date().toISOString().split('T')[0]
    };
    setOrders(prev => [newOrder, ...prev]);

    // Background backend order creation & simulated payment
    (async () => {
      try {
        const itemsPayload = newOrderData.items.map(it => ({
          produce_listing_id: it.listingId || '00000000-0000-0000-0000-000000000001',
          quantity: it.quantity
        }));

        const res = await orderService.createOrder({
          order_type: newOrderData.isBulkOrder ? 'BULK' : 'CONSUMER',
          delivery_address: newOrderData.deliveryAddress,
          delivery_city: newOrderData.deliveryCity,
          delivery_slot: newOrderData.deliverySlot,
          items: itemsPayload
        });

        if (res.success && res.data?.id) {
          await orderService.simulatePayment(res.data.id, newOrderData.paymentMethod || 'UPI');
        }
      } catch {
        // Retain optimistic
      }
    })();

    // Add notifications
    addNotification({
      targetRole: 'admin',
      title: `New Order Received #${newId}`,
      message: `${newOrder.buyerName} placed an order of ₹${newOrder.totalAmount}. Logistics assignment initiated.`,
      type: 'order'
    });
    addNotification({
      targetRole: newOrder.buyerType,
      userId: newOrder.buyerId,
      title: `Order Placed #${newId}`,
      message: `Your order has been confirmed! Scheduled delivery: ${newOrder.deliverySlot}.`,
      type: 'order'
    });

    clearCart();
    return newId;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    }));

    orderService.updateOrderStatus(orderId, newStatus).catch(() => {});

    addNotification({
      targetRole: 'all',
      title: `Order ${orderId} Status Updated`,
      message: `Order status changed to "${newStatus}".`,
      type: 'order'
    });
  };

  const addBulkRequirement = (req: Omit<BulkRequirement, 'id' | 'createdAt' | 'fulfilledQuantity' | 'status' | 'matchedFarmers'>) => {
    const newId = `bulk-req-${Date.now()}`;
    const matches = [
      { farmerId: 'farmer-a', farmerName: 'Farmer A (Ramesh Patil)', location: 'Miraj, Sangli', quantityAllocated: Math.round(req.requiredQuantity * 0.3), status: 'Matched' as const, payoutAmount: Math.round(req.requiredQuantity * 0.3 * (req.maxBudgetPerKg - 3)) },
      { farmerId: 'farmer-b', farmerName: 'Farmer B (Ankush Rao)', location: 'Tasgaon, Sangli', quantityAllocated: Math.round(req.requiredQuantity * 0.25), status: 'Matched' as const, payoutAmount: Math.round(req.requiredQuantity * 0.25 * (req.maxBudgetPerKg - 3)) },
      { farmerId: 'farmer-c', farmerName: 'Farmer C (Pandurang Mane)', location: 'Palus, Sangli', quantityAllocated: Math.round(req.requiredQuantity * 0.25), status: 'Matched' as const, payoutAmount: Math.round(req.requiredQuantity * 0.25 * (req.maxBudgetPerKg - 3)) },
      { farmerId: 'farmer-d', farmerName: 'Farmer D (Tanaji Shinde)', location: 'Kavathe, Sangli', quantityAllocated: Math.round(req.requiredQuantity * 0.2), status: 'Matched' as const, payoutAmount: Math.round(req.requiredQuantity * 0.2 * (req.maxBudgetPerKg - 3)) }
    ];

    const newReq: BulkRequirement = {
      ...req,
      id: newId,
      fulfilledQuantity: req.requiredQuantity,
      status: 'Matched',
      matchedFarmers: matches,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBulkRequirements(prev => [newReq, ...prev]);

    addNotification({
      targetRole: 'bulk_buyer',
      title: 'Bulk Requirement Auto-Matched!',
      message: `Requirement for ${req.requiredQuantity} kg ${req.cropName} successfully matched across 4 local farmers in Sangli.`,
      type: 'order'
    });

    addNotification({
      targetRole: 'farmer',
      title: 'New Bulk Order Allocation',
      message: `You have been allocated a supply portion for ${req.organizationName}'s ${req.cropName} contract.`,
      type: 'order'
    });
  };

  const recordQualityCheck = (qc: Omit<QualityCheckRecord, 'id' | 'inspectedAt'>) => {
    const newId = `qc-${Date.now()}`;
    const newRecord: QualityCheckRecord = {
      ...qc,
      id: newId,
      inspectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' today'
    };

    setQcRecords(prev => [newRecord, ...prev]);

    if (qc.orderId) {
      updateOrderStatus(qc.orderId, 'Quality checked');
    }

    collectionService.recordQualityCheck({
      order_number: qc.orderId,
      crop_name: qc.cropName,
      expected_quantity: qc.expectedWeightKg,
      actual_quantity: qc.actualWeightKg,
      quality_grade: qc.assignedGrade,
      notes: qc.notes
    }).catch(() => {});

    addNotification({
      targetRole: 'farmer',
      title: `Quality Inspection Completed: ${qc.assignedGrade}`,
      message: `Received ${qc.actualWeightKg} kg (Expected ${qc.expectedWeightKg} kg). Verified payout: ₹${qc.adjustedFarmerPayout.toLocaleString()}.`,
      type: 'qc'
    });
  };

  const updateDriverTaskStatus = (taskId: string, status: DriverTask['status']) => {
    setDriverTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    
    const rawId = taskId.replace(/^(pickup-|delivery-)/, '');
    if (taskId.startsWith('pickup-')) {
      const backendStatus = status === 'Completed' ? 'COMPLETED' : (status === 'Accepted' ? 'ACCEPTED' : 'DRIVER_ARRIVED');
      logisticsService.updatePickupStatus(rawId, backendStatus).catch(() => {});
    } else if (taskId.startsWith('delivery-')) {
      const backendStatus = status === 'Completed' ? 'DELIVERED' : 'OUT_FOR_DELIVERY';
      logisticsService.updateDeliveryStatus(rawId, backendStatus).catch(() => {});
    }

    if (status === 'Completed') {
      addNotification({
        targetRole: 'admin',
        title: 'Driver Task Completed',
        message: `Task #${taskId} verified and completed by driver.`,
        type: 'logistics'
      });
    }
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    notificationService.markAsRead(id).catch(() => {});
  };

  const addComplaint = (comp: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => {
    const newComp: Complaint = {
      ...comp,
      id: `cmp-${Date.now()}`,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setComplaints(prev => [newComp, ...prev]);

    complaintService.createComplaint({
      category: comp.category,
      description: comp.description
    }).catch(() => {});

    addNotification({
      targetRole: 'admin',
      title: 'New Quality Complaint Filed',
      message: `${comp.reporterName} reported "${comp.category}" for order #${comp.orderId}.`,
      type: 'system'
    });
  };

  const resolveComplaint = (id: string, resolution: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved', resolutionNotes: resolution } : c));
    complaintService.resolveComplaint(id, resolution).catch(() => {});

    addNotification({
      targetRole: 'all',
      title: 'Complaint Case Resolved',
      message: `Complaint #${id} marked resolved with note: ${resolution}`,
      type: 'system'
    });
  };

  // Cart operations
  const addToCart = (listing: ProduceListing, quantityKg: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.listing.id === listing.id);
      if (existing) {
        return prev.map(item => 
          item.listing.id === listing.id 
            ? { ...item, quantityKg: item.quantityKg + quantityKg }
            : item
        );
      }
      return [...prev, { listing, quantityKg }];
    });
  };

  const removeFromCart = (listingId: string) => {
    setCart(prev => prev.filter(item => item.listing.id !== listingId));
  };

  const updateCartQuantity = (listingId: string, quantityKg: number) => {
    if (quantityKg <= 0) {
      removeFromCart(listingId);
    } else {
      setCart(prev => prev.map(item => 
        item.listing.id === listingId ? { ...item, quantityKg } : item
      ));
    }
  };

  const clearCart = () => setCart([]);

  // Evaluator Scenario Steps (Hotel ABC 1,000 kg Tomato)
  const advanceScenarioStep = () => {
    setDemoScenarioStep(prev => Math.min(prev + 1, 8));
  };

  const resetDemoData = () => {
    localStorage.clear();
    setCurrentUser(DEMO_USERS[0]);
    setProduceListings(INITIAL_PRODUCE);
    setOrders(INITIAL_ORDERS);
    setBulkRequirements(INITIAL_BULK_REQUIREMENTS);
    setQcRecords(INITIAL_QC_RECORDS);
    setVehicles(INITIAL_VEHICLES);
    setDriverTasks(INITIAL_DRIVER_TASKS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setComplaints(INITIAL_COMPLAINTS);
    setCart([]);
    setDemoScenarioStep(0);
    setActiveView('landing');
    syncWithBackend('farmer');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      switchRole,
      produceListings,
      addProduce,
      updateHarvestStatus,
      updateFarmerPrice,
      orders,
      addOrder,
      updateOrderStatus,
      bulkRequirements,
      addBulkRequirement,
      collectionCenters,
      qcRecords,
      recordQualityCheck,
      vehicles,
      driverTasks,
      updateDriverTaskStatus,
      notifications,
      markNotificationAsRead,
      addNotification,
      complaints,
      addComplaint,
      resolveComplaint,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      activeView,
      setActiveView,
      demoScenarioStep,
      setDemoScenarioStep,
      advanceScenarioStep,
      resetDemoData,
      backendConnected,
      isSyncing
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
