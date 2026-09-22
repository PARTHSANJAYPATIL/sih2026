import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  ScanLine, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Scale, 
  Award, 
  Building, 
  Hash,
  Download
} from 'lucide-react';

export interface QRDataPayload {
  type: 'Produce Batch' | 'Order' | 'Farmer' | 'Collection Center';
  title: string;
  productName?: string;
  farmerName?: string;
  fpoName?: string;
  orderNumber?: string;
  harvestDate?: string;
  quantityKg?: number | string;
  qualityGrade?: string;
  collectionCenter?: string;
  location?: string;
  qrHash?: string;
}

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: QRDataPayload | null;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, payload }) => {
  const [activeTab, setActiveTab] = useState<'view' | 'inspect'>('view');

  if (!isOpen || !payload) return null;

  const qrHash = payload.qrHash || `F2M-QR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-sm tracking-wide">
              {payload.type} Digital QR Pass
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch: View QR vs Inspect details */}
        <div className="flex border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-2.5 font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'view'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Generate QR</span>
          </button>
          <button
            onClick={() => setActiveTab('inspect')}
            className={`flex-1 py-2.5 font-medium border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'inspect'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Scanned Inspector View</span>
          </button>
        </div>

        {activeTab === 'view' ? (
          <div className="p-6 text-center">
            {/* Visual SVG QR representation */}
            <div className="inline-block p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-inner mb-4 relative">
              <svg 
                className="w-48 h-48 mx-auto" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer corners */}
                <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f392b" />
                <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                <rect x="13" y="13" width="10" height="10" rx="1" fill="#16a34a" />

                <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f392b" />
                <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                <rect x="77" y="13" width="10" height="10" rx="1" fill="#16a34a" />

                <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f392b" />
                <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                <rect x="13" y="77" width="10" height="10" rx="1" fill="#16a34a" />

                {/* Matrix Pattern modules */}
                <rect x="36" y="8" width="8" height="4" fill="#0f392b" />
                <rect x="50" y="8" width="10" height="4" fill="#0f392b" />
                <rect x="36" y="16" width="6" height="6" fill="#16a34a" />
                <rect x="46" y="16" width="12" height="4" fill="#0f392b" />
                <rect x="36" y="24" width="20" height="4" fill="#0f392b" />

                <rect x="8" y="36" width="4" height="12" fill="#0f392b" />
                <rect x="16" y="36" width="12" height="6" fill="#0f392b" />
                <rect x="8" y="52" width="18" height="6" fill="#16a34a" />

                {/* Center QR Logo */}
                <circle cx="50" cy="50" r="14" fill="#15803d" />
                <circle cx="50" cy="50" r="11" fill="white" />
                <path d="M46 45L50 42L54 45V53L50 56L46 53V45Z" fill="#15803d" />

                {/* Bottom right modules */}
                <rect x="68" y="36" width="16" height="6" fill="#0f392b" />
                <rect x="88" y="36" width="6" height="6" fill="#16a34a" />
                <rect x="68" y="46" width="10" height="10" fill="#0f392b" />
                <rect x="82" y="50" width="12" height="6" fill="#0f392b" />

                <rect x="36" y="68" width="6" height="18" fill="#0f392b" />
                <rect x="46" y="68" width="16" height="6" fill="#0f392b" />
                <rect x="46" y="78" width="12" height="12" fill="#16a34a" />
                <rect x="64" y="68" width="6" height="8" fill="#0f392b" />
                <rect x="74" y="72" width="18" height="6" fill="#0f392b" />
                <rect x="64" y="82" width="28" height="8" fill="#0f392b" />
              </svg>
              <div className="text-[10px] font-mono text-slate-500 mt-1">{qrHash}</div>
            </div>

            <div className="text-sm font-bold text-slate-900 mb-1">{payload.title}</div>
            <div className="text-xs text-slate-500 mb-4">
              Authorized farm-to-hub traceability token. Scan with driver or collection center scanner.
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setActiveTab('inspect')}
                className="text-xs px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <ScanLine className="w-3.5 h-3.5" />
                Simulate Scan
              </button>
              <button
                onClick={() => alert(`QR Code pass ${qrHash} downloaded as verified digital label.`)}
                className="text-xs px-3 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Save Label
              </button>
            </div>
          </div>
        ) : (
          /* Scanned Inspector View fulfilling Requirement 28 */
          <div className="p-5 space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 text-emerald-900 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cryptographically Verified Traceability Record</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2.5 text-xs">
              {payload.productName && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Product:</span>
                  <span className="font-bold text-slate-900">{payload.productName}</span>
                </div>
              )}

              {payload.farmerName && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Farmer / FPO:</span>
                  <span className="font-semibold text-slate-800">
                    {payload.farmerName} {payload.fpoName ? `(${payload.fpoName})` : ''}
                  </span>
                </div>
              )}

              {payload.orderNumber && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Order Number:
                  </span>
                  <span className="font-mono font-bold text-emerald-700">#{payload.orderNumber}</span>
                </div>
              )}

              {payload.harvestDate && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Harvest Date:
                  </span>
                  <span className="font-medium text-slate-800">{payload.harvestDate}</span>
                </div>
              )}

              {payload.quantityKg !== undefined && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Scale className="w-3 h-3" /> Batch Quantity:
                  </span>
                  <span className="font-bold text-slate-900">{payload.quantityKg} kg</span>
                </div>
              )}

              {payload.qualityGrade && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Quality Grade:
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {payload.qualityGrade}
                  </span>
                </div>
              )}

              {payload.collectionCenter && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Building className="w-3 h-3" /> Collection Center:
                  </span>
                  <span className="font-medium text-slate-800">{payload.collectionCenter}</span>
                </div>
              )}

              {payload.location && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Farm Origin:
                  </span>
                  <span className="font-medium text-slate-800">{payload.location}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('view')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors"
            >
              Back to QR Visual
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
