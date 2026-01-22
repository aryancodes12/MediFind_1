import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, ExternalLink, Search, Bell,
  Package, History, FileText, Settings, User, QrCode,
  Truck, CheckCircle, Timer, Building2, X, Trash2, AlertCircle,
  Plus, Pill, UserCog, Shield, Phone, ArrowLeft, Home,
  Camera, PhoneCall, Info, Navigation, Upload
} from 'lucide-react';

// Types
interface Order {
  id: string;
  status: 'reserved' | 'ready' | 'delivery' | 'completed' | 'cancelled';
  medicineName: string;
  genericName: string;
  quantity: number;
  unit: string;
  pharmacyName: string;
  pharmacyAddress: string;
  reservationExpiry?: number;
  estimatedArrival?: string;
  image?: string;
  date?: string;
}

interface Prescription {
  id: string;
  doctorName: string;
  date: string;
  medicines: string[];
  status: 'active' | 'expired';
  refillsLeft: number;
}

// Demo data with Indian names
const DEMO_ORDERS: Order[] = [
  {
    id: 'ORD-8821',
    status: 'reserved',
    medicineName: 'Metformin 500mg',
    genericName: 'Glycomet',
    quantity: 30,
    unit: 'Tablets',
    pharmacyName: 'Apollo Pharmacy, Andheri West',
    pharmacyAddress: 'Shop 4, Lokhandwala Complex, Mumbai',
    reservationExpiry: 45 * 60,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop'
  },
  {
    id: 'ORD-9932',
    status: 'ready',
    medicineName: 'Telmisartan 40mg',
    genericName: 'Telma',
    quantity: 30,
    unit: 'Tablets',
    pharmacyName: 'Noble Chemists, Bandra',
    pharmacyAddress: 'Hill Road, Bandra West, Mumbai',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=100&h=100&fit=crop'
  },
  {
    id: 'DEL-4421',
    status: 'delivery',
    medicineName: 'Lisinopril 10mg',
    genericName: 'Listril',
    quantity: 30,
    unit: 'Tablets',
    pharmacyName: 'MedPlus, Juhu',
    pharmacyAddress: 'Juhu Tara Road, Mumbai',
    estimatedArrival: '2:15 PM',
    image: 'https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=100&h=100&fit=crop'
  }
];

const DEMO_ORDER_HISTORY: Order[] = [
  {
    id: 'ORD-7612',
    status: 'completed',
    medicineName: 'Omeprazole 20mg',
    genericName: 'Omez',
    quantity: 30,
    unit: 'Tablets',
    pharmacyName: 'Apollo Pharmacy, Andheri West',
    pharmacyAddress: 'Lokhandwala Complex, Mumbai',
    date: 'Jan 15, 2026'
  },
  {
    id: 'ORD-6543',
    status: 'completed',
    medicineName: 'Amlodipine 5mg',
    genericName: 'Amlong',
    quantity: 30,
    unit: 'Tablets',
    pharmacyName: 'Noble Chemists, Bandra',
    pharmacyAddress: 'Hill Road, Bandra West, Mumbai',
    date: 'Jan 10, 2026'
  },
  {
    id: 'ORD-5234',
    status: 'cancelled',
    medicineName: 'Atorvastatin 20mg',
    genericName: 'Atorva',
    quantity: 30,
    unit: 'Tablets',
    pharmacyName: 'Wellness Forever, Versova',
    pharmacyAddress: 'Versova Link Road, Mumbai',
    date: 'Jan 5, 2026'
  }
];

const DEMO_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-001',
    doctorName: 'Dr. Priya Sharma',
    date: 'Dec 20, 2025',
    medicines: ['Metformin 500mg', 'Atorvastatin 20mg'],
    status: 'active',
    refillsLeft: 3
  },
  {
    id: 'RX-002',
    doctorName: 'Dr. Rajesh Kapoor',
    date: 'Nov 15, 2025',
    medicines: ['Telmisartan 40mg', 'Aspirin 75mg'],
    status: 'active',
    refillsLeft: 5
  },
  {
    id: 'RX-003',
    doctorName: 'Dr. Sunita Patel',
    date: 'Aug 10, 2025',
    medicines: ['Omeprazole 20mg'],
    status: 'expired',
    refillsLeft: 0
  }
];

