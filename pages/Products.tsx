import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MEDICINES, CATEGORIES } from '../constants';
import { MedicineCard } from '../components/MedicineCard';
import { Filter, Search, Check, ChevronDown, X } from 'lucide-react';
import { useSeniorMode } from '../components/Layout';

export const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isSeniorMode } = useSeniorMode();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [prescriptionFilter, setPrescriptionFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Update search query from URL when it changes
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchQuery(urlSearch);
  }, [searchParams]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Update URL params
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  // Filter medicines based on search query, category, and prescription status
  const filteredMedicines = MEDICINES.filter((medicine) => {
    // Search filter - matches name, brand, category, or pharmacy
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = searchLower === '' ||
      medicine.name.toLowerCase().includes(searchLower) ||
      medicine.brand.toLowerCase().includes(searchLower) ||
      medicine.category.toLowerCase().includes(searchLower) ||
      medicine.pharmacyName.toLowerCase().includes(searchLower);

    // Category filter
    const matchesCategory = activeCategory === 'All' || medicine.category === activeCategory;

    // Prescription filter
    let matchesPrescription = true;
    if (prescriptionFilter === 'yes') matchesPrescription = medicine.isPrescriptionRequired;
    if (prescriptionFilter === 'no') matchesPrescription = !medicine.isPrescriptionRequired;

    return matchesSearch && matchesCategory && matchesPrescription;
  });

  const getFilterLabel = () => {
    if (prescriptionFilter === 'yes') return 'Prescription Required';
    if (prescriptionFilter === 'no') return 'OTC (No Prescription)';
    return 'All Types';
  };

  const isFiltered = activeCategory !== 'All' || prescriptionFilter !== 'all' || searchQuery !== '';

  const clearAllFilters = () => {
    setActiveCategory('All');
    setPrescriptionFilter('all');
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="pb-20 min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b border-slate-100 pt-12 pb-8 sticky top-16 z-30 shadow-sm transition-all">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-slate-900">Find Medicines</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-4 relative">
            <div className="relative flex-grow max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for medicine (e.g., Crocin, Telma)..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-xl font-medium transition-all w-full md:w-auto ${showFilters || prescriptionFilter !== 'all' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <Filter size={18} />
                <span className="hidden sm:inline">Filters</span>
                {prescriptionFilter !== 'all' && (
                  <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">1</span>
                )}
                <ChevronDown size={16} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-40 origin-top-right"
                  >
                    <div className="px-3 py-2 border-b border-slate-50 mb-1 flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prescription Status</span>
                      {prescriptionFilter !== 'all' && (
                        <button
                          onClick={() => { setPrescriptionFilter('all'); setShowFilters(false); }}
                          className="text-xs text-blue-600 font-medium hover:text-blue-700"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {[
                        { id: 'all', label: 'Show All Types' },
                        { id: 'yes', label: 'Prescription Required' },
                        { id: 'no', label: 'OTC (No Prescription)' }
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => { setPrescriptionFilter(option.id as any); setShowFilters(false); }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between ${prescriptionFilter === option.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          {option.label}
                          {prescriptionFilter === option.id && <Check size={16} className="text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto mt-6 pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${activeCategory === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
            >
              All Medicines
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors border ${activeCategory === cat.name ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
              >
                <cat.icon size={14} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pt-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4 min-h-[40px]">
            <div className="text-sm text-slate-500 flex flex-wrap items-center gap-x-1.5 gap-y-2">
              <span>Showing <span className="font-bold text-slate-900">{filteredMedicines.length}</span> results</span>

              {searchQuery && (
                <>
                  <span>for</span>
                  <span className="font-medium text-slate-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-xs">"{searchQuery}"</span>
                </>
              )}

              {(activeCategory !== 'All' || prescriptionFilter !== 'all') && (
                <>
                  {searchQuery && <span>in</span>}
                  {!searchQuery && <span>in</span>}
                  {activeCategory !== 'All' && (
                    <span className="font-medium text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-xs">{activeCategory}</span>
                  )}
                  {activeCategory !== 'All' && prescriptionFilter !== 'all' && <span>&</span>}
                  {prescriptionFilter !== 'all' && (
                    <span className="font-medium text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-xs">{getFilterLabel()}</span>
                  )}
                </>
              )}
            </div>

            {isFiltered && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-slate-500 hover:text-red-600 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors ml-auto sm:ml-0"
              >
                <X size={14} /> Clear filters
              </button>
            )}
          </div>

          {filteredMedicines.length > 0 ? (
            <div className={`grid grid-cols-1 gap-6 ${isSeniorMode ? 'sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
              {filteredMedicines.map((medicine) => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 mx-auto max-w-2xl">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No medicines found</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {searchQuery ? (
                  <>We couldn't find any medicines matching "<span className="font-semibold text-slate-700">{searchQuery}</span>"</>
                ) : (
                  <>We couldn't find any matches in <span className="font-semibold text-slate-700">{activeCategory}</span>
                    {prescriptionFilter !== 'all' && <span> matching your <span className="font-semibold text-slate-700">{getFilterLabel()}</span> filter</span>}.</>
                )}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={clearAllFilters}
                  className="text-white bg-slate-900 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Empty State / More Loader - Only show if we have results */}
          {filteredMedicines.length > 0 && (
            <div className="mt-16 text-center pb-12">
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
              <p className="text-slate-400 mb-4 text-sm">You've viewed all available medicines</p>
              <button className="text-blue-600 font-medium hover:text-blue-700 hover:underline">Can't find what you need? Request a specific medicine</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};