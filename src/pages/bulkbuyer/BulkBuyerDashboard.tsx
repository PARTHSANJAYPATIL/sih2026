import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BulkRequirement, QualityGrade } from '../../types';
import { 
  Building2, 
  Plus, 
  Users, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  FileText, 
  Truck, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BulkBuyerDashboardProps {
  onOpenTracking: (orderId: string) => void;
}

export const BulkBuyerDashboard: React.FC<BulkBuyerDashboardProps> = ({ onOpenTracking }) => {
  const { bulkRequirements, addBulkRequirement, currentUser, orders } = useApp();

  const [activeTab, setActiveTab] = useState<'requirements' | 'create' | 'matching' | 'orders'>('requirements');
  const [selectedReq, setSelectedReq] = useState<BulkRequirement>(bulkRequirements[0]);

  // Form states for Requirement 17
  const [productName, setProductName] = useState('Tomato');
  const [requiredQuantity, setRequiredQuantity] = useState<number>(2000);
  const [requiredDate, setRequiredDate] = useState('28 Sept');
  const [maxBudgetPerKg, setMaxBudgetPerKg] = useState<number>(25);
  const [deliveryLocation, setDeliveryLocation] = useState('Kolhapur');
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A');
  const [notes, setNotes] = useState('For central kitchen preparation; require high skin firmness and uniform sizing.');

  const handlePostRequirement = (e: React.FormEvent) => {
    e.preventDefault();

    addBulkRequirement({
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      organizationName: currentUser.fpoName || 'Hotel ABC & Hospitality Group',
      cropName: productName,
      requiredQuantity,
      requiredDate,
      maxBudgetPerKg,
      deliveryLocation,
      qualityGrade,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setActiveTab('matching');
  };

  const hotelOrders = orders.filter(o => o.buyerType === 'bulk_buyer');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> HoReCa & Commercial Procurement Portal
            </span>
            <span className="text-xs text-indigo-200">Buyer: {currentUser.fpoName || 'Hotel ABC'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Commercial Bulk Buyer Hub
          </h1>
          <p className="text-indigo-100 text-xs mt-1">
            Aggregate high-volume orders across multiple smallholder farmers with certified Grade A quality and guaranteed farm-gate cold chain.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Bulk Requirement</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs (Requirement 16) */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2 no-scrollbar text-xs font-semibold">
        <button
          onClick={() => setActiveTab('requirements')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'requirements' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active Contracts ({bulkRequirements.length})
        </button>
        <button
          onClick={() => setActiveTab('matching')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'matching' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Multi-Farmer Matching Visual
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'create' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          + Create Requirement
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dispatches & Invoices ({hotelOrders.length})
        </button>
      </div>

      {/* TAB 1: ACTIVE REQUIREMENTS LIST */}
      {activeTab === 'requirements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bulkRequirements.map(req => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle hover:border-indigo-300 transition-all space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-lg">
                    🍅
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {req.cropName} — {req.requiredQuantity.toLocaleString()} kg
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">Req #{req.id} • {req.organizationName}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {req.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Required Date</span>
                  <span className="font-bold text-slate-900">{req.requiredDate}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Ceiling Budget</span>
                  <span className="font-bold text-indigo-700">₹{req.maxBudgetPerKg}/kg</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Destination</span>
                  <span className="font-bold text-slate-900">{req.deliveryLocation}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Quality Target</span>
                  <span className="font-bold text-emerald-700">{req.qualityGrade}</span>
                </div>
              </div>

              {/* Farmer Matching Summary Bar */}
              <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Matched Across {req.matchedFarmers.length} Local Farmers
                  </span>
                  <span className="font-black text-indigo-700">
                    {req.fulfilledQuantity} / {req.requiredQuantity} kg (100%)
                  </span>
                </div>
                <div className="w-full h-2 bg-indigo-200 rounded-full overflow-hidden flex">
                  <div style={{ width: '25%' }} className="bg-emerald-600" title="Farmer A (500kg)" />
                  <div style={{ width: '20%' }} className="bg-emerald-500" title="Farmer B (400kg)" />
                  <div style={{ width: '30%' }} className="bg-teal-600" title="Farmer C (600kg)" />
                  <div style={{ width: '25%' }} className="bg-indigo-600" title="Farmer D (500kg)" />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => {
                    setSelectedReq(req);
                    setActiveTab('matching');
                  }}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Inspect Farmer Allocation Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onOpenTracking('FM1025')}
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Track Dispatch
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: MULTI-FARMER MATCHING VISUALIZATION (Requirement 18) */}
      {activeTab === 'matching' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                Requirement 18 Showcase
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Farmer Order Aggregation & Matching
              </h2>
              <p className="text-xs text-slate-500">
                How Farm2Market AI coordinates multiple smallholders to fulfill a single large commercial contract.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Order Successfully Matched (2,000 kg / 2,000 kg)</span>
            </div>
          </div>

          {/* Central Match Architecture Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Buyer Demand Card */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                <Building2 className="w-4 h-4" />
                <span>Buyer Procurement Contract</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                2,000 kg Tomato
              </h3>
              <div className="space-y-1 text-xs text-slate-300 border-t border-slate-800 pt-3">
                <div className="flex justify-between">
                  <span>Buyer Organization:</span>
                  <span className="font-bold text-white">Hotel ABC</span>
                </div>
                <div className="flex justify-between">
                  <span>Required Date:</span>
                  <span className="font-bold text-white">28 Sept</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Budget:</span>
                  <span className="font-bold text-emerald-400">₹25/kg Max</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Destination:</span>
                  <span className="font-bold text-white">Kolhapur</span>
                </div>
                <div className="flex justify-between">
                  <span>Certified Quality:</span>
                  <span className="font-bold text-amber-300">Grade A</span>
                </div>
              </div>
            </div>

            {/* Middle Aggregation Engine */}
            <div className="lg:col-span-2 text-center flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-[11px] font-extrabold text-indigo-900 uppercase">
                AI Match Engine
              </div>
              <p className="text-[10px] text-slate-500">
                Cluster matching by farm proximity & harvest readiness
              </p>
            </div>

            {/* Matched Farmers Grid (Requirement 18: Farmer A, B, C, D) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Matched Supply Sources (Sangli Agricultural Belt)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Farmer A */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-slate-900">Farmer A (Ramesh Patil)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300">
                      500 kg
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">Miraj Shivar, Sangli</div>
                  <div className="text-xs font-black text-emerald-800 mt-2">Payout: ₹12,000</div>
                </div>

                {/* Farmer B */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-slate-900">Farmer B (Ankush Rao)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300">
                      400 kg
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">Tasgaon Valley, Sangli</div>
                  <div className="text-xs font-black text-emerald-800 mt-2">Payout: ₹9,600</div>
                </div>

                {/* Farmer C */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-slate-900">Farmer C (Pandurang Mane)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300">
                      600 kg
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">Palus Sugar & Vegetable Belt</div>
                  <div className="text-xs font-black text-emerald-800 mt-2">Payout: ₹14,400</div>
                </div>

                {/* Farmer D */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-slate-900">Farmer D (Tanaji Shinde)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300">
                      500 kg
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">Kavathe Mahankal, Sangli</div>
                  <div className="text-xs font-black text-emerald-800 mt-2">Payout: ₹12,000</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex justify-between font-black text-slate-900">
                <span>Total Combined Volume:</span>
                <span className="text-emerald-700">2,000 kg Matched Exactly</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CREATE BULK REQUIREMENT FORM (Requirement 17) */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-subtle max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-extrabold text-slate-900">
              Post Commercial Bulk Requirement
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify your volume and delivery deadline. Our algorithm will match local verified farmers and schedule collection hub grading.
            </p>
          </div>

          <form onSubmit={handlePostRequirement} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Tomato, Onion, Potato"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Quantity (kg) *</label>
                <input
                  type="number"
                  value={requiredQuantity}
                  onChange={(e) => setRequiredQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900"
                  required
                  min="100"
                />
              </div>

              {/* Required Date */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Delivery Date *</label>
                <input
                  type="text"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  placeholder="e.g. 28 Sept"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Maximum Budget */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Maximum Budget (₹/kg) *</label>
                <input
                  type="number"
                  value={maxBudgetPerKg}
                  onChange={(e) => setMaxBudgetPerKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold"
                  required
                />
              </div>

              {/* Delivery Location */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery Destination Location *</label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Kolhapur, Pune"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Quality Grade */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Quality Grade Specification *</label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="Grade A">Grade A (Uniform color, size, firm skin)</option>
                  <option value="Grade B">Grade B (Commercial bulk culinary standard)</option>
                  <option value="Grade C">Grade C (Industrial food processing / pulp)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kitchen & Quality Instructions</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Post Requirement & Auto-Match Local Farmers</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: ORDERS & DISPATCHES */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">
              Bulk Consignments & Invoices
            </h3>
            <span className="text-xs text-slate-400">Total volume contracted: 3,000 kg</span>
          </div>

          <div className="divide-y divide-slate-100">
            {hotelOrders.map(order => (
              <div key={order.id} className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">#{order.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {order.status}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 mt-1">
                    {order.items.map(i => `${i.cropName} (${i.quantity} kg)`).join(', ')}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Delivery: {order.deliveryAddress} • Vehicle: {order.assignedVehicleNumber || 'MH-10-AB-1234'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">₹{order.totalAmount.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{order.paymentStatus} via {order.paymentMethod}</div>
                  </div>

                  <button
                    onClick={() => onOpenTracking(order.id)}
                    className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Live</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
