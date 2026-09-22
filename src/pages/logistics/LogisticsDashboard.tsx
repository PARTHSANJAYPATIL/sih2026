import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DriverTask } from '../../types';
import { MockRouteMap } from '../../components/maps/MockRouteMap';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  ShieldCheck, 
  Smartphone, 
  Camera, 
  Upload, 
  Phone, 
  AlertCircle,
  Play,
  RotateCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LogisticsDashboard: React.FC = () => {
  const { vehicles, driverTasks, updateDriverTaskStatus, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'driver-app' | 'fleet-manager' | 'route-optimizer'>('driver-app');
  const [gpsActive, setGpsActive] = useState<boolean>(true);
  const [proofUploaded, setProofUploaded] = useState<boolean>(false);

  // Driver mobile app active task workflow (Requirement 22)
  const currentTask = driverTasks[0] || {
    id: 'task-1',
    type: 'Farmer Pickup',
    title: 'Farmer A (Ramesh Patil) — Pickup 300 kg Tomato',
    location: 'Plot 14, Miraj Shivar, Sangli',
    quantityKg: 300,
    status: 'Accepted',
    timeSlot: '07:30 AM – 08:30 AM',
    contactPerson: 'Ramesh Patil',
    contactPhone: '+91 98220 14589'
  };

  const handleTaskAction = (newStatus: DriverTask['status']) => {
    updateDriverTaskStatus(currentTask.id, newStatus);
    if (newStatus === 'Completed') {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  // Fleet KPIs (Requirement 21)
  const activeVehiclesCount = vehicles.filter(v => v.currentStatus !== 'Maintenance').length;
  const totalLoad = vehicles.reduce((acc, v) => acc + v.currentLoadKg, 0);
  const totalCap = vehicles.reduce((acc, v) => acc + v.capacityKg, 0);
  const avgUtilization = Math.round((totalLoad / totalCap) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Partner Logistics & Driver Telematics
            </span>
            <span className="text-xs text-blue-200">Driver: {currentUser.name} (MH-10-AB-1234)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Logistics & Driver Partner Console
          </h1>
          <p className="text-blue-100 text-xs mt-1">
            Dynamic farm-gate cluster pickups, vehicle capacity balancing, and live delivery updates.
          </p>
        </div>

        {/* GPS simulation toggle */}
        <button
          onClick={() => setGpsActive(!gpsActive)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
            gpsActive
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${gpsActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
          <span>GPS Simulator: {gpsActive ? 'Broadcasting Coordinates' : 'Standby'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2 no-scrollbar text-xs font-semibold">
        <button
          onClick={() => setActiveTab('driver-app')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'driver-app' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Driver Mobile View (Handheld Terminal)
        </button>
        <button
          onClick={() => setActiveTab('fleet-manager')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'fleet-manager' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Fleet Manager Dashboard
        </button>
        <button
          onClick={() => setActiveTab('route-optimizer')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'route-optimizer' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Smart Route Optimization (42 km)
        </button>
      </div>

      {/* TAB 1: DRIVER APP / MOBILE TERMINAL (Requirement 22) */}
      {activeTab === 'driver-app' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-elevated p-6 space-y-5">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span className="font-extrabold text-slate-900 text-sm">
                  Driver Task Terminal (Rahul Patil)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                MH-10-AB-1234
              </span>
            </div>

            {/* Simulated GPS Status Banner */}
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="font-semibold text-blue-950">
                  GPS Fixed: Miraj Outer Ring Road
                </span>
              </div>
              <span className="text-[11px] text-blue-700 font-bold">Accuracy: ±2m</span>
            </div>

            {/* Active Task Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                  {currentTask.type}
                </span>
                <span className="text-xs font-black text-blue-700">
                  {currentTask.status}
                </span>
              </div>

              <h3 className="font-black text-slate-900 text-base">
                {currentTask.title}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{currentTask.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Time Window: {currentTask.timeSlot}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Contact: {currentTask.contactPerson} ({currentTask.contactPhone})</span>
                </div>
              </div>
            </div>

            {/* REQUIRED INTERACTIVE ACTION BUTTONS (Requirement 22) */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Route Execution Controls
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTaskAction('Accepted')}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  1. Accept Job
                </button>
                <button
                  onClick={() => handleTaskAction('En Route')}
                  className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200 transition-colors"
                >
                  2. Start Route
                </button>
                <button
                  onClick={() => handleTaskAction('Arrived')}
                  className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-colors"
                >
                  3. Arrived at Gate
                </button>
                <button
                  onClick={() => handleTaskAction('Completed')}
                  className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors"
                >
                  4. Pickup Confirmed
                </button>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setProofUploaded(true);
                    alert('Simulated photo upload: Digital crate scale slip and geotagged picture uploaded.');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{proofUploaded ? 'Proof Uploaded ✓' : '5. Upload Proof'}</span>
                </button>
                <button
                  onClick={() => handleTaskAction('Completed')}
                  className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>6. Complete Delivery</span>
                </button>
              </div>
            </div>

            {/* Today's Tasks Queue from Requirement 22 */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Today's Task Route (4 Stops)
              </div>
              <div className="space-y-2 text-xs">
                {driverTasks.map(task => (
                  <div key={task.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                    <div>
                      <div className="font-bold text-slate-900">{task.title}</div>
                      <div className="text-[11px] text-slate-500">{task.timeSlot}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FLEET MANAGER DASHBOARD (Requirement 21) */}
      {activeTab === 'fleet-manager' && (
        <div className="space-y-6">
          {/* Fleet KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
              <div className="text-slate-400 text-xs font-semibold">Active Vehicles</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{activeVehiclesCount}</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% telemetry synced</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
              <div className="text-slate-400 text-xs font-semibold">Available Drivers</div>
              <div className="text-2xl font-black text-blue-700 mt-1">3 Available</div>
              <div className="text-[11px] text-blue-600 font-semibold mt-0.5">Sangli & Pune fleets</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
              <div className="text-slate-400 text-xs font-semibold">Vehicle Utilization</div>
              <div className="text-2xl font-black text-indigo-700 mt-1">{avgUtilization}%</div>
              <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">{totalLoad} / {totalCap} kg capacity</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
              <div className="text-slate-400 text-xs font-semibold">Corridor Transit Radius</div>
              <div className="text-2xl font-black text-amber-600 mt-1">42 km Avg</div>
              <div className="text-[11px] text-amber-600 font-semibold mt-0.5">Optimized cluster routes</div>
            </div>
          </div>

          {/* Vehicles List (Requirement 21 Example: MH-10-AB-1234, 1,000kg capacity, 750kg load, Available, Rahul Patil) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Registered Partner Fleet Vehicles
            </h3>

            <div className="divide-y divide-slate-100">
              {vehicles.map(veh => (
                <div key={veh.id} className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">{veh.registrationNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {veh.currentStatus}
                        </span>
                      </div>
                      <div className="text-slate-600 mt-0.5">
                        Driver: <span className="font-semibold text-slate-800">{veh.driverName}</span> ({veh.driverPhone})
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Type: {veh.vehicleType} • Location: {veh.currentLocation}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">
                      {veh.currentLoadKg} / {veh.capacityKg} kg
                    </div>
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
                      <div
                        style={{ width: `${(veh.currentLoadKg / veh.capacityKg) * 100}%` }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {Math.round((veh.currentLoadKg / veh.capacityKg) * 100)}% Capacity Load
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SMART ROUTE OPTIMIZATION (Requirement 23) */}
      {activeTab === 'route-optimizer' && (
        <div className="space-y-6">
          <MockRouteMap mode="route_optimizer" />
        </div>
      )}
    </div>
  );
};
