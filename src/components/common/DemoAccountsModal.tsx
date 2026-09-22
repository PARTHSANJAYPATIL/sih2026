import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/mockData';
import { UserRole } from '../../types';
import { 
  X, 
  Tractor, 
  ShoppingBag, 
  Building2, 
  ShieldCheck, 
  Warehouse, 
  Truck, 
  LogIn, 
  KeyRound, 
  CheckCircle2 
} from 'lucide-react';

interface DemoAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoAccountsModal: React.FC<DemoAccountsModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentUser, setActiveView } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [emailInput, setEmailInput] = useState('farmer@demo.com');
  const [passwordInput, setPasswordInput] = useState('123456');

  if (!isOpen) return null;

  const demoAccounts = [
    { role: 'farmer' as UserRole, email: 'farmer@demo.com', name: 'Ramesh Patil', title: 'Farmer / FPO Producer', location: 'Sangli', icon: <Tractor className="w-5 h-5 text-emerald-600" /> },
    { role: 'consumer' as UserRole, email: 'consumer@demo.com', name: 'Pooja Kulkarni', title: 'Retail Consumer', location: 'Pune', icon: <ShoppingBag className="w-5 h-5 text-teal-600" /> },
    { role: 'bulk_buyer' as UserRole, email: 'buyer@demo.com', name: 'Chef Rajesh', title: 'Bulk Buyer (Hotel ABC)', location: 'Kolhapur', icon: <Building2 className="w-5 h-5 text-indigo-600" /> },
    { role: 'admin' as UserRole, email: 'admin@demo.com', name: 'Vikram Shinde', title: 'Platform Administrator', location: 'HQ Pune', icon: <ShieldCheck className="w-5 h-5 text-slate-700" /> },
    { role: 'collection_center' as UserRole, email: 'center@demo.com', name: 'Anand Deshmukh', title: 'Collection Center Manager', location: 'Sangli Hub', icon: <Warehouse className="w-5 h-5 text-amber-600" /> },
    { role: 'driver' as UserRole, email: 'driver@demo.com', name: 'Rahul Patil', title: 'Logistics / Driver Partner', location: 'Fleet MH-10', icon: <Truck className="w-5 h-5 text-blue-600" /> },
  ];

  const handleSelectAccount = (role: UserRole, email: string) => {
    setSelectedRole(role);
    setEmailInput(email);
    setPasswordInput('123456');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = DEMO_USERS.find(u => u.email.toLowerCase() === emailInput.toLowerCase()) || DEMO_USERS.find(u => u.role === selectedRole);
    if (user) {
      setCurrentUser(user);
      if (user.role === 'farmer') setActiveView('farmer-dashboard');
      else if (user.role === 'consumer') setActiveView('consumer-dashboard');
      else if (user.role === 'bulk_buyer') setActiveView('bulk-dashboard');
      else if (user.role === 'admin') setActiveView('admin-dashboard');
      else if (user.role === 'collection_center') setActiveView('collection-dashboard');
      else if (user.role === 'driver') setActiveView('driver-dashboard');
      onClose();
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    const user = DEMO_USERS.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      if (user.role === 'farmer') setActiveView('farmer-dashboard');
      else if (user.role === 'consumer') setActiveView('consumer-dashboard');
      else if (user.role === 'bulk_buyer') setActiveView('bulk-dashboard');
      else if (user.role === 'admin') setActiveView('admin-dashboard');
      else if (user.role === 'collection_center') setActiveView('collection-dashboard');
      else if (user.role === 'driver') setActiveView('driver-dashboard');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-forest-dark p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-400" />
              <span>Demo Login & Predefined Roles</span>
            </h2>
            <p className="text-emerald-100 text-xs mt-1">
              Select any persona to explore role-specific permissions and live features.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Quick 1-Click Persona Access
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {demoAccounts.map(acc => {
              const isSelected = selectedRole === acc.role;
              return (
                <div
                  key={acc.role}
                  onClick={() => handleSelectAccount(acc.role, acc.email)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-xs border border-slate-100">
                      {acc.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                        {acc.name}
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="text-xs text-slate-500">{acc.title}</div>
                      <div className="text-[11px] text-slate-400">{acc.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickLogin(acc.role);
                    }}
                    className="text-xs px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-xs transition-colors"
                  >
                    Enter
                  </button>
                </div>
              );
            })}
          </div>

          {/* Form simulation */}
          <form onSubmit={handleLogin} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-700 mb-2">Simulated Credentials Form</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Password (Demo: 123456)</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-xs px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In as {demoAccounts.find(a => a.role === selectedRole)?.name}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
