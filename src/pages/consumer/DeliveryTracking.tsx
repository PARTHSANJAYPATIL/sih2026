import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { MockRouteMap } from '../../components/maps/MockRouteMap';
import { QRCodeModal, QRDataPayload } from '../../components/common/QRCodeModal';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  QrCode, 
  AlertCircle, 
  Sparkles, 
  Check, 
  Package, 
  RotateCw,
  Award
} from 'lucide-react';

interface DeliveryTrackingProps {
  selectedOrderId?: string;
  onOpenComplaintModal: (orderId: string) => void;
}

export const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({ 
  selectedOrderId = 'FM1024',
  onOpenComplaintModal
}) => {
  const { orders, updateOrderStatus } = useApp();
  const [activeOrderId, setActiveOrderId] = useState<string>(selectedOrderId);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const order = orders.find(o => o.id === activeOrderId) || orders[0];

  // The 10 canonical tracking stages from Requirement 15
  const trackingStages: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'Created', label: 'Order Confirmed', desc: 'Order placed & payment authorized in escrow.' },
    { status: 'Farmer matched', label: 'Farmer Confirmed', desc: 'Farmer Ramesh Patil accepted allocation.' },
    { status: 'Harvest scheduled', label: 'Produce Harvested', desc: 'Fresh farm-gate harvest completed.' },
    { status: 'Produce collected', label: 'Picked Up From Farm', desc: 'Driver Rahul Patil collected crate batch.' },
    { status: 'At collection center', label: 'Reached Collection Center', desc: 'Arrived at Sangli Partner Agro Hub.' },
    { status: 'Quality checked', label: 'Quality Checked', desc: 'Digital scale: 7.1 kg verified (Grade A).' },
    { status: 'Packed', label: 'Packed & Barcoded', desc: 'Safe eco-crates sealed with QR tags.' },
    { status: 'Dispatched', label: 'Dispatched from Hub', desc: 'Loaded onto express corridor vehicle.' },
    { status: 'Out for delivery', label: 'Out for Delivery', desc: 'Driver en route to Kothrud cluster.' },
    { status: 'Delivered', label: 'Delivered', desc: 'Delivered to customer doorstep.' }
  ];

  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Created': return 0;
      case 'Farmer matched': return 1;
      case 'Harvest scheduled': return 2;
      case 'Pickup assigned': return 2;
      case 'Produce collected': return 3;
      case 'At collection center': return 4;
      case 'Quality checked': return 5;
      case 'Packed': return 6;
      case 'Transport assigned': return 6;
      case 'Dispatched': return 7;
      case 'Out for delivery': return 8;
      case 'Delivered': return 9;
      case 'Payment completed': return 9;
      default: return 8;
    }
  };

  const currentStageIndex = getStageIndex(order?.status || 'Out for delivery');

  const advanceStatusInDemo = () => {
    if (!order) return;
    const nextIdx = Math.min(currentStageIndex + 1, trackingStages.length - 1);
    updateOrderStatus(order.id, trackingStages[nextIdx].status);
  };

  const qrPayload: QRDataPayload = {
    type: 'Order',
    title: `Customer Order #${order?.id}`,
    orderNumber: order?.id,
    productName: order?.items.map(i => `${i.cropName} (${i.quantity}kg)`).join(', '),
    farmerName: 'Ramesh Patil & Collective',
    harvestDate: '21 Sept (Today)',
    quantityKg: order?.items.reduce((acc, i) => acc + i.quantity, 0),
    qualityGrade: order?.qualityInspectedGrade || 'Grade A',
    collectionCenter: 'Sangli Agro Collection Hub #4',
    location: 'Miraj, Sangli to Pune Corridor'
  };

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-slate-500">
        No active orders found to track.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Order Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Live Shipment Tracker
            </span>
            <span className="text-xs text-slate-400">Order ID: #{order.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Track Delivery Journey
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time farm-to-doorstep coordination status with verified quality grade and route telematics.
          </p>
        </div>

        {/* Order switcher and quick actions */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={activeOrderId}
            onChange={(e) => setActiveOrderId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
          >
            {orders.map(o => (
              <option key={o.id} value={o.id}>Order #{o.id} ({o.items.map(i => i.cropName).join(', ')})</option>
            ))}
          </select>

          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors"
          >
            <QrCode className="w-4 h-4 text-emerald-700" />
            <span>View Digital QR Pass</span>
          </button>

          <button
            onClick={advanceStatusInDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            title="Advance status by one stage for demo testing"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Next Stage (Demo)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 10-Step Timeline + Map Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: 10-Step Timeline (Requirement 15) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">
              10-Step Traceability Timeline
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Stage {currentStageIndex + 1} of 10
            </span>
          </div>

          <div className="relative pl-6 space-y-6 border-l-2 border-slate-100 my-2 ml-2">
            {trackingStages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.label} className="relative group">
                  {/* Timeline Node */}
                  <div
                    className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                        : 'bg-white border-2 border-slate-200 text-slate-300'
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    )}
                  </div>

                  {/* Stage Label & Details */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${
                        isCurrent ? 'text-blue-700' : isPast ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {stage.label}
                      </span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 text-[9px] font-extrabold rounded border border-blue-200">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Report Quality Issue / Complaint Trigger (Requirement 32) */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onOpenComplaintModal(order.id)}
              className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Report Quality Issue / Damaged Produce</span>
            </button>
          </div>
        </div>

        {/* Right Col: Map & Telematics Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Map Visual Component */}
          <MockRouteMap mode="delivery_tracking" currentStep={currentStageIndex} />

          {/* Order Details & Items Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Items in This Consignment
            </h4>

            <div className="divide-y divide-slate-100">
              {order.items.map(item => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100'}
                      alt={item.cropName}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{item.cropName}</div>
                      <div className="text-slate-500">{item.quantity} kg • Farmer Base: ₹{item.farmerPrice}/kg</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-slate-900">₹{item.totalPrice}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold">Verified Grade A</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Destination & ETA Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" /> Delivery Address:
                </span>
                <div className="font-semibold text-slate-800">{order.deliveryAddress}</div>
                <div className="text-slate-500">{order.deliveryCity}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <span className="text-slate-400 font-medium text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-600" /> Delivery Window:
                </span>
                <div className="font-bold text-blue-700">{order.deliverySlot}</div>
                <div className="text-slate-500">Driver: Rahul Patil (+91 99750 33812)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Inspection Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        payload={qrPayload}
      />
    </div>
  );
};
