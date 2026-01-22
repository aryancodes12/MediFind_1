import React, { useState, useEffect } from 'react';
import { Medicine } from '../types';
import { MapPin, Clock, AlertCircle, CheckCircle, Info, ShoppingCart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useSeniorMode } from './Layout';

interface MedicineCardProps {
  medicine: Medicine;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const [isReserved, setIsReserved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const { addToCart } = useCart();
  const { isSeniorMode } = useSeniorMode();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    let timer: number;
    if (isReserved && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isReserved, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddToCart = () => {
    addToCart(medicine);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-secondary-600 bg-secondary-50 border-secondary-100';
      case 'Limited Stock': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Out of Stock': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 flex flex-col h-full relative overflow-hidden group"
    >
      {/* Medicine Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {medicine.isPrescriptionRequired && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <AlertCircle size={12} className="text-primary-500" />
            <span className="text-[10px] font-semibold text-primary-600">Rx Required</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Top Banner for Status */}
        <div className="flex justify-between items-start mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${getStatusColor(medicine.availability)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${medicine.availability === 'In Stock' ? 'bg-secondary-500' : medicine.availability === 'Limited Stock' ? 'bg-amber-500' : 'bg-red-500'} animate-pulse`} />
            {medicine.availability}
          </span>
        </div>

        {/* Main Info */}
        <div className="mb-4 flex-grow">
          <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{medicine.name}</h3>
          <p className="text-sm text-slate-500 font-medium mb-2">{medicine.brand} • {medicine.dosage}</p>
          <p className="text-xs text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded">{medicine.category}</p>
        </div>

        {/* Pharmacy Info */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <MapPin size={14} className="text-primary-500" />
            <span className="truncate">{medicine.pharmacyName} <span className="text-slate-400">({medicine.distance})</span></span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock size={14} className="text-primary-500" />
            <span>Delivery in <span className="font-semibold text-slate-700">{medicine.deliveryTime}</span></span>
          </div>
        </div>

        {/* Footer / Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto gap-2">
          <div className="flex-grow">
            <span className="text-xs text-slate-400 block mb-0.5">Price</span>
            <span className="text-lg font-bold text-slate-900">{medicine.currency}{medicine.price}</span>
          </div>

          {medicine.availability === 'Out of Stock' ? (
            <button disabled className="bg-slate-100 text-slate-500 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide cursor-not-allowed border border-slate-200">
              Unavailable
            </button>
          ) : isReserved ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-end"
            >
              <button
                onClick={() => setIsReserved(false)}
                className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 border border-amber-200"
              >
                <CheckCircle size={16} />
                Reserved
              </button>
              <span className="text-xs text-amber-600 font-mono mt-1 tabular-nums animate-pulse">
                Exp: {formatTime(timeLeft)}
              </span>
            </motion.div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className={`p-2.5 rounded-lg transition-all duration-300 border ${isAdded ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-700 border-slate-200 hover:border-primary-500 hover:text-primary-600'} ${isSeniorMode ? 'px-4' : ''}`}
                title="Add to Cart"
              >
                {isAdded ? <CheckCircle size={20} /> : (isSeniorMode ? <span className="font-bold">Add</span> : <ShoppingCart size={20} />)}
              </button>
              <button
                onClick={() => setIsReserved(true)}
                className="bg-primary-600 text-white hover:bg-primary-700 border border-transparent px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Reserve
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};