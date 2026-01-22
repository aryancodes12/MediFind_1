import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, ChevronDown, ArrowRight, AlertCircle, Users, FileText, Clock, Building2, HeadphonesIcon, Heart, Timer, CheckCircle } from 'lucide-react';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Mumbai, Bandra');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to products page with search query as URL parameter
    navigate(`/products${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  const quickAccessCards = [
    {
      icon: AlertCircle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      title: 'Emergency Meds',
      description: 'Fast delivery within 30 minutes for urgent medical needs and first aid.',
      cta: 'Order Now',
      ctaColor: 'text-red-500',
      link: '/products'
    },
    {
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      title: 'Senior Care Packages',
      description: 'Subscriptions for chronic meds, adult diapers, supplements, and mobility aids.',
      cta: 'Explore Packages',
      ctaColor: 'text-blue-500',
      link: '/products'
    },
    {
      icon: FileText,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      title: 'Upload Prescription',
      description: "Don't know the names? Just take a photo of your prescription and let us handle it.",
      cta: 'Upload Photo',
      ctaColor: 'text-blue-500',
      link: '/products'
    }
  ];

  const stats = [
    { value: '1000+', label: 'PHARMACIES' },
    { value: '24/7', label: 'EXPERT SUPPORT' },
    { value: '50k+', label: 'HAPPY SENIORS' },
    { value: '15m', label: 'AVG. DELIVERY' }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-slate-900 leading-[1.1] mb-6">
                Find your <span className="text-blue-500">medicine</span><br />
                nearby.
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-md leading-relaxed">
                The easiest way to find medicines, upload prescriptions, and book pharmacy services near you.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex items-center flex-grow px-4 py-3">
                    <Search size={20} className="text-slate-400 mr-3 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="What medicine are you looking for?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full outline-none text-slate-700 placeholder-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 font-medium transition-colors flex-shrink-0"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Location Selector */}
              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-2 text-blue-500 font-medium hover:text-blue-600 transition-colors">
                  <MapPin size={16} />
                  <span>Searching near <span className="underline">{location}</span></span>
                  <ChevronDown size={14} />
                </button>
                <span className="text-slate-400">Use precise location for better results</span>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=400&fit=crop"
                  alt="Pharmacist helping senior customers"
                  className="w-full h-[300px] lg:h-[400px] object-cover"
                />

                {/* Trust Badge */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Trusted by Seniors</p>
                    <p className="text-xs text-slate-500">Verified Pharmacies Only</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Quick Access</h2>
            <p className="text-slate-500">Popular services tailored for your health needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickAccessCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={card.link}
                  className="block bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300 h-full group"
                >
                  <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                    <card.icon size={24} className={card.iconColor} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{card.description}</p>
                  <span className={`inline-flex items-center gap-1 ${card.ctaColor} font-medium text-sm group-hover:gap-2 transition-all`}>
                    {card.cta} <ArrowRight size={16} />
                  </span>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-50 rounded-xl p-6 text-center border border-slate-100"
              >
                <p className="text-3xl md:text-4xl font-bold text-blue-500 mb-1">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};