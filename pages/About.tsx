import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Truck } from 'lucide-react';

export const About = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            We are bridging the gap between <span className="text-primary-600">neighborhood pharmacies</span> and the people who need them.
          </motion.h1>
          <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="text-lg text-slate-600 leading-relaxed"
          >
            MediFind was born out of a simple necessity: why wait 2 days for medicines when a pharmacy 500 meters away has them in stock?
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  In 2022, our founder struggled to find critical post-surgery medication for his elderly mother late at night. Online apps showed "Delivery Tomorrow," while a small chemist just two streets away had the stock but no digital presence.
                </p>
                <p>
                  That night, the idea for MediFind was planted.
                </p>
                <p>
                  We aren't trying to replace the local chemist. We are empowering them. By digitizing inventory for thousands of mom-and-pop pharmacies across India, we ensure that communities get faster access to healthcare while local businesses thrive.
                </p>
              </div>
            </motion.div>
            <div className="relative h-96 rounded-2xl overflow-hidden bg-slate-200">
               <img src="https://picsum.photos/800/800?random=10" alt="Pharmacist helping a customer" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold mb-4">Why we exist</h2>
             <p className="text-slate-400">Our core values drive every decision we make.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {[
               { icon: Heart, title: "Care First", desc: "We prioritize patient needs above efficiency. Medicine is not just a commodity; it's a lifeline." },
               { icon: Users, title: "Community Driven", desc: "We believe in the power of local. Strong local networks create resilient healthcare systems." },
               { icon: Truck, title: "Accessibility", desc: "Geography shouldn't dictate health. We work tirelessly to make logistics seamless." }
             ].map((val, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 viewport={{ once: true }}
                 className="bg-slate-800 p-8 rounded-2xl border border-slate-700"
               >
                 <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mb-6 text-primary-400">
                   <val.icon size={24} />
                 </div>
                 <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                 <p className="text-slate-400 leading-relaxed">{val.desc}</p>
               </motion.div>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
};