// Countdown timer component
const CountdownTimer = ({ seconds }: { seconds: number }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="text-right">
      <p className="text-[10px] uppercase tracking-wider text-red-500 font-semibold mb-1">
        Reservation Expires In
      </p>
      <div className="flex items-center gap-1 text-2xl font-bold text-red-500">
        <Timer size={20} className="mr-1" />
        <span>{format(hours)}</span>
        <span className="text-red-300">:</span>
        <span>{format(minutes)}</span>
        <span className="text-red-300">:</span>
        <span>{format(secs)}</span>
      </div>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const configs = {
    reserved: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Reserved' },
    ready: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Ready for Pickup' },
    delivery: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', label: 'On The Way' },
    completed: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', label: 'Completed' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-400', label: 'Cancelled' }
  };
  const config = configs[status as keyof typeof configs] || configs.reserved;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
};

// Cancel confirmation modal
const CancelModal = ({ isOpen, onClose, onConfirm, orderName }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; orderName: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle size={24} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Cancel Reservation?</h3>
            <p className="text-sm text-slate-500">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-slate-600 mb-6">
          Are you sure you want to cancel your reservation for <strong>{orderName}</strong>? The medicine will be released back to inventory.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Keep Reservation
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Cancel Order
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Senior-friendly Update Card (from reference image)
const UpdateCard = ({ order, onShowPickup, onTrack }: { order: Order; onShowPickup: () => void; onTrack: () => void }) => {
  const isReady = order.status === 'ready' || order.status === 'reserved';
  const isDelivery = order.status === 'delivery';

  return (
    <div className={`rounded-xl border-2 p-4 ${isReady ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`}>
      <div className="flex justify-end mb-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${isReady ? 'bg-green-500' : 'bg-blue-500'}`}>
          {isReady ? '✓ READY' : '🚗 ON THE WAY'}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900">{order.medicineName.split(' ')[0].toUpperCase()}</h3>
      <p className={`text-sm font-semibold ${isReady ? 'text-green-700' : 'text-blue-700'}`}>
        {isReady ? 'YOUR MEDICINE IS AT THE SHOP' : 'DRIVER IS COMING SOON'}
      </p>

      <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
        <Building2 size={14} />
        <span>{order.pharmacyName}</span>
      </div>

      {isDelivery && order.estimatedArrival && (
        <div className="flex items-center gap-2 mt-3">
          <Clock size={16} className="text-blue-600" />
          <span className="text-sm text-slate-600">Arrives by <strong>{order.estimatedArrival}</strong></span>
          <div className="flex-1 ml-2">
            <div className="h-2 bg-blue-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
            </div>
            <p className="text-[10px] text-blue-600 text-right mt-0.5">NEARBY</p>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {isReady && (
          <button
            onClick={onShowPickup}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <QrCode size={20} />
            SHOW PICKUP CODE
          </button>
        )}
        <button
          onClick={onTrack}
          className={`${isReady ? 'flex-1' : 'w-full'} ${isDelivery ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-600 hover:bg-slate-700'} text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors`}
        >
          <Truck size={20} />
          TRACK ORDER
        </button>
      </div>
    </div>
  );
};

// Senior-friendly Action Button
const ActionButton = ({ icon: Icon, title, subtitle, color, to }: { icon: React.ElementType; title: string; subtitle: string; color: string; to: string }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 border-blue-300',
    yellow: 'bg-yellow-100 border-yellow-300',
    pink: 'bg-pink-100 border-pink-300',
    red: 'bg-red-100 border-red-300'
  };

  const iconColors: Record<string, string> = {
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-400 text-slate-900',
    pink: 'bg-purple-500 text-white',
    red: 'bg-red-500 text-white'
  };

  return (
    <NavLink
      to={to}
      className={`block rounded-xl border-2 p-6 text-center hover:shadow-lg transition-all ${colorClasses[color]}`}
    >
      <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${iconColors[color]}`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </NavLink>
  );
};

// Order card component
const OrderCard = ({ order, onCancel, showCancelButton = true }: { order: Order; onCancel?: (id: string) => void; showCancelButton?: boolean }) => {
  const [showPickupCode, setShowPickupCode] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const canCancel = order.status === 'reserved' || order.status === 'ready';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <span className="text-sm text-slate-400 font-mono">#{order.id}</span>
            {order.date && <span className="text-sm text-slate-400">• {order.date}</span>}
          </div>

          {order.status === 'reserved' && order.reservationExpiry && (
            <CountdownTimer seconds={order.reservationExpiry} />
          )}

          {order.status === 'delivery' && order.estimatedArrival && (
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-1">Estimated Arrival</p>
              <p className="text-lg font-bold text-slate-900">{order.estimatedArrival}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Medicine Info */}
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-slate-900 mb-1">{order.medicineName}</h3>
            <p className="text-slate-500 mb-4">
              {order.genericName} • {order.quantity} {order.unit}
            </p>

            {/* Pharmacy Info */}
            <div className="flex items-start gap-2 text-sm mb-2">
              <Building2 size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-slate-700">{order.pharmacyName}</p>
                <p className="text-slate-500">{order.pharmacyAddress}</p>
              </div>
            </div>

            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(order.pharmacyAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-teal-600 font-medium text-sm hover:text-teal-700 mt-2"
            >
              Get Directions <ExternalLink size={14} />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 items-end">
            {(order.status === 'reserved' || order.status === 'ready') && (
              <button
                onClick={() => setShowPickupCode(!showPickupCode)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <QrCode size={18} />
                View Pickup Code
              </button>
            )}

            {order.status === 'delivery' && (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Truck size={28} className="text-blue-500" />
              </div>
            )}

            {/* Cancel Button */}
            {showCancelButton && canCancel && onCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
              >
                <X size={16} />
                Cancel Reservation
              </button>
            )}
          </div>
        </div>

        {/* Pickup Code Section */}
        <AnimatePresence>
          {showPickupCode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-slate-100"
            >
              <div className="flex items-center justify-center gap-4 py-4 bg-slate-50 rounded-lg">
                <div className="w-24 h-24 bg-white rounded-lg border-2 border-slate-200 flex items-center justify-center">
                  <QrCode size={48} className="text-slate-700" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Pickup Code</p>
                  <p className="text-3xl font-mono font-bold text-slate-900 tracking-widest">
                    {order.id.replace(/[^0-9]/g, '').slice(0, 4)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          onCancel?.(order.id);
          setShowCancelModal(false);
        }}
        orderName={order.medicineName}
      />
    </>
  );
};

// Prescription Card
const PrescriptionCard = ({ prescription }: { prescription: Prescription }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${prescription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {prescription.status === 'active' ? 'Active' : 'Expired'}
        </div>
        <span className="text-sm text-slate-400 font-mono">#{prescription.id}</span>
      </div>
      <span className="text-sm text-slate-400">{prescription.date}</span>
    </div>

    <h3 className="text-lg font-bold text-slate-900 mb-1">{prescription.doctorName}</h3>

    <div className="mt-3 space-y-2">
      {prescription.medicines.map((med, idx) => (
        <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
          <Pill size={14} className="text-teal-500" />
          {med}
        </div>
      ))}
    </div>

    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
      <span className="text-sm text-slate-500">
        {prescription.refillsLeft > 0 ? `${prescription.refillsLeft} refills remaining` : 'No refills left'}
      </span>
      {prescription.status === 'active' && prescription.refillsLeft > 0 && (
        <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
          Request Refill
        </button>
      )}
    </div>
  </motion.div>
);

// Caregiver Settings Component
const CaregiverSettings = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <UserCog size={20} className="text-teal-500" />
        Caregiver Access
      </h3>
      <p className="text-slate-500 text-sm mb-4">
        Add family members or caregivers who can help manage your medications.
      </p>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Rahul Sharma</p>
              <p className="text-xs text-slate-500">Son • Full Access</p>
            </div>
          </div>
          <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <button className="w-full border-2 border-dashed border-slate-200 rounded-lg py-3 text-slate-500 hover:border-teal-300 hover:text-teal-600 transition-colors flex items-center justify-center gap-2">
        <Plus size={18} />
        Add Caregiver
      </button>
    </div>

    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Shield size={20} className="text-teal-500" />
        Privacy Settings
      </h3>

      <div className="space-y-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-slate-700">Allow caregivers to place orders</span>
          <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-500 rounded" />
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-slate-700">Send order notifications to caregivers</span>
          <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-500 rounded" />
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-slate-700">Allow caregivers to view prescriptions</span>
          <input type="checkbox" className="w-5 h-5 text-teal-500 rounded" />
        </label>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Phone size={20} className="text-teal-500" />
        Emergency Contact
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input type="text" defaultValue="Rahul Sharma" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
        </div>
      </div>

      <button className="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
        Save Changes
      </button>
    </div>
  </div>
);

// Sidebar navigation items
const sidebarItems = [
  { icon: Package, label: 'My Reservations', id: 'reservations' },
  { icon: History, label: 'Order History', id: 'history' },
  { icon: FileText, label: 'Prescriptions', id: 'prescriptions' },
  { icon: Settings, label: 'Caregiver Settings', id: 'caregiver' },
];

export const Orders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('reservations');
  const [orders, setOrders] = useState(DEMO_ORDERS);
  const [orderHistory, setOrderHistory] = useState(DEMO_ORDER_HISTORY);
  const [showPickupModal, setShowPickupModal] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'senior' | 'full'>('senior');
  const [showTrackOrder, setShowTrackOrder] = useState<Order | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [trackOrderId, setTrackOrderId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updatesRef = useRef<HTMLDivElement>(null);

  const activeOrders = useMemo(() => orders.filter(o => o.status === 'ready' || o.status === 'reserved' || o.status === 'delivery'), [orders]);

  // Cancel order handler
  const handleCancelOrder = (orderId: string) => {
    const orderToCancel = orders.find(o => o.id === orderId);
    if (orderToCancel) {
      setOrderHistory(prev => [{
        ...orderToCancel,
        status: 'cancelled' as const,
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
      }, ...prev]);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  // Get filtered data based on active tab
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase();

    switch (activeTab) {
      case 'reservations':
        return orders.filter(o =>
          o.medicineName.toLowerCase().includes(query) ||
          o.id.toLowerCase().includes(query)
        );
      case 'history':
        return orderHistory.filter(o =>
          o.medicineName.toLowerCase().includes(query) ||
          o.id.toLowerCase().includes(query)
        );
      case 'prescriptions':
        return DEMO_PRESCRIPTIONS.filter(p =>
          p.doctorName.toLowerCase().includes(query) ||
          p.medicines.some(m => m.toLowerCase().includes(query))
        );
      default:
        return [];
    }
  };

  // Senior-friendly view
  if (viewMode === 'senior') {
    return (
      <div className="min-h-screen bg-slate-100">
        {/* Senior Header */}
        <header className="bg-slate-900 text-white py-4 px-6 flex items-center justify-between sticky top-0 z-50">
          <NavLink to="/" className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-semibold">BACK</span>
          </NavLink>
          <h1 className="text-xl font-bold tracking-wide">MEDIFIND</h1>
          <NavLink to="/" className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <span className="font-semibold">HOME</span>
            <Home size={20} />
          </NavLink>
        </header>

        <main className="p-6 max-w-4xl mx-auto pb-24">
          {/* Updates Section */}
          {activeOrders.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Info size={20} className="text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">UPDATES FOR YOU</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOrders.slice(0, 2).map(order => (
                  <UpdateCard
                    key={order.id}
                    order={order}
                    onShowPickup={() => setShowPickupModal(order.id)}
                    onTrack={() => setShowTrackOrder(order)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* What Do You Need Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">👆</span>
              <h2 className="text-xl font-bold text-slate-900">WHAT DO YOU NEED?</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Find Medicine - navigates to products */}
              <button
                onClick={() => navigate('/products')}
                className="block rounded-xl border-2 p-6 text-center hover:shadow-lg transition-all bg-blue-100 border-blue-300"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-blue-500 text-white">
                  <Search size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">FIND MEDICINE</h3>
                <p className="text-sm text-slate-500 mt-1">Search for new pills</p>
              </button>

              {/* My Pills - scrolls to updates section */}
              <button
                onClick={() => updatesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="block rounded-xl border-2 p-6 text-center hover:shadow-lg transition-all bg-yellow-100 border-yellow-300"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-yellow-400 text-slate-900">
                  <Pill size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">MY PILLS</h3>
                <p className="text-sm text-slate-500 mt-1">See your orders</p>
              </button>

              {/* Upload Photo - opens file picker */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="block rounded-xl border-2 p-6 text-center hover:shadow-lg transition-all bg-pink-100 border-pink-300"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-purple-500 text-white">
                  <Camera size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">UPLOAD PHOTO</h3>
                <p className="text-sm text-slate-500 mt-1">Send prescription picture</p>
              </button>

              {/* Help - opens phone call */}
              <a
                href="tel:18001234567"
                className="block rounded-xl border-2 p-6 text-center hover:shadow-lg transition-all bg-red-100 border-red-300"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-red-500 text-white">
                  <PhoneCall size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">HELP</h3>
                <p className="text-sm text-slate-500 mt-1">Call support</p>
              </a>
            </div>
          </section>

          {/* Switch to Full View */}
          <button
            onClick={() => setViewMode('full')}
            className="mt-8 w-full text-center text-slate-500 underline text-sm"
          >
            Switch to detailed view
          </button>
        </main>

        {/* Senior Footer */}
        <footer className="fixed bottom-0 left-0 right-0 bg-slate-200 py-4 text-center border-t border-slate-300">
          <p className="text-slate-600">
            Need help? Call <a href="tel:18001234567" className="font-bold text-blue-600">1-800-123-4567</a>
          </p>
        </footer>

        {/* Pickup Code Modal */}
        <AnimatePresence>
          {showPickupModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPickupModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-4">PICKUP CODE</h3>
                <div className="w-32 h-32 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <QrCode size={64} className="text-slate-700" />
                </div>
                <p className="text-5xl font-mono font-bold text-slate-900 tracking-widest mb-4">
                  {showPickupModal.replace(/[^0-9]/g, '').slice(0, 4)}
                </p>
                <p className="text-slate-500 mb-6">Show this code at the pharmacy</p>
                <button
                  onClick={() => setShowPickupModal(null)}
                  className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold"
                >
                  CLOSE
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Prescription Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowUploadModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-2">UPLOAD PRESCRIPTION</h3>
                <p className="text-slate-500 mb-6">Take a photo or upload your prescription</p>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadedFile(e.target.files[0]);
                    }
                  }}
                />

                {uploadedFile ? (
                  <div className="mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle size={24} className="text-green-500" />
                      <div>
                        <p className="font-medium text-green-800">File Uploaded!</p>
                        <p className="text-sm text-green-600">{uploadedFile.name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setShowUploadModal(false);
                        alert('Prescription uploaded! A pharmacist will contact you shortly.');
                      }}
                      className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition-colors"
                    >
                      SUBMIT PRESCRIPTION
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-300 rounded-xl py-8 flex flex-col items-center gap-3 hover:border-blue-400 transition-colors"
                    >
                      <Camera size={40} className="text-slate-400" />
                      <span className="font-medium text-slate-600">Click to select image</span>
                    </button>
                  </div>
                )}

                <p className="text-xs text-slate-400 text-center mb-4">
                  Send your prescription to: medifind74@gmail.com
                </p>

                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadedFile(null);
                  }}
                  className="w-full bg-slate-200 text-slate-600 py-3 rounded-lg font-bold"
                >
                  CANCEL
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Track Order Modal */}
        <AnimatePresence>
          {showTrackOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowTrackOrder(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-4">TRACK ORDER</h3>

                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-500">Order ID</span>
                    <span className="font-mono font-bold text-slate-900">{showTrackOrder.id}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-500">Medicine</span>
                    <span className="font-medium text-slate-900">{showTrackOrder.medicineName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status</span>
                    <StatusBadge status={showTrackOrder.status} />
                  </div>
                </div>

                {/* Tracking Progress */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                      <CheckCircle size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Order Placed</p>
                      <p className="text-xs text-slate-500">Your order has been confirmed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${showTrackOrder.status !== 'reserved' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      {showTrackOrder.status !== 'reserved' ? <CheckCircle size={16} /> : <Package size={16} />}
                    </div>
                    <div>
                      <p className={`font-medium ${showTrackOrder.status !== 'reserved' ? 'text-slate-900' : 'text-slate-400'}`}>Ready for Pickup</p>
                      <p className="text-xs text-slate-500">Pharmacy has confirmed availability</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${showTrackOrder.status === 'delivery' ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      <Truck size={16} />
                    </div>
                    <div>
                      <p className={`font-medium ${showTrackOrder.status === 'delivery' ? 'text-slate-900' : 'text-slate-400'}`}>Out for Delivery</p>
                      <p className="text-xs text-slate-500">{showTrackOrder.estimatedArrival ? `Arrives by ${showTrackOrder.estimatedArrival}` : 'Waiting for dispatch'}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowTrackOrder(null)}
                  className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold"
                >
                  CLOSE
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full view (original design)
  const renderContent = () => {
    const filteredData = getFilteredData();

    switch (activeTab) {
      case 'reservations':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Package size={20} className="text-teal-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Current Reservations & Deliveries</h2>
              </div>
              <span className="text-sm text-slate-500">{orders.length} Active Orders</span>
            </div>
            <div className="space-y-4">
              {(filteredData as Order[]).length > 0 ? (
                (filteredData as Order[]).map((order) => (
                  <OrderCard key={order.id} order={order} onCancel={handleCancelOrder} />
                ))
              ) : (
                <EmptyState icon={Package} message="No active orders" />
              )}
            </div>
          </>
        );

      case 'history':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <History size={20} className="text-slate-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Order History</h2>
              </div>
              <span className="text-sm text-slate-500">{orderHistory.length} Past Orders</span>
            </div>
            <div className="space-y-4">
              {(filteredData as Order[]).length > 0 ? (
                (filteredData as Order[]).map((order) => (
                  <OrderCard key={order.id} order={order} showCancelButton={false} />
                ))
              ) : (
                <EmptyState icon={History} message="No order history" />
              )}
            </div>
          </>
        );

      case 'prescriptions':
        return (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">My Prescriptions</h2>
              </div>
              <span className="text-sm text-slate-500">{DEMO_PRESCRIPTIONS.length} Prescriptions</span>
            </div>
            <div className="space-y-4">
              {(filteredData as Prescription[]).length > 0 ? (
                (filteredData as Prescription[]).map((prescription) => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} />
                ))
              ) : (
                <EmptyState icon={FileText} message="No prescriptions found" />
              )}
            </div>
          </>
        );

      case 'caregiver':
        return (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings size={20} className="text-purple-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Caregiver Settings</h2>
            </div>
            <CaregiverSettings />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-16 h-[calc(100vh-4rem)]">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">MediFind</h2>
          <p className="text-xs text-teal-600 font-medium">PATIENT PORTAL</p>
        </div>

        <nav className="flex-grow p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${activeTab === item.id
                ? 'bg-teal-50 text-teal-700'
                : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={20} className="text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Kamla Devi</p>
              <p className="text-xs text-slate-500">Senior Member</p>
            </div>
          </div>
          <button
            onClick={() => setViewMode('senior')}
            className="mt-3 w-full text-xs text-teal-600 underline"
          >
            Switch to simple view
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            My Reservations & Orders
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search my orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-100 focus:bg-white focus:border-teal-500 outline-none transition-colors text-sm"
              />
            </div>
            <button className="relative p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}

        {/* Mobile Bottom Nav */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg border border-slate-200 p-2 flex justify-around">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === item.id ? 'text-teal-600' : 'text-slate-400'
                }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

// Empty state component
const EmptyState = ({ icon: Icon, message }: { icon: React.ElementType; message: string }) => (
  <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
    <Icon size={48} className="text-slate-300 mx-auto mb-4" />
    <h3 className="text-lg font-bold text-slate-900 mb-2">{message}</h3>
    <p className="text-slate-500">Check back later for updates</p>
  </div>
);