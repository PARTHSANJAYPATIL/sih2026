import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QualityGrade } from '../../types';
import { 
  Warehouse, 
  Scale, 
  Award, 
  QrCode, 
  CheckCircle2, 
  Truck, 
  Clock, 
  Box, 
  FileCheck, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  Search,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CollectionCenterDashboard: React.FC = () => {
  const { 
    collectionCenters, 
    qcRecords, 
    recordQualityCheck, 
    currentUser, 
    orders 
  } = useApp();

  const center = collectionCenters[0];
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workflow' | 'qc-logs' | 'dispatch'>('dashboard');

  // Interactive 8-step workflow states for Requirement 20
  const [activeStep, setActiveStep] = useState<number>(1);
  const [scannedBatch, setScannedBatch] = useState({
    batchId: 'BATCH-TM-500',
    orderId: 'FM1025',
    farmerName: 'Ramesh Patil (Farmer A)',
    cropName: 'Tomato (Shivam Hybrid)',
    expectedWeightKg: 500,
    farmerBasePrice: 24
  });

  const [actualWeightKg, setActualWeightKg] = useState<number>(485);
  const [assignedGrade, setAssignedGrade] = useState<QualityGrade>('Grade A');
  const [defectPercentage, setDefectPercentage] = useState<number>(1.2);
  const [inspectorNotes, setInspectorNotes] = useState('Firm red fruit, zero bruising, moisture 88.5%, approved for Grade A.');
  const [isQcSaved, setIsQcSaved] = useState<boolean>(false);

  const calculatedFarmerPayout = actualWeightKg * scannedBatch.farmerBasePrice;

  const handleFinishQC = (e: React.FormEvent) => {
    e.preventDefault();

    recordQualityCheck({
      orderId: scannedBatch.orderId,
      cropName: scannedBatch.cropName,
      farmerName: scannedBatch.farmerName,
      expectedWeightKg: scannedBatch.expectedWeightKg,
      actualWeightKg,
      assignedGrade,
      moistureContent: '88.5%',
      defectPercentage,
      inspectorName: currentUser.name,
      status: 'Verified',
      adjustedFarmerPayout: calculatedFarmerPayout,
      notes: inspectorNotes
    });

    setIsQcSaved(true);
    setActiveStep(8); // jump to dispatch generation

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30 flex items-center gap-1">
              <Warehouse className="w-3.5 h-3.5" /> Certified Partner Collection & QC Hub
            </span>
            <span className="text-xs text-amber-200">Hub: {center.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Collection Center Operations
          </h1>
          <p className="text-amber-100 text-xs mt-1">
            Manager: {center.managerName} • Location: {center.location} • Total Capacity: {center.capacityKg.toLocaleString()} kg
          </p>
        </div>

        <button
          onClick={() => setActiveTab('workflow')}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <Scale className="w-4 h-4" />
          <span>Launch Intake & QC Terminal</span>
        </button>
      </div>

      {/* Sub-Tabs (Requirement 19) */}
      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-2 no-scrollbar text-xs font-semibold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'workflow' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          8-Step Intake & QC Terminal
        </button>
        <button
          onClick={() => setActiveTab('qc-logs')}
          className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
            activeTab === 'qc-logs' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Verified QC Records ({qcRecords.length})
        </button>
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW WITH 4 KEY METRICS (Requirement 19) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Today's expected produce: 3,500 kg */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold text-slate-500">Today's Expected Produce</span>
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700"><Clock className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{center.todaysExpectedKg.toLocaleString()} kg</div>
              <div className="text-[11px] text-amber-700 font-semibold mt-1">From 4 assigned farm routes</div>
            </div>

            {/* 2. Pending pickups: 12 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold text-slate-500">Pending Pickups</span>
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700"><Truck className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl font-black text-blue-700 mt-2">{center.pendingPickupsCount}</div>
              <div className="text-[11px] text-blue-600 font-semibold mt-1">Vehicles currently on route</div>
            </div>

            {/* 3. Produce received: 2,800 kg */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold text-slate-500">Produce Received</span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700"><CheckCircle2 className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl font-black text-emerald-800 mt-2">{center.todaysReceivedKg.toLocaleString()} kg</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">Weighed and graded</div>
            </div>

            {/* 4. Orders ready for dispatch: 8 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold text-slate-500">Ready for Dispatch</span>
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700"><Box className="w-4 h-4" /></div>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">{center.readyDispatchCount}</div>
              <div className="text-[11px] text-indigo-700 font-semibold mt-1">Consolidated for buyers</div>
            </div>
          </div>

          {/* Quick Intake Trigger Banner */}
          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-amber-950 text-base">
                Driver Rahul Patil (MH-10-AB-1234) Arrived at Gate 2
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Consignment: 500 kg Tomato (Farmer Ramesh Patil) ready for digital weigh-in and Grade A certification.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('workflow')}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <span>Process Gate Intake Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: STEP-BY-STEP INTAKE WORKFLOW (Requirement 20) */}
      {activeTab === 'workflow' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Requirement 20 SOP Workflow
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                8-Step Intake, Inspection & Aggregation Pipeline
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Active: Step {activeStep} of 8
            </span>
          </div>

          {/* Stepper bar */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-center text-[10px] font-bold">
            {[
              '1. Arrival',
              '2. Scan QR',
              '3. Weigh',
              '4. Inspect',
              '5. Grade',
              '6. Pack',
              '7. Combine',
              '8. Dispatch'
            ].map((stepLabel, idx) => {
              const isPast = idx + 1 < activeStep;
              const isCurr = idx + 1 === activeStep;
              return (
                <button
                  key={stepLabel}
                  onClick={() => setActiveStep(idx + 1)}
                  className={`p-2 rounded-xl transition-all ${
                    isCurr
                      ? 'bg-amber-600 text-white shadow-xs'
                      : isPast
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <div>{isPast ? '✓' : idx + 1}</div>
                  <div className="truncate">{stepLabel.split('. ')[1]}</div>
                </button>
              );
            })}
          </div>

          {/* WORKFLOW STEPS FORM & VERIFICATION INTERFACE */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-6">
            {/* Step 1 & 2: Vehicle Arrival & QR Scan */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Step 1 & 2: Vehicle Gate Arrival & Digital QR Intake</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Vehicle Number:</span>
                  <span className="font-mono font-bold text-slate-900">MH-10-AB-1234</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Farmer Origin:</span>
                  <span className="font-bold text-slate-900">{scannedBatch.farmerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Consignment Lot:</span>
                  <span className="font-semibold text-emerald-800">{scannedBatch.cropName}</span>
                </div>
              </div>
            </div>

            {/* Step 3, 4, 5: Weighing, Quality Inspection, and Grade Assignment */}
            <form onSubmit={handleFinishQC} className="space-y-4 text-xs">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>Step 3, 4 & 5: Weighing Scale & Quality Inspection (Requirement 20)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Expected vs Actual Weight (Requirement 20 Example: Expected 500kg, Actual 485kg) */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <label className="block font-bold text-slate-700">
                    Digital Scale Weight (kg) *
                  </label>
                  <input
                    type="number"
                    value={actualWeightKg}
                    onChange={(e) => setActualWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full text-lg font-black px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    required
                  />
                  <div className="text-[11px] text-slate-500">
                    Manifest Expected: <span className="font-semibold">{scannedBatch.expectedWeightKg} kg</span>
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold">
                    Discrepancy: -15 kg (3% transit moisture desiccation)
                  </div>
                </div>

                {/* Quality Grade Assignment */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <label className="block font-bold text-slate-700">
                    Assign Quality Grade *
                  </label>
                  <select
                    value={assignedGrade}
                    onChange={(e) => setAssignedGrade(e.target.value as QualityGrade)}
                    className="w-full text-xs font-bold px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-emerald-800"
                  >
                    <option value="Grade A">Grade A (Premium - Uniform 65mm, Firm)</option>
                    <option value="Grade B">Grade B (Commercial Table Use)</option>
                    <option value="Grade C">Grade C (Processing / Sauce Pulp)</option>
                  </select>
                  <div className="text-[11px] text-emerald-600 font-semibold">
                    Status: Verified Grade A
                  </div>
                </div>

                {/* Automated Adjusted Farmer Payout (Requirement 20) */}
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-emerald-900 font-bold block">
                    Auto-Adjusted Farmer Payout:
                  </span>
                  <div className="text-2xl font-black text-emerald-800">
                    ₹{calculatedFarmerPayout.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-700">
                    Calculation: {actualWeightKg} kg actual × ₹{scannedBatch.farmerBasePrice}/kg base
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Auto-synced with farmer wallet & escrow ledger
                  </div>
                </div>
              </div>

              {/* Inspector notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Inspector Observation Notes
                </label>
                <input
                  type="text"
                  value={inspectorNotes}
                  onChange={(e) => setInspectorNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                />
              </div>

              {/* Step 6, 7, 8: Packing & Dispatch Generation */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <Box className="w-4 h-4 text-indigo-600" />
                  <span>Step 6, 7 & 8: Sort, Pack, Aggregate & Generate Dispatch</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Produce lot sealed into 25 standardized food-safe crates with tamper-evident QR tags. Automatically combined into Order #FM1025 for Hotel ABC.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify QC & Issue Outbound Dispatch Tag</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: QC RECORDS LOGS */}
      {activeTab === 'qc-logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-subtle space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">
            Certified Quality Inspection Logs
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">QC Pass ID</th>
                  <th className="py-3 px-3">Produce / Lot</th>
                  <th className="py-3 px-3">Farmer</th>
                  <th className="py-3 px-3">Expected</th>
                  <th className="py-3 px-3">Actual Weighed</th>
                  <th className="py-3 px-3">Grade</th>
                  <th className="py-3 px-3">Adjusted Payout</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {qcRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{rec.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{rec.cropName}</td>
                    <td className="py-3 px-3 text-slate-600">{rec.farmerName}</td>
                    <td className="py-3 px-3 text-slate-500">{rec.expectedWeightKg} kg</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{rec.actualWeightKg} kg</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {rec.assignedGrade}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-emerald-800">
                      ₹{rec.adjustedFarmerPayout.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
