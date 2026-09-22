import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Info, 
  Building2, 
  Truck, 
  ShieldCheck, 
  Download,
  Calendar
} from 'lucide-react';

export const FarmerEarnings: React.FC = () => {
  const { orders, currentUser } = useApp();

  // Highlight transaction from Requirement 27:
  // Customer paid ₹28,000; Farmer: ₹24,000; Collection: ₹1,000; Transport: ₹2,000; Platform: ₹1,000
  const breakdownData = [
    { name: 'Farmer Share (Direct)', value: 24000, color: '#15803d' },
    { name: 'Collection & QC Hub', value: 1000, color: '#d97706' },
    { name: 'Transport & Cold-Chain', value: 2000, color: '#2563eb' },
    { name: 'Platform Coordination', value: 1000, color: '#64748b' },
  ];

  const transactions = [
    {
      id: 'TXN-8841',
      orderId: 'FM1025',
      buyer: 'Hotel ABC (Chef Rajesh)',
      crop: 'Tomato (1,000 kg lot share)',
      grossPaidByBuyer: 28000,
      farmerPayout: 7200, // Farmer A share (300kg)
      collectionFee: 300,
      logisticsFee: 600,
      platformFee: 300,
      status: 'Paid',
      date: '21 Sept 2026',
      method: 'Direct Bank Transfer (IMPS)'
    },
    {
      id: 'TXN-8840',
      orderId: 'FM1024',
      buyer: 'Pooja Kulkarni (Retail)',
      crop: 'Tomato (5 kg pack)',
      grossPaidByBuyer: 140,
      farmerPayout: 120,
      collectionFee: 5,
      logisticsFee: 10,
      platformFee: 5,
      status: 'Paid',
      date: '21 Sept 2026',
      method: 'UPI Escrow Settlement'
    },
    {
      id: 'TXN-8835',
      orderId: 'FM1019',
      buyer: 'Green Valley Organic Supermarket',
      crop: 'Grand Naine Banana (400 kg)',
      grossPaidByBuyer: 12800,
      farmerPayout: 11200,
      collectionFee: 400,
      logisticsFee: 800,
      platformFee: 400,
      status: 'Processing',
      date: '19 Sept 2026',
      method: 'NEFT Escrow Release'
    },
    {
      id: 'TXN-8829',
      orderId: 'FM1012',
      buyer: 'Pune Fresh Basket',
      crop: 'Waigaon Turmeric (50 kg)',
      grossPaidByBuyer: 6250,
      farmerPayout: 5750,
      collectionFee: 150,
      logisticsFee: 200,
      platformFee: 150,
      status: 'Paid',
      date: '15 Sept 2026',
      method: 'Direct Bank Transfer'
    }
  ];

  const totalPaid = transactions.filter(t => t.status === 'Paid').reduce((acc, t) => acc + t.farmerPayout, 0);
  const totalProcessing = transactions.filter(t => t.status === 'Processing').reduce((acc, t) => acc + t.farmerPayout, 0);
  const totalPending = 3600; // upcoming harvest allocations

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-forest p-6 sm:p-8 rounded-3xl text-white shadow-elevated">
        <span className="px-2.5 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
          Transparent Financial Settlement
        </span>
        <h1 className="text-3xl sm:text-4xl font-black mt-2">
          Farmer Earnings & Payout Ledger
        </h1>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
          Zero arbitrary deductions. View transparent breakdown of buyer payments into your bank account, verified against collection center scale logs.
        </p>
      </div>

      {/* Payout Status KPI Cards (Requirement 30: Pending, Processing, Paid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Paid & Credited</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">₹{totalPaid.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Directly received in Bank A/C</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Processing in Escrow</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Clock className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-blue-700 mt-2">₹{totalProcessing.toLocaleString()}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Transit QC verified; clearing today</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold text-slate-500">Upcoming Allocations</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">₹{totalPending.toLocaleString()}</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Upcoming harvest contracts</div>
        </div>
      </div>

      {/* Requirement 27 Featured Breakdown Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Requirement 27 Cost Model
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              Sample Transaction Breakdown: ₹28,000 Order (Hotel ABC)
            </h3>
            <p className="text-xs text-slate-500">
              Demonstrates exact distribution of customer funds without middleman commission skimming.
            </p>
          </div>

          <button
            onClick={() => alert('Exporting transparent settlement certificate PDF...')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Statement</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Pie Chart Representation */}
          <div className="lg:col-span-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => `₹${val.toLocaleString()}`} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Itemized Table Breakdown */}
          <div className="lg:col-span-6 space-y-3 text-xs">
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-emerald-950 block">1. Farmer Share (Direct Payout)</span>
                <span className="text-[11px] text-emerald-800">85.7% of total transaction</span>
              </div>
              <span className="text-base font-black text-emerald-800">₹24,000</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-800 block">2. Collection Center & Handling</span>
                <span className="text-[11px] text-slate-500">Weighing, grading, crates & sorting</span>
              </div>
              <span className="font-bold text-slate-900">₹1,000</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-800 block">3. Transport & Cold-Chain Delivery</span>
                <span className="text-[11px] text-slate-500">Farm-gate collection to buyer doorstep</span>
              </div>
              <span className="font-bold text-slate-900">₹2,000</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-semibold text-slate-800 block">4. Platform Service & AI Matching</span>
                <span className="text-[11px] text-slate-500">Escrow security & quality assurance</span>
              </div>
              <span className="font-bold text-slate-900">₹1,000</span>
            </div>

            <div className="p-3 bg-slate-900 text-white rounded-xl flex justify-between items-center font-black text-sm">
              <span>Total Customer Transaction Paid:</span>
              <span>₹28,000</span>
            </div>
          </div>
        </div>

        {/* Mandatory Requirement 27 Disclaimer Note */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>*These are example figures for prototype demonstration; actual transport and handling charges vary dynamically based on route distance and lot volume.</span>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">
          Recent Payout Transaction Records
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Txn ID</th>
                <th className="py-3 px-3">Order / Buyer</th>
                <th className="py-3 px-3">Crop / Lot</th>
                <th className="py-3 px-3">Gross Value</th>
                <th className="py-3 px-3">Your Net Share</th>
                <th className="py-3 px-3">Settlement Status</th>
                <th className="py-3 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">{t.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    <div>{t.buyer}</div>
                    <span className="text-[10px] text-slate-400">Order #{t.orderId}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{t.crop}</td>
                  <td className="py-3 px-3 text-slate-500">₹{t.grossPaidByBuyer.toLocaleString()}</td>
                  <td className="py-3 px-3 font-extrabold text-emerald-700">₹{t.farmerPayout.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      t.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
