import React, { useState, createContext, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, MapPin, Plus, Eye, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

// Senior Mode Context
interface SeniorModeContextType {
  isSeniorMode: boolean;
  toggleSeniorMode: () => void;
}

const SeniorModeContext = createContext<SeniorModeContextType>({
  isSeniorMode: false,
  toggleSeniorMode: () => { }
});

export const useSeniorMode = () => useContext(SeniorModeContext);

export const SeniorModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSeniorMode, setIsSeniorMode] = useState(true); // Default to senior mode

  const toggleSeniorMode = () => setIsSeniorMode(prev => !prev);

  return (
    <SeniorModeContext.Provider value={{ isSeniorMode, toggleSeniorMode }}>
      {children}
    </SeniorModeContext.Provider>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const { isSeniorMode, toggleSeniorMode } = useSeniorMode();

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm py-2' : 'bg-white py-3'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="MediFind"
              className="h-10 w-10 object-contain"
            />
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-slate-800">MediFind</span>
              <p className="text-[10px] text-blue-600 -mt-1">Right Medicine, Right Time</p>
            </div>
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
          <div className="hidden lg:flex items-center gap-3">
            {/* Senior Mode Toggle */}
            <button
              onClick={toggleSeniorMode}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all border ${isSeniorMode
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              title={isSeniorMode ? 'Switch to Normal View' : 'Switch to Senior View'}
            >
              <Users size={16} />
              <span>{isSeniorMode ? 'Senior Mode' : 'Normal'}</span>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${isSeniorMode ? 'bg-green-500' : 'bg-slate-300'}`}>
                <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${isSeniorMode ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            </button>

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
          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Senior Toggle */}
            <button
              onClick={toggleSeniorMode}
              className={`p-2 rounded-full ${isSeniorMode ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}
            >
              <Users size={20} />
            </button>
            <button
              className="p-2 text-slate-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="MediFind" className="h-12 w-12 object-contain" />
              <div>
                <h3 className="text-xl font-bold">MediFind</h3>
                <p className="text-sm text-blue-400">Right Medicine, Right Time</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm max-w-md">
              India's trusted platform for finding medicines at local pharmacies.
              Designed with love for senior citizens and their caregivers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><NavLink to="/products" className="hover:text-white transition-colors">Find Medicines</NavLink></li>
              <li><NavLink to="/orders" className="hover:text-white transition-colors">Track Orders</NavLink></li>
              <li><NavLink to="/contact" className="hover:text-white transition-colors">Partner with Us</NavLink></li>
              <li><NavLink to="/about" className="hover:text-white transition-colors">About Us</NavLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>📧 medifind74@gmail.com</li>
              <li>📞 1-800-123-4567</li>
              <li>📍 Mumbai, Maharashtra, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 MediFind Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LayoutContent = ({ children }: { children?: React.ReactNode }) => {
  const { isSeniorMode } = useSeniorMode();

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-white ${isSeniorMode ? 'senior-mode' : ''}`}>
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <SeniorModeProvider>
      <LayoutContent>{children}</LayoutContent>
    </SeniorModeProvider>
  );
};