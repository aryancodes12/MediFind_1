import React from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, ChevronRight, MapPin } from 'lucide-react';

export const Orders = () => {
  const orders = [
    {
      id: 'ORD-2023-001',
      date: 'Today, 10:30 AM',
      status: 'Processing',
      items: ['Paracetamol (Crocin)', 'Azithromycin (Azee)'],
      total: 230,
      pharmacy: "Noble Chemists",
      address: "Andheri West",
      eta: "Today, 4:00 PM"
    },
    {
      id: 'ORD-2023-002',
      date: '12 Oct 2023',
      status: 'Delivered',
      items: ['Metformin (Glycomet)', 'Telmisartan (Telma)'],
      total: 450,
      pharmacy: "Wellness Forever",
      address: "Bhavan's College",
      eta: null
    },
    {
      id: 'ORD-2023-003',
      date: '25 Sep 2023',
      status: 'Delivered',
      items: ['Dolo 650mg'],
      total: 85,
      pharmacy: "Apollo Pharmacy",
      address: "Azad Nagar",
      eta: null
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <Package className="text-primary-600" /> Your Orders
        </h1>

        <div className="space-y-6 max-w-4xl">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${order.status === 'Processing' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {order.status === 'Processing' ? <Clock size={24} /> : <CheckCircle size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900">{order.status}</h3>
                        {order.status === 'Processing' && (
                          <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full animate-pulse">
                            Arriving Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">Order #{order.id} • {order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">₹{order.total}</p>
                    <p className="text-sm text-slate-500">{order.items.length} items</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">From: {order.pharmacy}</p>
                      <p className="text-xs text-slate-500">{order.address}</p>
                    </div>
                  </div>
                  {order.eta && (
                    <div className="flex items-start gap-3 mt-3 pt-3 border-t border-slate-200">
                      <Clock size={16} className="text-slate-400 mt-0.5" />
                      <div>
                         <p className="text-sm font-semibold text-slate-700">Estimated Delivery</p>
                         <p className="text-xs text-slate-500">{order.eta}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, i) => (
                      <span key={i} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">
                        {item}
                      </span>
                    ))}
                  </div>
                  <button className="flex items-center gap-1 text-primary-600 font-semibold text-sm hover:underline">
                    View Details <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};