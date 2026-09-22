import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Star,
  MapPin
} from 'lucide-react';

interface ConsumerDashboardProps {
  onTrackOrder: (orderId: string) => void;
  onOpenComplaint: (orderId: string) => void;
}

export const ConsumerDashboard: React.FC<ConsumerDashboardProps> = ({ onTrackOrder, onOpenComplaint }) => {
  const { currentUser, orders, produceListings, setActiveView, addToCart } = useApp();

  const userOrders = orders.filter(o => o.buyerType === 'consumer' || o.buyerId === currentUser.id);

  const activeOrdersCount = userOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Payment completed').length;
  const deliveredOrdersCount = userOrders.filter(o => o.status === 'Delivered' || o.status === 'Payment completed').length;
  const totalSpending = userOrders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-teal-700/60 border border-teal-500/30 text-teal-200 text-xs font-semibold">
            Consumer Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-teal-100 text-xs mt-1">
            Deliveries routed directly from Sangli-Satara farms to your doorstep in Pune.
          </p>
        </div>
        <button
          onClick={() => setActiveView('marketplace')}
          className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-teal-900 font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop Fresh Farm Produce</span>
        </button>
      </div>

      {/* KPI Cards (Requirement 13) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Active Orders</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Package className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{activeOrdersCount}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">In harvest or delivery route</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Delivered Orders</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{deliveredOrdersCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% verified quality</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Pending Delivery</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600"><Clock className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{activeOrdersCount}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Expected today evening</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Total Spending</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600"><DollarSign className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹{totalSpending.toLocaleString()}</div>
          <div className="text-[11px] text-teal-700 font-semibold mt-1">~85% straight to farmers</div>
        </div>
      </div>

      {/* Active Orders List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              My Orders & Live Dispatches
            </h3>
            <p className="text-xs text-slate-500">
              Track farm-gate harvest, collection center grading, and driver transit status.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">{userOrders.length} order(s) found</span>
        </div>

        <div className="divide-y divide-slate-100">
          {userOrders.map(order => (
            <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">#{order.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">
                    {order.items.map(i => `${i.cropName} (${i.quantity} kg)`).join(' + ')}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>Slot: {order.deliverySlot}</span>
                    <span>•</span>
                    <span>Total: ₹{order.totalAmount} ({order.paymentMethod})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onOpenComplaint(order.id)}
                  className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-colors"
                >
                  Report Issue
                </button>
                <button
                  onClick={() => onTrackOrder(order.id)}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Track Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Fresh Produce (Requirement 13) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">
            Recommended Harvests For You
          </h3>
          <button
            onClick={() => setActiveView('marketplace')}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Browse All Marketplace
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {produceListings.slice(1, 4).map(item => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle hover:border-emerald-300 transition-all flex items-center gap-3"
            >
              <img
                src={item.imageUrl}
                alt={item.cropName}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 text-xs truncate">{item.cropName}</div>
                <div className="text-[11px] text-slate-500">{item.variety}</div>
                <div className="text-xs font-black text-emerald-800 mt-1">₹{item.farmerPrice + 4}/kg delivered</div>
              </div>
              <button
                onClick={() => addToCart(item, 2)}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors"
                title="Quick Add 2kg"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
