import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  ArrowRight, 
  Sparkles, 
  Tractor, 
  Warehouse, 
  Truck, 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  AlertTriangle,
  Play,
  Eye,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onOpenGuidedScenario: () => void;
  onOpenDemoAccounts: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onOpenGuidedScenario, 
  onOpenDemoAccounts 
}) => {
  const { setActiveView, switchRole, produceListings } = useApp();
  const [activePipelineStep, setActivePipelineStep] = useState(0);

  const pipelineSteps = [
    { 
      title: 'Farmer / FPO', 
      desc: 'Lists harvest with expected yield & quality grade.', 
      icon: <Tractor className="w-5 h-5 text-emerald-600" />,
      time: 'Day 0',
      badge: 'Farm-Gate Harvest'
    },
    { 
      title: 'Collection Hub', 
      desc: 'Partner center aggregates, weighs, inspects & grades.', 
      icon: <Warehouse className="w-5 h-5 text-amber-600" />,
      time: 'Day 1 (08:00 AM)',
      badge: 'Digital QC & Weighing'
    },
    { 
      title: 'Smart Transport', 
      desc: 'Multi-stop cluster route optimization with capacity matching.', 
      icon: <Truck className="w-5 h-5 text-blue-600" />,
      time: 'Day 1 (11:00 AM)',
      badge: 'Cold/Fast Logistics'
    },
    { 
      title: 'Buyer / Consumer', 
      desc: 'Fresh produce delivered to kitchen or doorstep. Instant escrow release.', 
      icon: <Users className="w-5 h-5 text-teal-600" />,
      time: 'Day 1 (05:00 PM)',
      badge: 'Direct Value Realized'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION (Requirement 4) */}
      <section className="relative pt-8 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-emerald-100/60 via-green-50 to-teal-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto">
          {/* Hackathon / Competition Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI-Powered Farm-to-Buyer Supply Chain Coordination Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-forest tracking-tight leading-[1.15]">
            From Farm to You. <br />
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 bg-clip-text text-transparent">
              Smarter, Faster, Fairer.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            An AI-powered agricultural marketplace connecting farmers directly with consumers and bulk buyers while coordinating harvesting, collection, logistics and delivery.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveView('marketplace')}
              className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Sprout className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </button>

            <button
              onClick={() => {
                switchRole('farmer');
                setActiveView('farmer-dashboard');
              }}
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold text-sm transition-all hover:border-emerald-300 shadow-xs flex items-center gap-1.5"
            >
              <Tractor className="w-4 h-4 text-emerald-600" />
              <span>Join as Farmer</span>
            </button>

            <button
              onClick={() => {
                switchRole('bulk_buyer');
                setActiveView('bulk-dashboard');
              }}
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-sm transition-all shadow-xs flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Become a Buyer</span>
            </button>

            {/* Launch Demo Prominent Button */}
            <button
              onClick={onOpenGuidedScenario}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-105 text-slate-950 font-extrabold text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Launch Demo Scenario</span>
            </button>
          </div>
        </div>

        {/* HERO ANIMATED SUPPLY-CHAIN VISUALIZATION (Requirement 4) */}
        <div className="mt-14 max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-elevated p-6 sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Supply-Chain Pipeline
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Coordinating Agricultural Transit in Real-Time
              </h3>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
              Hover or click steps to inspect
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {pipelineSteps.map((step, idx) => {
              const isSelected = activePipelineStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActivePipelineStep(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-100">
                      {step.icon}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                      {step.time}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                    {step.badge}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Connected Flow Arrow Indicator */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-emerald-800">
              Active Stage: {pipelineSteps[activePipelineStep].badge}
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-700 font-bold">
              <span>Farmer</span>
              <span>→</span>
              <span>Collection Center</span>
              <span>→</span>
              <span>Smart Logistics</span>
              <span>→</span>
              <span>Customer</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM VS SOLUTION SECTION (Requirement 5) */}
      <section className="bg-slate-50/80 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
              The Supply-Chain Bottleneck
            </span>
            <h2 className="text-3xl font-extrabold text-forest mt-3">
              Why Traditional Mandi Distribution Fails Both Farmers & Buyers
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Between the harvest field and the consumer dining table, 4 to 6 tiers of speculative middlemen erode value and cause massive perishable waste.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* The Traditional Problem Chain */}
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-red-100 mb-4">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span>Traditional Multi-Intermediary Supply Chain</span>
                  </div>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    6 Inefficient Tiers
                  </span>
                </div>

                {/* Broken Chain Flow */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 py-3 text-xs font-bold text-slate-700 bg-red-50/40 rounded-xl p-2.5 border border-red-100 mb-6">
                  <span className="px-2 py-1 bg-white rounded border border-slate-200">Farmer</span>
                  <span>↓</span>
                  <span className="px-2 py-1 bg-white rounded border border-slate-200">Village Trader</span>
                  <span>↓</span>
                  <span className="px-2 py-1 bg-white rounded border border-slate-200">APMC Wholesaler</span>
                  <span>↓</span>
                  <span className="px-2 py-1 bg-white rounded border border-slate-200">Distributor</span>
                  <span>↓</span>
                  <span className="px-2 py-1 bg-white rounded border border-slate-200">Retailer</span>
                  <span>↓</span>
                  <span className="px-2 py-1 bg-white rounded border border-slate-200">Consumer</span>
                </div>

                {/* Problems highlighted (Requirement 5) */}
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Multiple Intermediaries:</strong> Each tier adds 15–25% speculative markup without adding physical value to produce.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Farmer Receives Smaller Share:</strong> Farmers typically capture only ₹12–₹15 out of every ₹40 retail rupee paid by consumers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Consumer Pays Excessive Margins:</strong> Inflated final prices for stale, 3-day-old market produce.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Produce Wastage & Spoilage:</strong> Lack of cold-chain handling results in 30–35% post-harvest perishable degradation.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>No Demand Visibility & Price Uncertainty:</strong> Farmers harvest blindly without forward demand contracts, leading to gluts and distress sales.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-red-100 text-xs text-red-700 font-semibold text-center">
                High Wastage • Unfair Farmer Realization • 48+ Hour Transit Delays
              </div>
            </div>

            {/* Farm2Market AI Streamlined Coordination */}
            <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-md p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-100 rounded-full blur-xl -z-0" />

              <div className="relative z-10">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Farm2Market AI: Intelligent Supply Coordination</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    2 Streamlined Stages
                  </span>
                </div>

                {/* Clean 2-Tier Pipeline Flow */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 py-3 text-xs font-bold text-emerald-950 bg-emerald-50 rounded-xl p-2.5 border border-emerald-200 mb-6">
                  <span className="px-2.5 py-1 bg-white text-emerald-900 rounded-lg shadow-xs border border-emerald-200">Farmer / FPO</span>
                  <span>↓</span>
                  <span className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg shadow-xs">Farm2Market AI Platform</span>
                  <span>↓</span>
                  <span className="px-2.5 py-1 bg-white text-emerald-900 rounded-lg shadow-xs border border-emerald-200">Partner Collection Hub</span>
                  <span>↓</span>
                  <span className="px-2.5 py-1 bg-white text-emerald-900 rounded-lg shadow-xs border border-emerald-200">Optimized Logistics</span>
                  <span>↓</span>
                  <span className="px-2.5 py-1 bg-white text-emerald-900 rounded-lg shadow-xs border border-emerald-200">Consumer / Bulk Buyer</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <span><strong>Up to 85% Farmer Value Share:</strong> Transparent breakdown ensures ₹24/kg directly reaches the farmer for ₹28/kg retail produce.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <span><strong>Forward AI Demand Visibility:</strong> 7-day and 30-day forecast curves inform farmers what crops to harvest before cutting.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <span><strong>Zero Farm Transportation Burden:</strong> Doorstep farm-gate pickup scheduled directly through local partner drivers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <span><strong>Standardized QC & Certified Grading:</strong> Verified weight & digital Grade A/B/C assignment eliminates false mandi deductions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <span><strong>12–14 Hour Harvest-to-Plate Speed:</strong> Dramatic reduction in produce wastage down to less than 4%.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-100 text-xs text-emerald-800 font-bold text-center relative z-10">
                Transparent Pricing • Farm-Gate Pickup • Direct Buyer Match
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOLUTION SECTION: 7 VALUE PROPOSITION CARDS (Requirement 6) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-forest mt-3">
            7 Pillars of End-to-End Supply Coordination
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every step from pre-harvest demand forecast to farm-gate aggregation and automated payment escrow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Direct Marketplace */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-card transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              1. Direct Marketplace
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Farmers and FPOs list upcoming or harvested produce directly with transparent specs, photos, variety, quality grade, and expected ready dates.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700">
              <span>Direct Listing • Zero Middleman Margins</span>
            </div>
          </div>

          {/* Card 2: AI Demand Forecasting */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-card transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              2. AI Demand Forecasting
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Predicts upcoming demand over 7-day and 30-day horizons using seasonal patterns, historical sales data, and commercial forward orders.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-700">
              <span>Deficit Alerts • Seasonal Trends</span>
            </div>
          </div>

          {/* Card 3: Smart Price Recommendation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-card transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              3. Smart Price Recommendation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Suggests fair reference price corridors (e.g. ₹22–₹26/kg) based on quality, market APMC rates, logistics, and local supply. Farmers retain full price autonomy.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-amber-700">
              <span>AI Advisory • 100% Farmer Price Freedom</span>
            </div>
          </div>

          {/* Card 4: Farm-Gate Pickup */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-card transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              4. Farm-Gate Pickup
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Farmers don't need to rent vehicles or travel to crowded mandis. Partner drivers arrive directly at the farm gate to collect tagged crates.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-700">
              <span>Doorstep Pickup • Crate Barcode Verification</span>
            </div>
          </div>

          {/* Card 5: Partner Collection Centers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-card transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Warehouse className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              5. Partner Collection Centers
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Decentralized partner hubs aggregate smallholder volumes, verify digital scale weights, perform quality inspection (Grade A/B/C), and pack.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-800">
              <span>Transparent Weighing • Standardized Grading</span>
            </div>
          </div>

          {/* Card 6: Smart Logistics */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-card transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              6. Smart Logistics
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dynamic multi-stop route optimization matches vehicle weight capacity with nearby farm clusters to minimize fuel burn and avoid empty return trips.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-700">
              <span>Optimized Routes • Capacity Utilization</span>
            </div>
          </div>

          {/* Card 7: Transparent Payments (Span 3 on desktop or centered) */}
          <div className="bg-gradient-to-br from-emerald-900 to-forest p-6 rounded-2xl text-white shadow-card md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>7. Transparent Payments & Escrow Settlement</span>
              </div>
              <h3 className="text-xl font-bold">
                Clear Cost Breakdown on Every Kilogram
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero hidden commissions. Every transaction shows the exact split: Farmer realization (₹24/kg) + Collection center handling (₹1/kg) + Logistics partner (₹2/kg) + Platform fee (₹1/kg).
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shrink-0 w-full sm:w-auto">
              <div className="text-2xl font-black text-amber-300">₹24 / ₹28</div>
              <div className="text-[11px] text-emerald-200 mt-0.5">85.7% Directly to Farmer</div>
              <div className="text-[9px] text-slate-400 mt-1">Simulated Example for Tomato</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "SEE THE IMPACT" SECTION (Requirement 40) */}
      <section className="bg-gradient-to-b from-emerald-50/60 to-white py-16 px-4 sm:px-6 lg:px-8 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-md border border-emerald-300">
              Simulated Field Performance
            </span>
            <h2 className="text-3xl font-extrabold text-forest mt-3">
              See the Impact
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Based on supply chain model simulations benchmarked against traditional regional wholesale channels.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm text-center">
              <div className="text-3xl sm:text-4xl font-black text-emerald-700">+22%</div>
              <div className="text-xs font-bold text-slate-800 mt-1">Farmer Price Realization</div>
              <div className="text-[11px] text-slate-500 mt-1">Higher net return per kg harvested</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm text-center">
              <div className="text-3xl sm:text-4xl font-black text-emerald-700">6 → 2</div>
              <div className="text-xs font-bold text-slate-800 mt-1">Supply-Chain Stages</div>
              <div className="text-[11px] text-slate-500 mt-1">Reduced intermediaries and handoffs</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm text-center">
              <div className="text-3xl sm:text-4xl font-black text-blue-700">-38%</div>
              <div className="text-xs font-bold text-slate-800 mt-1">Average Delivery Distance</div>
              <div className="text-[11px] text-slate-500 mt-1">Through cluster routing & local hubs</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm text-center">
              <div className="text-3xl sm:text-4xl font-black text-amber-600">-34%</div>
              <div className="text-xs font-bold text-slate-800 mt-1">Produce Wastage</div>
              <div className="text-[11px] text-slate-500 mt-1">From 32% down to less than 4% spoilage</div>
            </div>
          </div>

          {/* Explicit Requirement 40 Compliance Label */}
          <div className="mt-6 text-center">
            <span className="inline-block px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[11px] border border-slate-200">
              *Prototype simulation metrics benchmarked for hackathon demonstration rather than guaranteed real measured results.
            </span>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Live Harvest Catalog
            </span>
            <h3 className="text-2xl font-black text-forest mt-1">
              Fresh From Local Farms (Maharashtra Pilot Belt)
            </h3>
            <p className="text-xs text-slate-500">
              Produce certified for quality grade and scheduled for farm-gate collection.
            </p>
          </div>
          <button
            onClick={() => setActiveView('marketplace')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>View All {produceListings.length} Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {produceListings.slice(0, 4).map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.cropName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-emerald-900 shadow-xs backdrop-blur-xs">
                      {item.qualityGrade}
                    </span>
                    {item.organic && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                        Organic
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-medium backdrop-blur-xs">
                    {item.location}
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-base font-bold text-slate-900">{item.cropName}</h4>
                  <div className="text-xs text-slate-500 mt-0.5">{item.variety}</div>
                  <div className="text-xs text-emerald-700 font-semibold mt-1">
                    By {item.farmerName} {item.fpoName ? `(${item.fpoName})` : ''}
                  </div>

                  <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400">Farmer Price:</span>
                      <div className="text-base font-extrabold text-slate-900">
                        ₹{item.farmerPrice}<span className="text-xs font-normal text-slate-500">/{item.unit}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400">Available:</span>
                      <div className="text-xs font-bold text-slate-700">{item.availableQuantity} {item.unit}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => setActiveView('marketplace')}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Price Breakdown</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
