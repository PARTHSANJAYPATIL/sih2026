import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sprout, 
  ShoppingCart, 
  Bell, 
  Menu, 
  X, 
  Sparkles, 
  User as UserIcon, 
  Compass, 
  BarChart3, 
  TrendingUp, 
  Truck, 
  Building, 
  Tractor,
  CheckCircle,
  QrCode
} from 'lucide-react';

interface NavbarProps {
  onOpenDemoAccounts: () => void;
  onOpenGuidedScenario: () => void;
  onOpenCart: () => void;
  onOpenQRScanner?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenDemoAccounts, 
  onOpenGuidedScenario, 
  onOpenCart,
  onOpenQRScanner
}) => {
  const { currentUser, notifications, markNotificationAsRead, cart, activeView, setActiveView, backendConnected } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantityKg, 0);

  const getDashboardViewForRole = () => {
    switch (currentUser.role) {
      case 'farmer': return 'farmer-dashboard';
      case 'consumer': return 'consumer-dashboard';
      case 'bulk_buyer': return 'bulk-dashboard';
      case 'admin': return 'admin-dashboard';
      case 'collection_center': return 'collection-dashboard';
      case 'driver': return 'driver-dashboard';
      default: return 'landing';
    }
  };

  const navItems = [
    { label: 'Home', view: 'landing' },
    { label: 'Marketplace', view: 'marketplace' },
    { label: 'AI Demand Forecast', view: 'demand-forecast' },
    { label: 'Smart Pricing', view: 'price-insights' },
    { label: 'Live Tracking', view: 'delivery-tracking' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-[37px] z-30 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 flex items-center justify-center text-white shadow-card group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-forest tracking-tight flex items-center gap-1">
                  <span>Farm2Market</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    AI
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium tracking-wide">
                  Agri Supply-Chain Engine
                </div>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const isActive = activeView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => setActiveView(item.view)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {backendConnected && (
              <span 
                title="Connected to Django REST Framework backend with PostgreSQL database support"
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs cursor-help"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>REST API Active</span>
              </span>
            )}

            {/* Launch Demo Primary CTA (Requirement 38) */}
            <button
              onClick={onOpenGuidedScenario}
              className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-105 shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-700"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-extrabold tracking-tight">Launch Demo</span>
            </button>

            {/* Go To Role Dashboard Button */}
            <button
              onClick={() => setActiveView(getDashboardViewForRole())}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
            >
              <Tractor className="w-3.5 h-3.5" />
              <span>My Dashboard</span>
            </button>

            {/* QR Scanner Trigger */}
            {onOpenQRScanner && (
              <button
                onClick={onOpenQRScanner}
                title="Scan Produce QR Code"
                className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative border border-slate-200"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-fade-in">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      {unreadCount} unread
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-400">No notifications</div>
                    ) : (
                      notifications.slice(0, 6).map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                            !n.read ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-800">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-normal">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Consumer Cart Icon */}
            <button
              onClick={onOpenCart}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative border border-slate-200"
              title="Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {cartItemCount}kg
                </span>
              )}
            </button>

            {/* User Avatar / Demo Login Modal Trigger */}
            <button
              onClick={onOpenDemoAccounts}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-left"
              title="Switch Demo Account"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-emerald-300"
              />
              <div className="hidden xl:block">
                <div className="text-[11px] font-bold text-slate-800 leading-none">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 hover:text-slate-900 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-1">
            {navItems.map(item => (
              <button
                key={item.view}
                onClick={() => {
                  setActiveView(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeView === item.view ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setActiveView(getDashboardViewForRole());
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50/70 rounded-lg flex items-center gap-1.5"
            >
              <Tractor className="w-4 h-4" />
              <span>Go to My Role Dashboard ({currentUser.role.replace('_', ' ')})</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
