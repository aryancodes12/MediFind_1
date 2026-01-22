import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, MapPin, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Pharmacies', path: '/products' },
    { name: 'Orders', path: '/orders' },
    { name: 'Partner with Us', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm py-3' : 'bg-white py-4'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-500 text-white p-1.5 rounded-lg">
              <Plus size={20} strokeWidth={3} />
            </div>
            <span className="text-xl font-bold text-slate-800">
              MediFind
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-blue-600 ${isActive ? 'text-blue-600' : 'text-slate-600'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            <NavLink
              to="/cart"
              className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Login / Sign Up
            </NavLink>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-base font-medium py-2 px-4 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <NavLink to="/login" className="flex-1 bg-blue-500 text-white text-center py-2.5 rounded-lg font-medium">
                  Login / Sign Up
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 text-white p-1 rounded-md">
            <Plus size={16} strokeWidth={3} />
          </div>
          <span className="text-lg font-bold text-slate-800">MediFind</span>
        </div>
        <p className="text-sm text-slate-500">
          © 2023 MediFind Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};