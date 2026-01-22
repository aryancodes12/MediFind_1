import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
             <div>
               <h1 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h1>
               <p className="text-lg text-slate-600">Have questions about our service? Want to partner with us? We'd love to hear from you.</p>
             </div>

             <div className="space-y-6">
                <div className="flex items-start gap-4">
                   <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
                      <Mail size={24} />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900">Email Us</h3>
                      <p className="text-slate-600">support@medifind.in</p>
                      <p className="text-slate-600">partners@medifind.in</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
                      <Phone size={24} />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900">Call Us</h3>
                      <p className="text-slate-600">+91 80 4123 5678</p>
                      <p className="text-sm text-slate-500 mt-1">Mon-Sat, 9am - 7pm IST</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
                      <MapPin size={24} />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-900">Visit Us</h3>
                      <p className="text-slate-600">MediFind HQ, Near Bhavan's College</p>
                      <p className="text-slate-600">Andheri West, Mumbai 400058</p>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-50 p-8 rounded-2xl border border-slate-100"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" placeholder="Amit" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" placeholder="Sharma" />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" placeholder="amit@example.com" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white">
                     <option>General Inquiry</option>
                     <option>Order Issue</option>
                     <option>Pharmacy Partnership</option>
                     <option>Careers</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all" placeholder="How can we help you?"></textarea>
               </div>
               <button className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                 Send Message <Send size={18} />
               </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};