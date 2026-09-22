import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Tractor, 
  Warehouse, 
  Truck, 
  Building2, 
  DollarSign, 
  Award, 
  Play, 
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuidedScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedScenarioModal: React.FC<GuidedScenarioModalProps> = ({ isOpen, onClose }) => {
  const { 
    demoScenarioStep, 
    setDemoScenarioStep, 
    advanceScenarioStep, 
    switchRole, 
    setActiveView 
  } = useApp();

  const steps = [
    {
      id: 0,
      title: 'Bulk Buyer Demand Initiated',
      subtitle: 'Hotel ABC posts contract requirement',
      actor: 'Chef Rajesh (Hotel ABC, Kolhapur)',
      role: 'bulk_buyer' as const,
      view: 'bulk-dashboard',
      badge: 'Demand Generation',
      summary: 'Hotel ABC requires 1,000 kg of Grade A Tomatoes for central commercial kitchens with maximum ceiling budget ₹25/kg delivered by 25 Sept.',
      metrics: { 'Required': '1,000 kg', 'Crop': 'Shivam Hybrid Tomato', 'Target Budget': '₹25/kg', 'Status': 'Open for Match' },
      nextActionText: 'Run AI Multi-Farmer Matching Algorithm'
    },
    {
      id: 1,
      title: 'AI Multi-Farmer Matching & Allocation',
      subtitle: 'Platform aggregates 4 smallholders in Sangli belt',
      actor: 'Farm2Market AI Matching Engine',
      role: 'admin' as const,
      view: 'admin-dashboard',
      badge: 'Aggregation',
      summary: 'Instead of rejecting small farmers who only have 200–300 kg, the algorithm clusters 4 adjacent farms in Miraj-Tasgaon to fulfill the single 1,000 kg order perfectly.',
      metrics: { 
        'Farmer A (Ramesh)': '300 kg', 
        'Farmer B (Ankush)': '250 kg', 
        'Farmer C (Pandurang)': '200 kg', 
        'Farmer D (Tanaji)': '250 kg' 
      },
      nextActionText: 'Schedule Farm-Gate Harvest'
    },
    {
      id: 2,
      title: 'Harvest Scheduled & Confirmed',
      subtitle: 'Farmers mark produce "Ready for Harvest"',
      actor: 'Farmer Ramesh Patil & Collective',
      role: 'farmer' as const,
      view: 'farmer-dashboard',
      badge: 'Farm-Gate',
      summary: 'Farmers receive order notification with guaranteed price of ₹24/kg. Ramesh Patil presses "Mark Ready for Harvest", generating digital batch QR tags for crates.',
      metrics: { 'Harvest Status': 'Ready for Pickup', 'Price Locked': '₹24/kg', 'Total Expected': '1,000 kg', 'Packaging': 'Crates Tagged' },
      nextActionText: 'Assign Logistics & Route Cluster'
    },
    {
      id: 3,
      title: 'Logistics Assigned & Farm-Gate Pickup',
      subtitle: 'Smart route pickup across 4 farms',
      actor: 'Driver Rahul Patil (Vehicle MH-10-AB-1234)',
      role: 'driver' as const,
      view: 'driver-dashboard',
      badge: 'Logistics',
      summary: 'Driver accepts cluster pickup route: Farm A → Farm C → Farm B → Farm D → Sangli Collection Hub (42 km, 900–1000 kg capacity utilization). Crates scanned at gate.',
      metrics: { 'Vehicle': 'MH-10-AB-1234 (1 Ton)', 'Load': '1,000 kg collected', 'Time': '1 hr 35 min', 'Status': 'In Transit to Hub' },
      nextActionText: 'Receive & Inspect at Collection Hub'
    },
    {
      id: 4,
      title: 'Collection Center QC & Weighing',
      subtitle: 'Digital weighing & Grade A verification',
      actor: 'Sangli Collection Center (Anand Deshmukh)',
      role: 'collection_center' as const,
      view: 'collection-dashboard',
      badge: 'Quality Control',
      summary: 'Produce arrives at partner hub. Crates weighed digitally (992 kg actual weight, 0.8% natural desiccation allowance). Quality inspector validates Grade A firmness & color.',
      metrics: { 'Expected Weight': '1,000 kg', 'Actual Weighed': '992 kg', 'Assigned Grade': 'Grade A', 'Status': 'Verified & Packed' },
      nextActionText: 'Dispatch Consolidated Truck to Hotel ABC'
    },
    {
      id: 5,
      title: 'Consolidated Bulk Dispatch',
      subtitle: 'Hub-to-Hotel express transit',
      actor: 'Logistics Partner Fleet (Sangli to Kolhapur)',
      role: 'driver' as const,
      view: 'driver-dashboard',
      badge: 'Dispatch',
      summary: 'Graded tomatoes packed into temperature-stabilized crates. Dispatched via express highway corridor to Hotel ABC delivery bay in Kolhapur.',
      metrics: { 'Distance': '48 km', 'Departure': '10:15 AM', 'ETA': '11:45 AM', 'Status': 'Out for Final Delivery' },
      nextActionText: 'Complete Delivery to Kitchen Bay'
    },
    {
      id: 6,
      title: 'Delivered to Hotel ABC',
      subtitle: 'Chef Rajesh inspects and accepts delivery',
      actor: 'Chef Rajesh (Hotel ABC, Kolhapur)',
      role: 'bulk_buyer' as const,
      view: 'bulk-dashboard',
      badge: 'Delivery Verified',
      summary: 'Hotel kitchen receives produce on time. Chef scans master QR code, inspects crate seals, and digitally signs confirmation on driver device.',
      metrics: { 'Received': '1,000 kg Tomato', 'Delivery Time': '11:40 AM', 'Sign-Off': 'Digitally Verified', 'Status': 'Delivered' },
      nextActionText: 'Execute Transparent Payment Settlement'
    },
    {
      id: 7,
      title: 'Transparent Payment Settlement',
      subtitle: 'Zero middleman deductions — instant payouts',
      actor: 'Automated Platform Payment Gateway',
      role: 'farmer' as const,
      view: 'farmer-dashboard',
      badge: 'Financial Settlement',
      summary: 'Total buyer transaction ₹28,000 settled transparently: Farmers receive ₹24,000 directly, Collection Hub ₹1,000, Transport ₹2,000, Platform service ₹1,000.',
      metrics: { 
        'Total Paid': '₹28,000', 
        'Farmers Share': '₹24,000 (85.7%)', 
        'Collection Partner': '₹1,000', 
        'Logistics Partner': '₹2,000' 
      },
      nextActionText: 'Scenario Completed!'
    }
  ];

  const current = steps[demoScenarioStep] || steps[0];

  const handleNextStep = () => {
    if (demoScenarioStep < steps.length - 1) {
      advanceScenarioStep();
    } else {
      // Trigger celebratory confetti on complete
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const jumpToStep = (index: number) => {
    setDemoScenarioStep(index);
  };

  const handleInspectInRoleView = () => {
    switchRole(current.role);
    setActiveView(current.view);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-forest to-forest-dark p-5 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Requirement 39 Showcase
              </span>
              <span className="text-xs text-emerald-200">2-Minute Evaluator Demonstration</span>
            </div>
            <h2 className="text-lg font-bold mt-1">
              Hotel ABC 1,000 kg Tomato: End-to-End Supply Chain Journey
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper progress indicator */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 overflow-x-auto shrink-0">
          <div className="flex items-center justify-between min-w-[650px] gap-2">
            {steps.map((s, idx) => {
              const isPast = idx < demoScenarioStep;
              const isCurr = idx === demoScenarioStep;
              return (
                <button
                  key={s.id}
                  onClick={() => jumpToStep(idx)}
                  className={`flex flex-col items-center flex-1 text-center transition-all ${
                    isCurr ? 'scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurr
                        ? 'bg-amber-500 text-white ring-4 ring-amber-200 shadow-sm'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] font-semibold truncate max-w-[80px] ${
                    isCurr ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}>
                    {s.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Step Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Stage {demoScenarioStep + 1} of {steps.length}: {current.badge}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                {current.title}
              </h3>
              <p className="text-sm text-slate-500">{current.subtitle}</p>
            </div>

            <button
              onClick={handleInspectInRoleView}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-semibold text-xs border border-emerald-300 transition-colors shadow-xs"
            >
              <span>Live Inspect in {current.role.replace('_', ' ').toUpperCase()} Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
            <div className="text-xs font-semibold text-emerald-900 uppercase tracking-wide mb-1">
              Active Actor / Coordinator:
            </div>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              {current.actor}
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {current.summary}
            </p>
          </div>

          {/* Metrics Grid */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Live Stage Data & Financial Tracking
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(current.metrics).map(([key, val]) => (
                <div key={key} className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <div className="text-[11px] text-slate-400 font-medium truncate">{key}</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Supply Chain Pathway Ribbon */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Platform Journey Timeline
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium overflow-x-auto py-1">
              <span className={demoScenarioStep >= 0 ? 'text-emerald-700 font-bold' : ''}>Requirement</span>
              <span>→</span>
              <span className={demoScenarioStep >= 1 ? 'text-emerald-700 font-bold' : ''}>AI Match (4 Farmers)</span>
              <span>→</span>
              <span className={demoScenarioStep >= 2 ? 'text-emerald-700 font-bold' : ''}>Harvest Trigger</span>
              <span>→</span>
              <span className={demoScenarioStep >= 3 ? 'text-emerald-700 font-bold' : ''}>Farm Pickup</span>
              <span>→</span>
              <span className={demoScenarioStep >= 4 ? 'text-emerald-700 font-bold' : ''}>Hub QC</span>
              <span>→</span>
              <span className={demoScenarioStep >= 5 ? 'text-emerald-700 font-bold' : ''}>Transit</span>
              <span>→</span>
              <span className={demoScenarioStep >= 6 ? 'text-emerald-700 font-bold' : ''}>Delivered</span>
              <span>→</span>
              <span className={demoScenarioStep >= 7 ? 'text-emerald-700 font-bold' : ''}>Payout (₹24k)</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
          <button
            onClick={() => setDemoScenarioStep(0)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-2 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Journey
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDemoScenarioStep(Math.max(0, demoScenarioStep - 1))}
              disabled={demoScenarioStep === 0}
              className="text-xs px-3.5 py-2 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-white disabled:opacity-30 transition-colors"
            >
              Previous
            </button>

            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 text-xs px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-forest hover:from-emerald-700 hover:to-forest-dark text-white font-bold rounded-xl shadow-md transition-transform active:scale-95"
            >
              <span>{current.nextActionText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
