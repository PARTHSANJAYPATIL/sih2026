import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  Truck, 
  Warehouse, 
  DollarSign, 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Filter, 
  Scale, 
  Award,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { complaints, resolveComplaint, orders, produceListings } = useApp();
  const [timeFilter, setTimeFilter] = useState<'Today' | '7 Days' | '30 Days' | '3 Months'>('7 Days');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'disputes' | 'stakeholders'>('overview');

  // Chart datasets adjusted for time filters
  const ordersVolumeData = [
    { day: 'Mon', orders: 412, revenue: 115000, farmerPayout: 98500 },
    { day: 'Tue', orders: 440, revenue: 122000, farmerPayout: 104500 },
    { day: 'Wed', orders: 465, revenue: 131000, farmerPayout: 112000 },
    { day: 'Thu', orders: 450, revenue: 128000, farmerPayout: 109000 },
    { day: 'Fri', orders: 490, revenue: 142000, farmerPayout: 121500 },
    { day: 'Sat', orders: 510, revenue: 155000, farmerPayout: 133000 },
    { day: 'Sun', orders: 482, revenue: 138000, farmerPayout: 118000 },
  ];

  const cropDemandData = [
    { crop: 'Tomato', demand: 12500, supply: 10000 },
    { crop: 'Onion', demand: 18000, supply: 17200 },
    { crop: 'Potato', demand: 9500, supply: 9800 },
    { crop: 'Wheat', demand: 25000, supply: 24000 },
    { crop: 'Rice', demand: 14000, supply: 13500 },
    { crop: 'Grapes', demand: 8500, supply: 7200 },
  ];

  const handleResolve = (complaintId: string) => {
    const res = prompt('Enter resolution note for this dispute:', 'Quality discrepancy verified by Hub Manager. Replacement voucher of ₹100 credited.');
    if (res) {
      resolveComplaint(complaintId, res);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-forest-dark to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Platform Governance & Oversight
            </span>
            <span className="text-xs text-slate-400">HQ Master Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Admin Management Console
          </h1>
          <p className="text-slate-300 text-xs mt-1">
            Real-time telemetry monitoring 18 partner collection centers and 94 fleet vehicles across Maharashtra.
          </p>
        </div>

        {/* Date Filter Tabs (Requirement 26) */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 text-xs">
          <span className="text-slate-400 px-2 font-medium hidden sm:inline">Timeframe:</span>
          {(['Today', '7 Days', '30 Days', '3 Months'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                timeFilter === tf
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 7 Core Dashboard Statistics (Requirement 25 Exact Figures) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* 1. Total farmers: 1,245 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Farmers</span>
          <div className="text-2xl font-black text-slate-900 mt-1">1,245</div>
          <span className="text-[10px] text-emerald-700 font-semibold">14 FPO collectives</span>
        </div>

        {/* 2. Active buyers: 326 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] text-slate-400 font-semibold block">Active Buyers</span>
          <div className="text-2xl font-black text-slate-900 mt-1">326</div>
          <span className="text-[10px] text-indigo-700 font-semibold">Hotels & Retailers</span>
        </div>

        {/* 3. Today's orders: 482 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] text-slate-400 font-semibold block">Today's Orders</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">482</div>
          <span className="text-[10px] text-emerald-600 font-semibold">+14% vs yesterday</span>
        </div>

        {/* 4. Produce moved: 18.4 tonnes */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] text-slate-400 font-semibold block">Produce Moved</span>
          <div className="text-2xl font-black text-blue-700 mt-1">18.4 T</div>
          <span className="text-[10px] text-blue-600 font-semibold">Tonnes in transit</span>
        </div>

        {/* 5. Active deliveries: 76 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] text-slate-400 font-semibold block">Active Deliveries</span>
          <div className="text-2xl font-black text-amber-600 mt-1">76</div>
          <span className="text-[10px] text-amber-600 font-semibold">On-road right now</span>
        </div>

        {/* 6. Collection centers: 18 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] text-slate-400 font-semibold block">Collection Hubs</span>
          <div className="text-2xl font-black text-slate-900 mt-1">18</div>
          <span className="text-[10px] text-slate-500 font-semibold">Partner certified</span>
        </div>

        {/* 7. Registered vehicles: 94 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <span className="text-[11px] text-slate-400 font-semibold block">Partner Vehicles</span>
          <div className="text-2xl font-black text-slate-900 mt-1">94</div>
          <span className="text-[10px] text-slate-500 font-semibold">GPS active fleet</span>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2 no-scrollbar text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Analytics & Charts ({timeFilter})
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'disputes' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dispute & Quality Complaints ({complaints.length})
        </button>
        <button
          onClick={() => setActiveTab('stakeholders')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'stakeholders' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Verified Stakeholder Directory
        </button>
      </div>

      {/* TAB 1: CHARTS & TELEMETRY (Requirement 26) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Daily Orders & Revenue Volume Chart */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Daily Order Volume & Gross Platform Flow ({timeFilter})
                </h3>
                <p className="text-xs text-slate-500">
                  Tracking daily orders vs direct farmer payouts
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                ₹831,000 Volume
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="orders" name="Daily Orders" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="farmerPayout" name="Farmer Payouts (₹/10)" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Supply vs Demand by Crop */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Supply vs Demand (kg)
              </h3>
              <p className="text-xs text-slate-500">
                Identifying cluster commodity shortfalls
              </p>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropDemandData} layout="vertical">
                  <CartesianGrid strokeDasharray="2 2" stroke="#f8fafc" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="crop" type="category" tick={{ fontSize: 10 }} width={60} />
                  <Tooltip />
                  <Bar dataKey="demand" name="Demand (kg)" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="supply" name="Supply (kg)" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transportation Performance & Hub Utilization (Requirement 26) */}
          <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle">
              <div className="text-slate-400 font-semibold">Average Transportation Distance</div>
              <div className="text-2xl font-black text-slate-900 mt-1">42.4 km</div>
              <div className="text-emerald-700 font-semibold mt-1">-38% reduction vs mandi routes</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle">
              <div className="text-slate-400 font-semibold">Collection-Center Utilization</div>
              <div className="text-2xl font-black text-blue-700 mt-1">78.2% Avg</div>
              <div className="text-slate-500 mt-1">Peak intake: 07:00 AM – 11:30 AM</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-subtle">
              <div className="text-slate-400 font-semibold">On-Time Delivery SLA</div>
              <div className="text-2xl font-black text-emerald-800 mt-1">98.6%</div>
              <div className="text-emerald-700 font-semibold mt-1">Under 2-hour delivery slot target</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISPUTES & QUALITY ISSUE RESOLUTION (Requirement 32) */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Customer & Quality Dispute Cases
              </h3>
              <p className="text-xs text-slate-500">
                Review complaints, inspect collection hub intake slips, and issue escrow resolution.
              </p>
            </div>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
              {complaints.filter(c => c.status !== 'Resolved').length} Open Case(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Ticket ID</th>
                  <th className="py-3 px-3">Order Ref</th>
                  <th className="py-3 px-3">Reporter</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{comp.id}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">#{comp.orderId}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{comp.reporterName}</div>
                      <span className="text-[10px] text-slate-400">{comp.reporterRole}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-red-600">{comp.category}</td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs">{comp.description}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        comp.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {comp.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {comp.status !== 'Resolved' ? (
                        <button
                          onClick={() => handleResolve(comp.id)}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-[11px] shadow-xs"
                        >
                          Resolve Case
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Resolved: {comp.resolutionNotes}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STAKEHOLDER DIRECTORY (Requirement 31) */}
      {activeTab === 'stakeholders' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-subtle space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Farmer & FPO Registry</span>
            </div>
            <p className="text-xs text-slate-600">
              1,245 smallholders enrolled across Sangli, Kolhapur, Satara, Pune and Nashik with 100% digital KYC and bank escrow authorization.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-subtle space-y-3">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Partner Transporters</span>
            </div>
            <p className="text-xs text-slate-600">
              94 registered vehicles with GPS tracking, tare weight calibration, and cold-chain compliance.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-subtle space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <Warehouse className="w-4 h-4 text-amber-600" />
              <span>Collection Centers</span>
            </div>
            <p className="text-xs text-slate-600">
              18 partner intake hubs equipped with precision digital weighing bridges, certified quality inspectors, and cold pre-coolers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
