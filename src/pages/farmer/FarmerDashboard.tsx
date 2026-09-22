import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Tractor, 
  Sprout, 
  Calendar, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Truck, 
  CheckCircle2, 
  Award, 
  Plus, 
  ArrowRight, 
  QrCode, 
  AlertCircle,
  BarChart3,
  Layers,
  MapPin,
  Bell
} from 'lucide-react';
import { QRCodeModal, QRDataPayload } from '../../components/common/QRCodeModal';
import confetti from 'canvas-confetti';

interface FarmerDashboardProps {
  onNavigateToAddProduce: () => void;
  onNavigateToForecast: () => void;
  onNavigateToPricing: () => void;
  onNavigateToEarnings: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onNavigateToAddProduce,
  onNavigateToForecast,
  onNavigateToPricing,
  onNavigateToEarnings
}) => {
  const { 
    currentUser, 
    produceListings, 
    updateHarvestStatus, 
    driverTasks,
    orders 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'my-crops' | 'pickups' | 'harvest-schedule'>('overview');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQRPayload, setSelectedQRPayload] = useState<QRDataPayload | null>(null);

  // Filter crops belonging to farmer
  const farmerCrops = produceListings.filter(p => p.farmerId === currentUser.id || p.farmerName.includes('Ramesh'));
  const activeListingsCount = farmerCrops.length;
  const upcomingHarvestCount = farmerCrops.filter(p => p.harvestStatus === 'Growing' || p.harvestStatus === 'Ready for Harvest').length;
  const pendingOrdersCount = 3;
  const totalEarnings = 48200;
  const pendingPickups = driverTasks.filter(t => t.type === 'Farmer Pickup' && t.status !== 'Completed').length;

  const handleMarkReadyForHarvest = (id: string, cropName: string) => {
    updateHarvestStatus(id, 'Ready for Harvest');
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const openProduceQR = (crop: typeof farmerCrops[0]) => {
    setSelectedQRPayload({
      type: 'Produce Batch',
      title: `${crop.cropName} (${crop.variety})`,
      productName: crop.cropName,
      farmerName: crop.farmerName,
      fpoName: crop.fpoName,
      harvestDate: crop.expectedHarvestDate,
      quantityKg: crop.quantity,
      qualityGrade: crop.qualityGrade,
      location: crop.location,
      collectionCenter: 'Sangli Central Agro Hub #4'
    });
    setQrModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30 flex items-center gap-1">
              <Tractor className="w-3.5 h-3.5" /> Verified Farmer & FPO Producer
            </span>
            <span className="text-xs text-emerald-200">ID: {currentUser.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Farmer Workspace: {currentUser.name}
          </h1>
          <p className="text-emerald-100 text-xs mt-1">
            FPO: <span className="font-semibold text-white">{currentUser.fpoName || 'Sahyadri Farmers Producer Co.'}</span> • {currentUser.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onNavigateToAddProduce}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>List New Produce</span>
          </button>

          <button
            onClick={onNavigateToForecast}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4 text-amber-300" />
            <span>AI Demand Forecast</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs (Requirement 7) */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2 no-scrollbar text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setActiveTab('my-crops')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'my-crops' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Crops ({farmerCrops.length})
        </button>
        <button
          onClick={onNavigateToAddProduce}
          className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
        >
          + Add Produce
        </button>
        <button
          onClick={onNavigateToPricing}
          className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
        >
          Price Insights
        </button>
        <button
          onClick={() => setActiveTab('pickups')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'pickups' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pickup Requests
        </button>
        <button
          onClick={onNavigateToEarnings}
          className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
        >
          Earnings & Ledger
        </button>
      </div>

      {/* 6 Dashboard Cards (Requirement 7) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-slate-400 text-[11px] font-semibold">Active Listings</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{activeListingsCount}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Live on marketplace</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-slate-400 text-[11px] font-semibold">Upcoming Harvest</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{upcomingHarvestCount}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Next 7 days</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-slate-400 text-[11px] font-semibold">Pending Orders</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{pendingOrdersCount}</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Buyer contracts</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-slate-400 text-[11px] font-semibold">Total Earnings</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">₹{totalEarnings.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Direct to Bank</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-slate-400 text-[11px] font-semibold">Today's Demand</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">High</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Tomato deficit +25%</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-slate-400 text-[11px] font-semibold">Pending Pickup</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingPickups}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Rahul Patil assigned</div>
        </div>
      </div>

      {/* FEATURED HARVEST CARD SPECIFIED IN REQUIREMENT 7 */}
      {/* Tomato 500 kg, Harvest: 25 Sept, Reference price: ₹23/kg, AI suggested: ₹22–₹26/kg, Button: Mark Ready for Harvest */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              🍅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Featured Lot: Tomato (Shivam Hybrid)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Grade A
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Miraj Plot #14 • 500 kg batch scheduled for 25 Sept harvest
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openProduceQR(farmerCrops[0] || produceListings[0])}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 shadow-xs flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-700" />
              <span>Batch QR Pass</span>
            </button>

            {/* Prompt Required Action Button: "Mark Ready for Harvest" */}
            <button
              onClick={() => handleMarkReadyForHarvest(farmerCrops[0]?.id || 'prod-tomato-1', 'Tomato')}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-forest hover:from-emerald-800 hover:to-forest-dark text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Ready for Harvest</span>
            </button>
          </div>
        </div>

        {/* Highlighted Metrics from Requirement 7 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-400 font-medium">Batch Quantity:</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">500 kg</div>
            <div className="text-[10px] text-slate-500">Ready in crates</div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-400 font-medium">Expected Harvest Date:</span>
            <div className="text-lg font-black text-amber-600 mt-0.5">25 Sept</div>
            <div className="text-[10px] text-amber-600 font-semibold">Optimal maturity</div>
          </div>

          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-400 font-medium">Current Reference Price:</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">₹23 / kg</div>
            <div className="text-[10px] text-slate-500">Mandi modal rate</div>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="text-emerald-800 font-semibold">AI Suggested Corridor:</span>
            <div className="text-lg font-black text-emerald-800 mt-0.5">₹22 – ₹26 / kg</div>
            <div className="text-[10px] text-emerald-700 font-bold">Recommended: ₹24/kg</div>
          </div>
        </div>

        <div className="p-3 bg-white/80 rounded-xl border border-emerald-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Farm-Gate Logistics: Driver Rahul Patil (Vehicle MH-10-AB-1234) on standby for pickup dispatch.</span>
          </div>
          <span className="font-bold text-emerald-800">Status: {farmerCrops[0]?.harvestStatus || 'Ready for Harvest'}</span>
        </div>
      </div>

      {/* My Listed Crops Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Active Produce Listings & Batches
            </h3>
            <p className="text-xs text-slate-500">
              Manage your harvest statuses and QR traceability labels.
            </p>
          </div>
          <button
            onClick={onNavigateToAddProduce}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Another Batch</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Crop / Variety</th>
                <th className="py-3 px-3">Quantity</th>
                <th className="py-3 px-3">Harvest Date</th>
                <th className="py-3 px-3">Quality</th>
                <th className="py-3 px-3">Your Price</th>
                <th className="py-3 px-3">Harvest Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {farmerCrops.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2.5">
                    <img
                      src={item.imageUrl}
                      alt={item.cropName}
                      className="w-9 h-9 rounded-lg object-cover"
                    />
                    <div>
                      <div>{item.cropName}</div>
                      <div className="text-[10px] text-slate-400">{item.variety}</div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800">{item.quantity} {item.unit}</td>
                  <td className="py-3 px-3 text-slate-600">{item.expectedHarvestDate}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {item.qualityGrade}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-emerald-700">₹{item.farmerPrice}/kg</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      item.harvestStatus === 'Ready for Harvest'
                        ? 'bg-amber-100 text-amber-800'
                        : item.harvestStatus === 'Harvested'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.harvestStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => openProduceQR(item)}
                      className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors inline-flex"
                      title="View QR Tag"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    {item.harvestStatus !== 'Ready for Harvest' && (
                      <button
                        onClick={() => handleMarkReadyForHarvest(item.id, item.cropName)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] border border-emerald-200 transition-colors"
                      >
                        Mark Ready
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        payload={selectedQRPayload}
      />
    </div>
  );
};
