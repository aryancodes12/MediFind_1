import React from 'react';
import { motion } from 'framer-motion';
import { BLOG_POSTS } from '../constants';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

export const Blog = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <section className="bg-white py-16 border-b border-slate-100 mb-12">
         <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Health Insights</h1>
            <p className="text-slate-600">Expert advice, industry updates, and wellness tips from the MediFind team.</p>
         </div>
      </section>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {BLOG_POSTS.map((post, i) => (
             <motion.article 
               key={post.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               viewport={{ once: true }}
               className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
             >
               <div className="h-48 overflow-hidden">
                 <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="p-6">
                 <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                   <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                   <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">{post.title}</h2>
                 <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                 <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                   <span className="text-xs font-medium text-slate-900 flex items-center gap-2">
                     <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                       <User size={12} />
                     </div>
                     {post.author}
                   </span>
                   <span className="text-primary-600 text-sm font-semibold flex items-center gap-1">Read <ArrowRight size={14} /></span>
                 </div>
               </div>
             </motion.article>
           ))}
        </div>
      </div>
    </div>
  );
};