import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProduceListing, QualityGrade } from '../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ShoppingCart, 
  Eye, 
  X, 
  Info, 
  Plus, 
  Minus, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MarketplaceProps {
  onOpenCart: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onOpenCart }) => {
  const { produceListings, addToCart, cart } = useApp();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(150);

  // Modal inspection state
  const [selectedProduct, setSelectedProduct] = useState<ProduceListing | null>(null);
  const [modalQuantity, setModalQuantity] = useState<number>(5);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains & Pulses', 'Commercial Crops', 'Spices'];
  const locations = ['All', 'Sangli', 'Kolhapur', 'Pune', 'Satara', 'Nashik'];
  const grades = ['All', 'Grade A', 'Grade B', 'Grade C'];

  const filteredProduce = produceListings.filter(item => {
    const matchesSearch = item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || item.location === selectedLocation;
    const matchesGrade = selectedGrade === 'All' || item.qualityGrade === selectedGrade;
    const matchesOrganic = !organicOnly || item.organic;
    const matchesPrice = item.farmerPrice <= maxPrice;

    return matchesSearch && matchesCategory && matchesLocation && matchesGrade && matchesOrganic && matchesPrice;
  });

  const handleOpenModal = (product: ProduceListing) => {
    setSelectedProduct(product);
    setModalQuantity(product.category === 'Vegetables' || product.category === 'Fruits' ? 5 : 25);
  };

  const handleAddToCart = (product: ProduceListing, qty: number) => {
    addToCart(product, qty);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-forest to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-2.5 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
            Direct Farm-Gate Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
            Fresh Produce Catalog
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Source directly from verified farmers and FPOs in Maharashtra. Every listing includes transparent cost breakdown, certified quality grading, and farm-gate harvest scheduling.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-subtle space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crop, variety, or farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Location */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>Location: {loc}</option>
              ))}
            </select>
          </div>

          {/* Quality Grade */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {grades.map(g => (
                <option key={g} value={g}>Quality: {g}</option>
              ))}
            </select>
          </div>

          {/* Price & Organic Toggle */}
          <div className="flex items-center justify-between gap-3 px-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Organic Only</span>
            </label>

            <div className="text-xs text-slate-500 font-medium">
              Max: <span className="font-bold text-slate-800">₹{maxPrice}/kg</span>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pt-2 border-t border-slate-100 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid (Requirement 11) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold text-slate-600">
            Showing <span className="text-emerald-700 font-extrabold">{filteredProduce.length}</span> verified produce batches
          </div>
          <span className="text-xs text-slate-400">Prices quoted at farm-gate base</span>
        </div>

        {filteredProduce.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <p className="text-base font-semibold text-slate-600">No produce listings found matching your filters.</p>
            <p className="text-xs mt-1">Try resetting the location or price filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProduce.map(item => {
              // Calculate estimated consumer price: farmer + ₹1 collection + ₹2 transport + ₹1 platform
              const estConsumerPrice = item.farmerPrice + 1 + 2 + 1;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-subtle hover:shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Image & Tags */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.cropName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-emerald-900 shadow-xs backdrop-blur-xs flex items-center gap-1">
                          <Award className="w-3 h-3 text-emerald-600" />
                          {item.qualityGrade}
                        </span>
                        {item.organic && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                            Organic
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-medium backdrop-blur-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {item.location}
                      </div>

                      {item.verified && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold shadow-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between">
                          <span>{item.cropName}</span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ₹{item.farmerPrice}/kg
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{item.variety}</p>
                      </div>

                      <div className="text-xs text-slate-600">
                        <span className="text-slate-400">Farmer:</span>{' '}
                        <span className="font-semibold text-slate-800">{item.farmerName}</span>
                        {item.fpoName && <span className="text-slate-400"> ({item.fpoName})</span>}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          <span>Harvest: {item.expectedHarvestDate}</span>
                        </div>
                        <div className="font-semibold text-slate-700">
                          {item.availableQuantity} {item.unit} avail
                        </div>
                      </div>

                      {/* Transparent Price Preview */}
                      <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[11px] flex items-center justify-between">
                        <span className="text-slate-500">Est. Delivered Price:</span>
                        <span className="font-bold text-emerald-800">₹{estConsumerPrice}/kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => {
                        addToCart(item, 5);
                        onOpenCart();
                      }}
                      className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Buy Now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PRODUCT DETAILS MODAL (Requirement 12) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative h-64 bg-slate-100">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.cropName}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-900 shadow-md">
                  {selectedProduct.qualityGrade}
                </span>
                {selectedProduct.organic && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md">
                    100% Certified Organic
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900">
                    {selectedProduct.cropName}
                  </h2>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Farmer Base Price</span>
                    <div className="text-xl font-black text-emerald-700">
                      ₹{selectedProduct.farmerPrice}/kg
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedProduct.variety}</p>
              </div>

              {/* Farmer Info Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Farmer: {selectedProduct.farmerName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    FPO: {selectedProduct.fpoName || 'Sahyadri Farmers Producer Co.'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-500 flex items-center gap-1 justify-end">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{selectedProduct.location}, Maharashtra</span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-1 justify-end mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Harvest: {selectedProduct.expectedHarvestDate}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Produce Quality Description
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* TRANSPARENT PRICE BREAKDOWN (Requirement 12) */}
              <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-700" />
                    Transparent Price Breakdown
                  </h4>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                    100% Itemized
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-emerald-100">
                    <span className="text-slate-600">Farmer Selling Price (Base Realization):</span>
                    <span className="font-bold text-slate-900">₹{selectedProduct.farmerPrice}/kg</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-100">
                    <span className="text-slate-600">Partner Collection & Quality Handling:</span>
                    <span className="font-semibold text-slate-700">₹1/kg</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-100">
                    <span className="text-slate-600">Optimized Farm-Gate Transport & Cold-Chain:</span>
                    <span className="font-semibold text-slate-700">₹2/kg</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-100">
                    <span className="text-slate-600">Platform AI Coordination & Escrow:</span>
                    <span className="font-semibold text-slate-700">₹1/kg</span>
                  </div>
                  <div className="flex justify-between pt-2 text-sm font-black text-emerald-950">
                    <span>Estimated Delivered Customer Price:</span>
                    <span>₹{selectedProduct.farmerPrice + 1 + 2 + 1}/kg</span>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-800/80 italic flex items-center gap-1 pt-1">
                  <Info className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>The exact final amount can vary slightly depending on delivery distance, quantity, and destination logistics hub.</span>
                </div>
              </div>

              {/* Quantity Picker & Action */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Quantity (kg):</span>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setModalQuantity(prev => Math.max(1, prev - 5))}
                      className="p-2 hover:bg-slate-100 text-slate-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900">
                      {modalQuantity}
                    </span>
                    <button
                      onClick={() => setModalQuantity(prev => prev + 5)}
                      className="p-2 hover:bg-slate-100 text-slate-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct, modalQuantity);
                      setSelectedProduct(null);
                    }}
                    className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct, modalQuantity);
                      setSelectedProduct(null);
                      onOpenCart();
                    }}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Proceed to Order (₹{(selectedProduct.farmerPrice + 4) * modalQuantity})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
