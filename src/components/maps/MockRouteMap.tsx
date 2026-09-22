import React, { useState } from 'react';
import { 
  MapPin, 
  Truck, 
  Warehouse, 
  Building2, 
  Home, 
  Clock, 
  Navigation, 
  Info, 
  CheckCircle2,
  Layers
} from 'lucide-react';

interface MockRouteMapProps {
  mode?: 'delivery_tracking' | 'route_optimizer' | 'fleet_overview';
  currentStep?: number; // 0 to 4
}

export const MockRouteMap: React.FC<MockRouteMapProps> = ({ 
  mode = 'route_optimizer', 
  currentStep = 2 
}) => {
  const [selectedRoute, setSelectedRoute] = useState<'recommended' | 'alternative'>('recommended');

  const waypoints = [
    { id: 'farm-a', name: 'Farm A (Miraj)', type: 'farm', x: 70, y: 130, load: '+300 kg Tomato', status: 'Completed', color: '#16a34a' },
    { id: 'farm-c', name: 'Farm C (Palus)', type: 'farm', x: 190, y: 70, load: '+200 kg Tomato', status: 'Completed', color: '#16a34a' },
    { id: 'farm-b', name: 'Farm B (Tasgaon)', type: 'farm', x: 290, y: 120, load: '+250 kg Tomato', status: 'In Transit', color: '#eab308' },
    { id: 'cc-sangli', name: 'Sangli Collection Hub', type: 'hub', x: 400, y: 160, load: 'QC & Consolidated Pack (992 kg)', status: 'Pending', color: '#d97706' },
    { id: 'hub-kolhapur', name: 'Local Logistics Dispatch', type: 'dispatch', x: 520, y: 130, load: 'Sorting & Dispatch', status: 'Pending', color: '#2563eb' },
    { id: 'buyer-abc', name: 'Hotel ABC (Kolhapur)', type: 'buyer', x: 640, y: 80, load: 'Final Delivery (1,000 kg)', status: 'Pending', color: '#7c3aed' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Map Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {mode === 'delivery_tracking' ? 'Live Order Journey & Geo-Trace' : 'Logistics Corridor Optimization Engine'}
            </h4>
            <p className="text-[11px] text-slate-500">
              Corridor: Sangli Agricultural Belt → NH 166 → Kolhapur / Pune Hubs
            </p>
          </div>
        </div>

        {mode === 'route_optimizer' && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium mr-1 text-[11px]">Route Variant:</span>
            <button
              onClick={() => setSelectedRoute('recommended')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                selectedRoute === 'recommended'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Recommended (42 km)
            </button>
            <button
              onClick={() => setSelectedRoute('alternative')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                selectedRoute === 'alternative'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Alternative Highway (49 km)
            </button>
          </div>
        )}
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full h-64 sm:h-72 bg-[#f8fafc] overflow-hidden border-b border-slate-100 select-none">
        {/* Subtle grid background styling */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2,2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Topographic and River decor lines (Krishna River basin) */}
        <svg viewBox="0 0 720 220" className="absolute inset-0 w-full h-full">
          {/* Simulated Krishna river */}
          <path
            d="M 20 210 Q 180 180 320 190 T 550 170 T 700 150"
            fill="none"
            stroke="#bfdbfe"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.6"
          />
          <text x="210" y="205" fill="#60a5fa" fontSize="9" fontWeight="600" letterSpacing="1">
            KRISHNA RIVER VALLEY
          </text>

          {/* Alternative Route dashed path */}
          {selectedRoute === 'alternative' && (
            <path
              d="M 70 130 Q 180 20 290 120 T 400 160 T 520 130 T 640 80"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="3"
              strokeDasharray="6,4"
              className="animate-pulse"
            />
          )}

          {/* Recommended Route Solid Path */}
          <path
            d="M 70 130 L 190 70 L 290 120 L 400 160 L 520 130 L 640 80"
            fill="none"
            stroke={selectedRoute === 'recommended' ? '#2563eb' : '#cbd5e1'}
            strokeWidth={selectedRoute === 'recommended' ? '4' : '2'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active vehicle marker moving animation */}
          <g className="animate-pulse" transform={`translate(${selectedRoute === 'recommended' ? 290 : 250}, ${selectedRoute === 'recommended' ? 120 : 70})`}>
            <circle cx="0" cy="0" r="16" fill="#3b82f6" opacity="0.25" />
            <circle cx="0" cy="0" r="10" fill="#2563eb" />
            <path d="M -4 -3 L 4 -3 L 5 0 L 5 3 L -5 3 Z" fill="white" />
          </g>

          {/* Waypoint nodes */}
          {waypoints.map((wp, i) => (
            <g key={wp.id} className="cursor-pointer group">
              <circle
                cx={wp.x}
                cy={wp.y}
                r="12"
                fill="white"
                stroke={wp.color}
                strokeWidth="3"
                className="transition-transform group-hover:scale-125"
              />
              <circle
                cx={wp.x}
                cy={wp.y}
                r="5"
                fill={wp.color}
              />
              {/* Waypoint Label */}
              <rect
                x={wp.x - 45}
                y={wp.y + 16}
                width="90"
                height="18"
                rx="4"
                fill="white"
                stroke="#e2e8f0"
                strokeWidth="1"
                filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))"
              />
              <text
                x={wp.x}
                y={wp.y + 28}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#1e293b"
              >
                {wp.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Live Status Overlay Card */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Vehicle: MH-10-AB-1234 (Rahul Patil)</span>
          </div>
          <div className="text-[11px] text-slate-600">
            Capacity: <span className="font-semibold">1,000 kg</span> | Current Load: <span className="font-semibold text-blue-700">900 kg (90%)</span>
          </div>
        </div>
      </div>

      {/* Metrics & Route Comparison Footnote */}
      <div className="p-4 bg-white grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-slate-100">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-slate-500 text-[11px]">Total Distance</div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">
            {selectedRoute === 'recommended' ? '42 km' : '49 km'}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium">
            {selectedRoute === 'recommended' ? 'Optimal Cluster Pickups' : 'Via Bypass Highway'}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-slate-500 text-[11px]">Est. Transit Time</div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">
            {selectedRoute === 'recommended' ? '1 hr 35 min' : '1 hr 52 min'}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">3 farm-gate stops</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-slate-500 text-[11px]">Vehicle Utilization</div>
          <div className="text-sm font-bold text-blue-700 mt-0.5">90% Full</div>
          <div className="text-[10px] text-slate-500 font-medium">900 kg / 1,000 kg limit</div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-slate-500 text-[11px]">Delivery Deadline</div>
          <div className="text-sm font-bold text-slate-900 mt-0.5">12:00 PM Today</div>
          <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> On Track (11:15 AM ETA)
          </div>
        </div>
      </div>

      {/* Requirement 23 Compliance Explanation Banner */}
      <div className="px-4 py-2.5 bg-amber-50/70 border-t border-amber-100 flex items-start gap-2 text-[11px] text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold">Route Calculation Rationale:</span> The system selects this recommended route based on configured factors such as farm cluster proximity, vehicle weight capacity constraints, and buyer delivery deadlines. Alternative routes are provided for traffic deviations. <em>(System optimizes according to configured parameters rather than claiming absolute global optimality.)</em>
        </p>
      </div>
    </div>
  );
};
