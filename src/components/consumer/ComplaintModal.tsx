import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint } from '../../types';
import { X, AlertCircle, ShieldAlert, CheckCircle2, Send } from 'lucide-react';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ isOpen, onClose, orderId }) => {
  const { addComplaint, currentUser } = useApp();
  const [category, setCategory] = useState<Complaint['category']>('Damaged produce');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addComplaint({
      orderId: orderId || 'FM1024',
      reporterName: currentUser.name,
      reporterRole: currentUser.role === 'farmer' ? 'farmer' : currentUser.role === 'bulk_buyer' ? 'bulk_buyer' : 'consumer',
      reporterPhone: currentUser.phone,
      category,
      description
    });
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-red-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-200" />
            <h3 className="font-bold text-sm sm:text-base">
              Report Quality Issue / Delivery Dispute
            </h3>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Dispute Ticket Registered
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your report for Order #{orderId} has been escalated to the Collection Hub Quality Inspector and Admin for immediate review and resolution.
            </p>
            <button
              onClick={handleClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Referenced Order ID
              </label>
              <input
                type="text"
                value={orderId}
                disabled
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-mono text-slate-600 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Dispute Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Complaint['category'])}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500 font-medium"
              >
                <option value="Damaged produce">Damaged produce (Transit bruising / crushed)</option>
                <option value="Wrong quantity">Wrong quantity (Weight discrepancy)</option>
                <option value="Poor quality">Poor quality (Not matching certified grade)</option>
                <option value="Late delivery">Late delivery (Exceeded delivery window)</option>
                <option value="Missing item">Missing item (Incomplete package)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Detailed Description of Quality Issue
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue observed (e.g. 1 kg crushed tomatoes in bottom crate)..."
                required
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500 leading-relaxed"
              />
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-normal">
              <strong>Escrow Protection Note:</strong> Payments are held safely in escrow. If quality discrepancies are verified by the collection hub, an automated refund credit or replacement lot will be issued.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Dispute Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
