import React, { useState } from 'react';
import { 
  DEMAND_FORECAST_TOMATO 
} from '../../data/mockData';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  Calendar, 
  BarChart3, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

export const AIDemandForecast: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<'Tomato' | 'Onion' | 'Potato' | 'Grapes'>('Tomato');
  const [activeHorizon, setActiveHorizon] = useState<'7day' | '30day' | 'historical'>('7day');

  const forecast = DEMAND_FORECAST_TOMATO;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-forest to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Supply & Demand Intelligence Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
            AI Demand Forecast
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Predict upcoming regional agricultural demand based on historical buyer orders, festival cycles, agro-climatic conditions, and forward commercial kitchen contracts.
          </p>
        </div>
      </div>

      {/* Crop Selector & Horizon Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Select Commodity:</span>
          {(['Tomato', 'Onion', 'Potato', 'Grapes'] as const).map(crop => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCrop === crop
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium mr-1">Forecast Horizon:</span>
          <button
            onClick={() => setActiveHorizon('7day')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeHorizon === '7day'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            7-Day Forecast
          </button>
          <button
            onClick={() => setActiveHorizon('30day')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeHorizon === '30day'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            30-Day Outlook
          </button>
          <button
            onClick={() => setActiveHorizon('historical')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              activeHorizon === 'historical'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Historical Pattern
          </button>
        </div>
      </div>

      {/* KPI Stats & Alert (Requirement 9) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-xs text-slate-400 font-medium">Expected Demand (7 Days)</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {forecast.expectedDemandKg.toLocaleString()} kg
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18% vs Last Week
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-xs text-slate-400 font-medium">Available Supply in Cluster</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {forecast.availableSupplyKg.toLocaleString()} kg
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            From 28 local verified farms
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-xs text-slate-400 font-medium">Regional Demand Status</div>
          <div className="text-2xl font-black text-red-600 mt-1">
            {forecast.demandStatus}
          </div>
          <div className="text-[11px] text-red-600 font-semibold mt-1">
            Deficit: 2,500 kg shortfall
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
          <div className="text-xs text-slate-400 font-medium">Expected Price Trend</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            ₹23 → ₹26/kg
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Favorable harvest timing
          </div>
        </div>
      </div>

      {/* Shortage Warning Banner (Requirement 9) */}
      {forecast.warningMessage && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm text-amber-950">
              Supply Shortage Alert: {forecast.warningMessage}
            </div>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              Buyers are actively booking advance harvest commitments. Farmers with crops reaching physiological maturity within 5–7 days are recommended to mark lots as "Ready for Harvest" to capture premium pricing corridors.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Charts Section (Requirement 9) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {activeHorizon === '7day' && '7-Day Expected Demand vs Supply Dynamics'}
                {activeHorizon === '30day' && '30-Day Monthly Macro Projected Curve'}
                {activeHorizon === 'historical' && 'Historical Demand vs Harvest Influx'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Quantity measured in kilograms (kg) for {selectedCrop}
              </p>
            </div>
            <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
              Updated Today
            </span>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {activeHorizon === '7day' ? (
                <BarChart data={forecast.sevenDayForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="expectedDemand" name="Expected Demand (kg)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expectedSupply" name="Available Supply (kg)" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : activeHorizon === '30day' ? (
                <AreaChart data={forecast.thirtyDayForecast}>
                  <defs>
                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="projectedDemand" name="Projected Demand (kg)" stroke="#2563eb" fillOpacity={1} fill="url(#colorDemand)" />
                  <Area type="monotone" dataKey="projectedSupply" name="Projected Supply (kg)" stroke="#16a34a" fillOpacity={1} fill="url(#colorSupply)" />
                </AreaChart>
              ) : (
                <LineChart data={forecast.historicalDemand}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="demand" name="Actual Demand (kg)" stroke="#2563eb" strokeWidth={2} />
                  <Line type="monotone" dataKey="supply" name="Market Supply (kg)" stroke="#16a34a" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Explanation & Price Trend (Requirement 9) */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Explanation Card */}
          <div className="bg-emerald-50/70 rounded-3xl border border-emerald-200 p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>AI Analytical Explanation</span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium">
              "{forecast.aiExplanation}"
            </p>
            <div className="pt-2 border-t border-emerald-200/80 space-y-2 text-[11px] text-slate-700">
              <div className="flex items-center justify-between">
                <span>Festival Demand Lift:</span>
                <span className="font-bold text-emerald-800">+12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hotel/Restaurant Forward Contracts:</span>
                <span className="font-bold text-emerald-800">4,200 kg confirmed</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Household Consumer Influx:</span>
                <span className="font-bold text-emerald-800">High search interest</span>
              </div>
            </div>
          </div>

          {/* Expected Price Trend Chart */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Expected Price Trend (₹/kg)
              </h4>
              <span className="text-[10px] text-emerald-700 font-bold">Rising</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecast.sevenDayForecast}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#f8fafc" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis domain={[20, 30]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="priceTrend" name="Expected Modal Rate (₹)" stroke="#d97706" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Requirement 9 Disclaimer */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>Platform Disclaimer:</strong> Forecasts are AI recommendations based on mathematical supply models and may differ from actual market conditions. Prices and volumes may fluctuate due to unpredicted weather events, mandi market arrivals, and broader macroeconomic shifts.
        </p>
      </div>
    </div>
  );
};
