import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QualityGrade } from '../../types';
import { 
  Sprout, 
  Upload, 
  Calendar, 
  MapPin, 
  Award, 
  DollarSign, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddProduceFormProps {
  onBackToDashboard: () => void;
}

export const AddProduceForm: React.FC<AddProduceFormProps> = ({ onBackToDashboard }) => {
  const { addProduce, currentUser } = useApp();

  const [cropName, setCropName] = useState('Tomato');
  const [category, setCategory] = useState<'Vegetables' | 'Fruits' | 'Grains & Pulses' | 'Commercial Crops' | 'Spices'>('Vegetables');
  const [variety, setVariety] = useState('Shivam Hybrid');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState('kg');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('25 Sept');
  const [location, setLocation] = useState('Sangli');
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('Grade A');
  const [farmerPrice, setFarmerPrice] = useState<number>(24);
  const [organic, setOrganic] = useState<boolean>(true);
  const [description, setDescription] = useState('Farm-fresh harvest from Miraj red-soil plot. High firmness, optimal Brix, pesticide-free in last 25 days.');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80');
  const [isSuccess, setIsSuccess] = useState(false);

  const presetImages: { label: string; url: string }[] = [
    { label: 'Tomato', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80' },
    { label: 'Onion', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80' },
    { label: 'Potato', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80' },
    { label: 'Grapes', url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&auto=format&fit=crop&q=80' },
    { label: 'Wheat', url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addProduce({
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      fpoName: currentUser.fpoName || 'Sahyadri Farmers Producer Co.',
      cropName,
      category,
      variety,
      quantity,
      availableQuantity: quantity,
      unit,
      expectedHarvestDate,
      harvestStatus: 'Growing',
      location,
      qualityGrade,
      farmerPrice,
      marketRefPrice: farmerPrice - 1,
      aiSuggestedMin: Math.max(10, farmerPrice - 2),
      aiSuggestedMax: farmerPrice + 2,
      organic,
      description,
      imageUrl,
      verified: true
    });

    setIsSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={onBackToDashboard}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Farmer Dashboard</span>
      </button>

      {/* Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-forest p-6 sm:p-8 rounded-3xl text-white shadow-elevated">
        <span className="px-2.5 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
          Pre-Harvest Produce Registration
        </span>
        <h1 className="text-2xl sm:text-3xl font-black mt-2">
          List Your Upcoming Produce
        </h1>
        <p className="text-emerald-100 text-xs mt-1 max-w-xl">
          Enter your crop details to receive forward buyer allocations, schedule farm-gate collection, and unlock fair price discovery.
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4 shadow-subtle animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Produce Batch Successfully Listed!
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your {quantity} {unit} of {cropName} ({variety}) is now visible to verified commercial buyers and local consumers. A digital QR batch pass has been generated.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setIsSuccess(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
            >
              List Another Crop
            </button>
            <button
              onClick={onBackToDashboard}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              View in My Crops
            </button>
          </div>
        </div>
      ) : (
        /* The Add Produce Form (Requirement 8) */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Crop Name */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Crop / Product Name *
              </label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Tomato, Onion, Potato"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains & Pulses">Grains & Pulses</option>
                <option value="Commercial Crops">Commercial Crops</option>
                <option value="Spices">Spices</option>
              </select>
            </div>

            {/* Variety */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Cultivar / Variety *
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Shivam Hybrid, Nashik Garva"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="tonne">tonne</option>
                </select>
              </div>
            </div>

            {/* Expected Harvest Date */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Expected Harvest Date *
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
                <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                <input
                  type="text"
                  value={expectedHarvestDate}
                  onChange={(e) => setExpectedHarvestDate(e.target.value)}
                  placeholder="e.g. 25 Sept"
                  className="w-full bg-transparent focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Farm Origin Location *
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent focus:outline-hidden"
                >
                  <option value="Sangli">Sangli, Maharashtra</option>
                  <option value="Kolhapur">Kolhapur, Maharashtra</option>
                  <option value="Pune">Pune, Maharashtra</option>
                  <option value="Satara">Satara, Maharashtra</option>
                  <option value="Nashik">Nashik, Maharashtra</option>
                </select>
              </div>
            </div>

            {/* Quality Grade */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Quality Grade *
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                  className="w-full bg-transparent focus:outline-hidden font-semibold"
                >
                  <option value="Grade A">Grade A (Premium, uniform size, export quality)</option>
                  <option value="Grade B">Grade B (Standard commercial, minor blemishes)</option>
                  <option value="Grade C">Grade C (Processing grade for puree/pulp)</option>
                </select>
              </div>
            </div>

            {/* Expected Price */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Farmer Selling Price (₹/{unit}) *
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
                <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                <input
                  type="number"
                  step="0.5"
                  value={farmerPrice}
                  onChange={(e) => setFarmerPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent focus:outline-hidden font-bold text-slate-900"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                AI suggested corridor for this crop: ₹22–₹26/kg
              </span>
            </div>
          </div>

          {/* Organic Toggle */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800">100% Organic Certified?</div>
              <div className="text-slate-500 text-[11px]">Zero synthetic chemical sprays in previous 30 days</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={organic}
                onChange={(e) => setOrganic(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Photo Preset Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Select Batch Photo / Image
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {presetImages.map(p => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => setImageUrl(p.url)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                    imageUrl === p.url
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.label} Photo
                </button>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-[11px] font-mono"
              placeholder="Or enter image URL"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Description & Quality Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          {/* Submit Button (Requirement 8) */}
          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Sprout className="w-4 h-4" />
            <span>List Produce on Marketplace</span>
          </button>
        </form>
      )}
    </div>
  );
};
