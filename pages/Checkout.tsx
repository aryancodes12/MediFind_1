import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, Truck, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const { cartTotal, cartCount, items, clearCart } = useCart();

  const deliveryFee = items.length > 0 ? 40 : 0;
  const finalTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = () => {
    // Simulate order placement
    clearCart();
    navigate('/orders');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 font-medium">
          <ArrowLeft size={18} /> Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Address Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">1</div>
                Delivery Address
              </h2>

              <div className="space-y-4">
                <div className="border border-primary-200 bg-primary-50 rounded-xl p-4 relative cursor-pointer ring-1 ring-primary-500">
                  <div className="absolute top-4 right-4 text-primary-600"><CheckCircle size={20} fill="currentColor" className="text-white" /></div>
                  <h3 className="font-bold text-slate-900 mb-1">Home</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Flat 402, Krishna Heights, JP Road<br />
                    Near Bhavan's College, Andheri West<br />
                    Mumbai, 400058
                  </p>
                  <p className="text-slate-600 text-sm mt-2 font-medium">Phone: +91 98765 43210</p>
                </div>

                <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-all">
                  + Add New Address
                </button>
              </div>
            </motion.div>

            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">2</div>
                Payment Method
              </h2>

              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-slate-600">
                    <span className="font-bold text-xs">UPI</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-slate-900">UPI (GPay, PhonePe, Paytm)</h3>
                    <p className="text-xs text-slate-500">Instant payment</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-primary-600 bg-primary-600' : 'border-slate-300'}`}>
                    {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-slate-600">
                    <CreditCard size={20} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-slate-900">Credit / Debit Card</h3>
                    <p className="text-xs text-slate-500">Visa, Mastercard, RuPay</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary-600 bg-primary-600' : 'border-slate-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-slate-600">
                    <Banknote size={20} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-slate-900">Cash on Delivery</h3>
                    <p className="text-xs text-slate-500">Pay when you receive</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary-600 bg-primary-600' : 'border-slate-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Price Details</h3>
              <div className="space-y-3 text-sm mb-6 pb-6 border-b border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Items ({cartCount})</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges</span>
                  <span>₹{deliveryFee}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-slate-900 text-lg">Total Pay</span>
                <span className="font-bold text-slate-900 text-2xl">₹{finalTotal}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2"
              >
                Place Order
              </button>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 justify-center">
                <Truck size={14} />
                <span>Delivery by <strong>Today, 4:00 PM</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};