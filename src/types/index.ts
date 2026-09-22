export type UserRole = 
  | 'farmer' 
  | 'consumer' 
  | 'bulk_buyer' 
  | 'admin' 
  | 'collection_center' 
  | 'driver';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  location: string;
  avatar?: string;
  fpoName?: string;
  verified?: boolean;
}

export type QualityGrade = 'Grade A' | 'Grade B' | 'Grade C';

export interface ProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  fpoName?: string;
  cropName: string;
  category: 'Vegetables' | 'Fruits' | 'Grains & Pulses' | 'Commercial Crops' | 'Spices';
  variety: string;
  quantity: number; // in kg
  availableQuantity: number;
  unit: string;
  expectedHarvestDate: string;
  harvestStatus: 'Growing' | 'Ready for Harvest' | 'Harvested' | 'Pickup Scheduled' | 'Collected';
  location: string; // Sangli, Kolhapur, Pune, Satara, Nashik
  qualityGrade: QualityGrade;
  farmerPrice: number; // ₹ per kg
  marketRefPrice: number;
  aiSuggestedMin: number;
  aiSuggestedMax: number;
  organic: boolean;
  description: string;
  imageUrl: string;
  verified: boolean;
  createdAt: string;
}

export type OrderStatus =
  | 'Created'
  | 'Farmer matched'
  | 'Harvest scheduled'
  | 'Pickup assigned'
  | 'Produce collected'
  | 'At collection center'
  | 'Quality checked'
  | 'Packed'
  | 'Transport assigned'
  | 'Dispatched'
  | 'Out for delivery'
  | 'Delivered'
  | 'Payment completed';

export interface OrderItem {
  id: string;
  listingId?: string;
  cropName: string;
  quantity: number; // kg
  unitPrice: number; // customer price per kg
  farmerPrice: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface FarmerMatch {
  farmerId: string;
  farmerName: string;
  location: string;
  quantityAllocated: number; // in kg
  status: 'Matched' | 'Ready' | 'Picked Up' | 'At Center';
  payoutAmount: number;
}

export interface Order {
  id: string; // e.g. FM1024
  buyerId: string;
  buyerName: string;
  buyerType: 'consumer' | 'bulk_buyer';
  buyerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliverySlot: string;
  items: OrderItem[];
  status: OrderStatus;
  orderDate: string;
  estimatedDeliveryDate: string;
  isBulkOrder?: boolean;
  farmerMatches?: FarmerMatch[];
  
  // Transparent Financial Breakdown
  farmerSubtotal: number;
  collectionHandlingFee: number;
  transportLogisticsFee: number;
  platformServiceFee: number;
  totalAmount: number;
  
  paymentMethod: 'UPI' | 'Card' | 'COD';
  paymentStatus: 'Pending' | 'Processing' | 'Paid';
  
  // Tracking & QC details
  actualReceivedWeight?: number;
  qualityInspectedGrade?: QualityGrade;
  assignedDriverId?: string;
  assignedVehicleNumber?: string;
  collectionCenterId?: string;
}

export interface BulkRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  organizationName: string;
  cropName: string;
  requiredQuantity: number; // kg
  fulfilledQuantity: number;
  requiredDate: string;
  maxBudgetPerKg: number;
  deliveryLocation: string;
  qualityGrade: QualityGrade;
  status: 'Open' | 'Matching' | 'Matched' | 'Fulfilled' | 'In Transit';
  matchedFarmers: FarmerMatch[];
  createdAt: string;
}

export interface CollectionCenter {
  id: string;
  name: string;
  location: string;
  managerName: string;
  phone: string;
  capacityKg: number;
  currentStockKg: number;
  todaysExpectedKg: number;
  todaysReceivedKg: number;
  pendingPickupsCount: number;
  readyDispatchCount: number;
}

export interface QualityCheckRecord {
  id: string;
  orderId: string;
  cropName: string;
  farmerName: string;
  expectedWeightKg: number;
  actualWeightKg: number;
  assignedGrade: QualityGrade;
  moistureContent: string;
  defectPercentage: number;
  inspectorName: string;
  status: 'Pending' | 'Verified' | 'Flagged';
  adjustedFarmerPayout: number;
  inspectedAt: string;
  notes: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string; // e.g. MH-10-AB-1234
  driverId: string;
  driverName: string;
  driverPhone: string;
  capacityKg: number;
  currentLoadKg: number;
  vehicleType: 'Pickup Truck (1 Ton)' | 'Refrigerated Van (1.5 Ton)' | 'Mini Cargo (750 kg)';
  currentStatus: 'Available for pickup' | 'On Route' | 'At Collection Center' | 'Delivering' | 'Maintenance';
  currentLocation: string;
  routeSummary?: string;
}

export interface DriverTask {
  id: string;
  orderId?: string;
  type: 'Farmer Pickup' | 'Collection Dropoff' | 'Customer Delivery';
  title: string;
  location: string;
  quantityKg: number;
  status: 'Pending' | 'Accepted' | 'En Route' | 'Arrived' | 'Completed';
  timeSlot: string;
  contactPerson: string;
  contactPhone: string;
  proofImageUrl?: string;
}

export interface Notification {
  id: string;
  targetRole: UserRole | 'all';
  userId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'harvest' | 'qc' | 'logistics' | 'payment' | 'system';
}

export interface Complaint {
  id: string;
  orderId: string;
  reporterName: string;
  reporterRole: 'consumer' | 'bulk_buyer' | 'farmer';
  reporterPhone: string;
  category: 'Damaged produce' | 'Wrong quantity' | 'Poor quality' | 'Late delivery' | 'Missing item';
  description: string;
  status: 'Open' | 'Under Investigation' | 'Resolved';
  resolutionNotes?: string;
  createdAt: string;
}

export interface DemandForecastData {
  cropName: string;
  expectedDemandKg: number;
  availableSupplyKg: number;
  demandStatus: 'High' | 'Moderate' | 'Low';
  warningMessage?: string;
  aiExplanation: string;
  historicalDemand: { day: string; demand: number; supply: number }[];
  sevenDayForecast: { day: string; expectedDemand: number; expectedSupply: number; priceTrend: number }[];
  thirtyDayForecast: { week: string; projectedDemand: number; projectedSupply: number; avgPrice: number }[];
}

export interface PriceInsight {
  cropName: string;
  marketRefPrice: number;
  demandLevel: 'High' | 'Moderate' | 'Low';
  supplyLevel: 'High' | 'Moderate' | 'Low';
  qualityGrade: QualityGrade;
  logisticsCostPerKg: number;
  handlingCostPerKg: number;
  platformFeePerKg: number;
  aiSuggestedMin: number;
  aiSuggestedMax: number;
  farmerSelectedPrice: number;
  disclaimer: string;
}
