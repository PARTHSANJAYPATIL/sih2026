import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Tractor, 
  ShoppingBag, 
  Building2, 
  ShieldCheck, 
  Warehouse, 
  Truck,
  Sparkles
} from 'lucide-react';

interface RoleSwitcherProps {
  onOpenDemoScenario?: () => void;
  onOpenLoginModal?: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onOpenDemoScenario, onOpenLoginModal }) => {
  const { currentUser, switchRole, resetDemoData } = useApp();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
    { role: 'farmer', label: 'Farmer / FPO', icon: <Tractor className="w-4 h-4" />, color: 'bg-emerald-600', desc: 'Ramesh Patil (Sangli)' },
    { role: 'consumer', label: 'Consumer', icon: <ShoppingBag className="w-4 h-4" />, color: 'bg-teal-600', desc: 'Pooja Kulkarni (Pune)' },
    { role: 'bulk_buyer', label: 'Bulk Buyer', icon: <Building2 className="w-4 h-4" />, color: 'bg-indigo-600', desc: 'Hotel ABC (Kolhapur)' },
    { role: 'collection_center', label: 'Collection Hub', icon: <Warehouse className="w-4 h-4" />, color: 'bg-amber-600', desc: 'Sangli Agro Hub' },
    { role: 'driver', label: 'Logistics Driver', icon: <Truck className="w-4 h-4" />, color: 'bg-blue-600', desc: 'Rahul Patil (MH-10)' },
    { role: 'admin', label: 'Platform Admin', icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-slate-800', desc: 'Platform Overview' }
  ];

  return (
    <aside aria-label="Demo Role Switcher" className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-40 px-3 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>DEMO MODE</span>
          </span>
          <span className="text-slate-500 hidden sm:inline">Active Role:</span>
          <span className="font-semibold text-slate-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {currentUser.name} ({currentUser.role.replace('_', ' ').toUpperCase()})
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {roles.map(r => {
            const isActive = currentUser.role === r.role;
            return (
              <button
                key={r.role}
                onClick={() => switchRole(r.role)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-all ${
                  isActive 
                    ? `${r.color} text-white shadow-sm ring-2 ring-offset-1 ring-emerald-400 scale-105`
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
                title={`Switch to ${r.label} (${r.desc})`}
              >
                {r.icon}
                <span className="whitespace-nowrap">{r.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {onOpenDemoScenario && (
            <button
              onClick={onOpenDemoScenario}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-transform active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Guided Demo (Hotel ABC)</span>
            </button>
          )}

          {onOpenLoginModal && (
            <button
              onClick={onOpenLoginModal}
              className="px-2.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 font-medium whitespace-nowrap"
            >
              Demo Credentials
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm('Reset prototype demo state to initial dummy data?')) {
                resetDemoData();
              }
            }}
            className="px-2 py-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors text-[11px]"
            title="Reset demo data"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
};
