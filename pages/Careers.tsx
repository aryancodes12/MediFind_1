import React from 'react';
import { motion } from 'framer-motion';
import { JOBS } from '../constants';
import { Briefcase, MapPin, Clock } from 'lucide-react';

export const Careers = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="pt-20 pb-12 text-center px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Join the Mission</h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">Help us build the digital backbone of India's local healthcare ecosystem.</p>
      </section>

      <section className="container mx-auto px-4 md:px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-4">
          {JOBS.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Briefcase size={16} /> {job.department}</span>
                    <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={16} /> {job.type}</span>
                  </div>
                </div>
                <button className="px-5 py-2.5 bg-slate-50 text-slate-700 font-medium rounded-lg border border-slate-200 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all self-start md:self-auto">
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center bg-primary-50 p-8 rounded-2xl max-w-4xl mx-auto border border-primary-100">
           <h3 className="text-xl font-bold text-slate-900 mb-2">Don't see a fit?</h3>
           <p className="text-slate-600 mb-4">We are always looking for passionate individuals. Send your resume to careers@medifind.in</p>
        </div>
      </section>
    </div>
  );
};