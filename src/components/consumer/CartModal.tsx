import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Clock, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle2, 
  DollarSign, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOrderTracking: (orderId: string) => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onViewOrderTracking }) => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, currentUser, addOrder } = useApp();
  
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Green Meadows, Paud Road, Kothrud, Pune');
  const [deliverySlot, setDeliverySlot] = useState('05:00 PM – 07:00 PM (Today Evening)');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('pooja@okhdfcbank');
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  if (!isOpen) return null;

  // Financial calculations
  const farmerSubtotal = cart.reduce((acc, item) => acc + (item.listing.farmerPrice * item.quantityKg), 0);
  const totalKg = cart.reduce((acc, item) => acc + item.quantityKg, 0);
  const collectionHandlingFee = totalKg * 1;
  const transportLogisticsFee = totalKg * 2;
  const platformServiceFee = totalKg * 1;
  const totalAmount = farmerSubtotal + collectionHandlingFee + transportLogisticsFee + platformServiceFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const orderItems = cart.map(item => ({
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      listingId: item.listing.id,
      cropName: item.listing.cropName,
      quantity: item.quantityKg,
      farmerPrice: item.listing.farmerPrice,
      unitPrice: item.listing.farmerPrice + 4,
      totalPrice: (item.listing.farmerPrice + 4) * item.quantityKg,
      imageUrl: item.listing.imageUrl
    }));

    const orderId = addOrder({
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerType: currentUser.role === 'bulk_buyer' ? 'bulk_buyer' : 'consumer',
      buyerPhone: currentUser.phone,
      deliveryAddress,
      deliveryCity: 'Pune',
      deliverySlot,
      status: 'Created',
      estimatedDeliveryDate: '2026-09-21',
      items: orderItems,
      farmerSubtotal,
      collectionHandlingFee,
      transportLogisticsFee,
      platformServiceFee,
      totalAmount,
      paymentMethod,
      paymentStatus: 'Paid',
      assignedDriverId: 'user-driver',
      assignedVehicleNumber: 'MH-10-AB-1234',
      collectionCenterId: 'cc-sangli-1'
    });

    setCreatedOrderId(orderId);
    setStep('success');

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleClose = () => {
    setStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-forest p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {step === 'cart' && 'Your Produce Cart'}
                {step === 'checkout' && 'Checkout & Transparent Settlement'}
                {step === 'success' && 'Order Placed Successfully!'}
              </h3>
              <p className="text-xs text-emerald-200">
                {step === 'cart' && `${cart.length} item(s) • Total ${totalKg} kg fresh produce`}
                {step === 'checkout' && 'Review farm breakdown and simulated payment'}
                {step === 'success' && `Order #${createdOrderId} is entering the harvest & pickup pipeline`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-sm font-semibold">Your cart is empty.</p>
                  <p className="text-xs mt-1">Explore our fresh produce marketplace to add items.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div
                      key={item.listing.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 gap-3"
                    >
                      <img
                        src={item.listing.imageUrl}
                        alt={item.listing.cropName}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">
                          {item.listing.cropName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          ₹{item.listing.farmerPrice + 4}/kg (Delivered)
                        </div>
                        <div className="text-[10px] text-emerald-700 font-semibold">
                          Farmer: {item.listing.farmerName} ({item.listing.location})
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 border border-slate-300 rounded-xl bg-white px-2 py-1">
                        <button
                          onClick={() => updateCartQuantity(item.listing.id, item.quantityKg - 1)}
                          className="text-slate-500 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5 text-slate-800">
                          {item.quantityKg} kg
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.listing.id, item.quantityKg + 1)}
                          className="text-slate-500 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-slate-900">
                          ₹{(item.listing.farmerPrice + 4) * item.quantityKg}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.listing.id)}
                          className="text-red-500 hover:text-red-700 text-[10px] flex items-center gap-0.5 mt-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Summary Box */}
                  <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Total Produce Volume:</span>
                      <span className="font-bold text-slate-900">{totalKg} kg</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Direct Farmer Share (Base):</span>
                      <span className="font-bold text-slate-900">₹{farmerSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Collection, Cold Chain & Logistics:</span>
                      <span className="font-bold text-slate-900">₹{collectionHandlingFee + transportLogisticsFee + platformServiceFee}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-emerald-950 pt-2 border-t border-emerald-200">
                      <span>Total Payable:</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              {/* Delivery Info */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Delivery Address</label>
                <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-transparent text-xs focus:outline-hidden text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Delivery Slot */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Preferred Delivery Slot</label>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <select
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="w-full bg-transparent text-xs focus:outline-hidden text-slate-800"
                  >
                    <option value="05:00 PM – 07:00 PM (Today Evening)">05:00 PM – 07:00 PM (Today Evening)</option>
                    <option value="07:00 AM – 09:00 AM (Tomorrow Morning)">07:00 AM – 09:00 AM (Tomorrow Morning)</option>
                    <option value="11:00 AM – 01:00 PM (Tomorrow Midday)">11:00 AM – 01:00 PM (Tomorrow Midday)</option>
                  </select>
                </div>
              </div>

              {/* Payment Methods (Requirement 30) */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Simulated Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>UPI (Instant)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'Card'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Credit / Debit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-amber-600" />
                    <span>Pay on Delivery</span>
                  </button>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block mb-1">Simulated UPI VPA Handle:</span>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full text-xs font-mono px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Price Breakdown confirmation */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Farmer Realization (85.7%):</span>
                  <span className="font-bold text-slate-900">₹{farmerSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Collection & Handling:</span>
                  <span>₹{collectionHandlingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cluster Route Logistics:</span>
                  <span>₹{transportLogisticsFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform AI & Escrow:</span>
                  <span>₹{platformServiceFee}</span>
                </div>
                <div className="flex justify-between pt-1.5 font-black text-sm text-emerald-950 border-t border-emerald-200">
                  <span>Total Amount Paid:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize Simulated Payment of ₹{totalAmount}</span>
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  Payment Successful & Order Confirmed!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Order <span className="font-mono font-bold text-emerald-700">#{createdOrderId}</span> has been broadcasted to the assigned farmer and local collection center.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Delivery Slot:</span>
                  <span className="font-semibold text-slate-800">{deliverySlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Escrow Security:</span>
                  <span className="text-emerald-700 font-semibold">Funds locked in escrow until hub QC verification</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Logistics:</span>
                  <span className="font-semibold text-slate-800">Partner Driver Rahul Patil (MH-10)</span>
                </div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    onViewOrderTracking(createdOrderId);
                  }}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <span>Track Live Order Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions for step 1 */}
        {step === 'cart' && cart.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[10px] text-slate-400">Total Price</span>
              <div className="text-base font-black text-slate-900">₹{totalAmount}</div>
            </div>
            <button
              onClick={() => setStep('checkout')}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
