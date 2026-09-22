import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRICE_INSIGHT_TOMATO } from '../../data/mockData';
import { 
  DollarSign, 
  TrendingUp, 
  Award, 
  Truck, 
  Info, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Lock, 
  Unlock 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PriceRecommendationPage: React.FC = () => {
  const { produceListings, updateFarmerPrice } = useApp();
  const tomatoListing = produceListings.find(p => p.cropName.toLowerCase().includes('tomato')) || produceListings[0];

  const [selectedPrice, setSelectedPrice] = useState<number>(tomatoListing?.farmerPrice || 24);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(tomatoListing?.quantity || 500);
  const [isSaved, setIsSaved] = useState(false);

  const priceData = PRICE_INSIGHT_TOMATO;
  const expectedGrossRevenue = selectedPrice * selectedQuantity;

  const handleSavePrice = () => {
    if (tomatoListing) {
      updateFarmerPrice(tomatoListing.id, selectedPrice);
      setIsSaved(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-forest to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Fair-Price Discovery & Farmer Autonomy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
            Smart Price Recommendation Engine
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Data-backed price corridor recommendations that evaluate mandi spot benchmarks, local quality grades, transport logistics, and real-time buyer demand.
          </p>
        </div>
      </div>

      {/* Mandatory Requirement 10 Core Notice: Farmer Price Autonomy */}
      <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 flex items-center gap-3 text-emerald-950 text-xs shadow-xs">
        <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
          <Unlock className="w-5 h-5" />
        </div>
        <div>
          <div className="font-extrabold text-sm text-emerald-900">
            Guaranteed Farmer Price Autonomy:
          </div>
          <p className="text-emerald-800 font-medium mt-0.5">
            "AI provides a recommendation. The farmer decides the final selling price." The platform never forces arbitrary prices onto your produce.
          </p>
        </div>
      </div>

      {/* Main Grid: Parameters & Interactive Pricing Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Market Signals & Reference Inputs (Requirement 10) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              Pricing Inputs for {priceData.cropName}
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Sangli Cluster
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-medium">Market Reference (APMC Mandi):</span>
              <div className="text-xl font-black text-slate-900 mt-1">₹{priceData.marketRefPrice}/kg</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Mandi wholesale modal average</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-medium">Certified Quality Grade:</span>
              <div className="text-xl font-black text-emerald-700 mt-1">{priceData.qualityGrade}</div>
              <div className="text-[10px] text-emerald-600 mt-0.5">+₹1.50/kg quality premium</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-medium">Regional Demand Level:</span>
              <div className="text-xl font-black text-blue-600 mt-1">{priceData.demandLevel}</div>
              <div className="text-[10px] text-blue-600 mt-0.5">High buyer interest</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 font-medium">Local Supply Influx:</span>
              <div className="text-xl font-black text-amber-600 mt-1">{priceData.supplyLevel}</div>
              <div className="text-[10px] text-amber-600 mt-0.5">Moderate harvests expected</div>
            </div>
          </div>

          {/* Logistics & Handling Costs */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2 text-xs">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Logistics & Handling Factor</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Farm-gate pickup logistics:</span>
              <span className="font-semibold text-slate-900">₹{priceData.logisticsCostPerKg}/kg</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Partner Hub grading & packing:</span>
              <span className="font-semibold text-slate-900">₹{priceData.handlingCostPerKg}/kg</span>
            </div>
            <p className="text-[11px] text-blue-800/80 pt-1 border-t border-blue-200">
              Logistics are bundled transparently so farmers never need to pay out-of-pocket for haulage.
            </p>
          </div>
        </div>

        {/* Right Col: AI Suggested Range & Farmer Selector (Requirement 10) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                AI Suggested Price Corridor
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Optimal Window
              </span>
            </div>

            {/* Price Corridor Display */}
            <div className="my-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                AI Suggested Price Range
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-800 mt-1">
                ₹{priceData.aiSuggestedMin} – ₹{priceData.aiSuggestedMax}
                <span className="text-sm font-semibold text-slate-500"> / kg</span>
              </div>
              <p className="text-xs text-emerald-900 mt-2 font-medium">
                Selling within this corridor ensures 98% rapid buyer matching within 24 hours of harvest.
              </p>
            </div>

            {/* Interactive Slider for Farmer's Selected Price */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Farmer's Selected Selling Price:
                </label>
                <div className="text-2xl font-black text-emerald-700">
                  ₹{selectedPrice} <span className="text-xs font-normal text-slate-500">/ kg</span>
                </div>
              </div>

              <input
                type="range"
                min="18"
                max="32"
                step="0.5"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Min: ₹18/kg</span>
                <span className="text-emerald-700 font-bold">Suggested: ₹22–₹26/kg</span>
                <span>Max: ₹32/kg</span>
              </div>
            </div>

            {/* Expected Gross Revenue Calculation (Requirement 10) */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Batch Harvest Quantity:</span>
                <span className="font-bold text-slate-900">{selectedQuantity} kg</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Your Selected Selling Rate:</span>
                <span className="font-bold text-slate-900">₹{selectedPrice}/kg</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Expected Gross Farmer Revenue:</span>
                <span className="text-emerald-700">₹{expectedGrossRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSavePrice}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaved ? 'Price Saved to Your Live Listing!' : 'Apply Selected Price to Marketplace Listing'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
