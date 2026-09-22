import React from 'react';
import { Sprout, ShieldCheck, HeartHandshake, Truck, MapPin, Mail, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView, switchRole } = useApp();

  return (
    <footer className="bg-forest-dark text-slate-300 border-t border-emerald-900/50 mt-16 text-xs">
      {/* Top Value Ribbon */}
      <div className="bg-gradient-to-r from-emerald-950 via-forest to-emerald-950 py-4 border-b border-emerald-800/40 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold mx-auto sm:mx-0">
            <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Core Mission: "We don't simply sell agricultural products online. We coordinate the complete journey from harvest to buyer."</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 mx-auto sm:mx-0">
            Predict → Price → Match → Harvest → Pickup → Aggregate → QC → Deliver → Pay
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Farm2Market AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Connecting farms with markets through intelligent supply-chain coordination. Eliminating unnecessary intermediaries to ensure transparent, fair prices for farmers and fresh produce for consumers.
            </p>
            <div className="flex items-center gap-3 text-emerald-400 text-xs font-semibold pt-1">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> ISO/QCI Aligned</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Partner Logistics</span>
              <span>•</span>
              <span className="flex items-center gap-1"><HeartHandshake className="w-3.5 h-3.5" /> 100% Payout Escrow</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Platform Navigation
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setActiveView('landing')} className="hover:text-emerald-400 transition-colors">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('marketplace')} className="hover:text-emerald-400 transition-colors">
                  Live Produce Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('demand-forecast')} className="hover:text-emerald-400 transition-colors">
                  AI Demand Forecasting
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('price-insights')} className="hover:text-emerald-400 transition-colors">
                  Smart Pricing Model
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('delivery-tracking')} className="hover:text-emerald-400 transition-colors">
                  Order Journey Tracking (#FM1024)
                </button>
              </li>
            </ul>
          </div>

          {/* Stakeholder Portals */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Stakeholder Portals
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => { switchRole('farmer'); setActiveView('farmer-dashboard'); }} className="hover:text-emerald-400 transition-colors text-left">
                  Farmer / FPO Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => { switchRole('consumer'); setActiveView('consumer-dashboard'); }} className="hover:text-emerald-400 transition-colors text-left">
                  Retail Consumer Portal
                </button>
              </li>
              <li>
                <button onClick={() => { switchRole('bulk_buyer'); setActiveView('bulk-dashboard'); }} className="hover:text-emerald-400 transition-colors text-left">
                  Bulk Buyer & HoReCa Hub
                </button>
              </li>
              <li>
                <button onClick={() => { switchRole('collection_center'); setActiveView('collection-dashboard'); }} className="hover:text-emerald-400 transition-colors text-left">
                  Collection Center & QC Hub
                </button>
              </li>
              <li>
                <button onClick={() => { switchRole('driver'); setActiveView('driver-dashboard'); }} className="hover:text-emerald-400 transition-colors text-left">
                  Logistics & Driver Partner App
                </button>
              </li>
              <li>
                <button onClick={() => { switchRole('admin'); setActiveView('admin-dashboard'); }} className="hover:text-emerald-400 transition-colors text-left">
                  Platform Admin Overview
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Region */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Pilot Agri Corridors
            </h5>
            <div className="text-slate-400 space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Western Maharashtra: Sangli, Kolhapur, Satara, Pune & Nashik</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>support@farm2market-ai.demo</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Toll-Free Kisan Line: 1800-FARM-2M</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              *Prototype demonstration system for collegiate innovation competition & hackathon evaluation.
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>© {new Date().getFullYear()} Farm2Market AI. All rights reserved. Built for SIH & AgriTech Innovation.</div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">About Platform</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-slate-400 cursor-pointer">Fair Price Terms</span>
            <span className="hover:text-slate-400 cursor-pointer">Logistics SLA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
