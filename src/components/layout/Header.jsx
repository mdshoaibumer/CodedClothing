/**
 * Header — Sticky navigation bar with scroll-aware transparency.
 * Memoized to prevent re-renders from parent state changes.
 */

import { useState, useEffect, memo, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../../data/products';
import useCartStore from '../../features/cart/useCartStore';

const EASE_LUXURY = [0.16, 1, 0.3, 1];

const Header = memo(function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const totalCartItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Search results
  const searchResults = searchQuery.trim().length > 0
    ? products.filter(t => t.color.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: EASE_LUXURY, delay: 0.2 }}
      className={`sticky top-0 z-50 transition-all duration-700 ease-luxury ${
        scrolled
          ? 'bg-white/70 backdrop-blur-3xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] border-b border-gold-200/30'
          : 'bg-transparent'
      }`}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/70 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-3 cursor-hover">
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.6, ease: EASE_LUXURY }}
            className="w-11 h-11 rounded-xl overflow-hidden shadow-lg shadow-black/20 relative"
          >
            <img src="/images/codedclothinglogo.jpg" alt="Coded Clothing Logo" className="w-full h-full object-cover" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-obsidian-900 group-hover:text-gold-600 transition-colors duration-300">
              CODED CLOTHING
            </span>
            <span className="text-xs font-medium tracking-[0.3em] text-obsidian-400 uppercase">
              Premium Atelier
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/collection" 
            className={`text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-gold-600 ${
              location.pathname === '/collection' ? 'text-gold-600' : 'text-obsidian-400'
            }`}
          >
            Collection
          </Link>
          <div className="w-px h-4 bg-gradient-to-b from-transparent via-gold-400/30 to-transparent" />
          <Link 
            to="/about" 
            className={`text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-gold-600 ${
              location.pathname === '/about' ? 'text-gold-600' : 'text-obsidian-400'
            }`}
          >
            Our Story
          </Link>
          <div className="w-px h-4 bg-gradient-to-b from-transparent via-gold-400/30 to-transparent" />
          <Link 
            to="/contact" 
            className={`text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-gold-600 ${
              location.pathname === '/contact' ? 'text-gold-600' : 'text-obsidian-400'
            }`}
          >
            Contact
          </Link>
          <div className="w-px h-4 bg-gradient-to-b from-transparent via-gold-400/30 to-transparent" />
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-obsidian-400 hover:text-gold-600 transition-colors p-2 rounded-xl hover:bg-obsidian-50"
            aria-label="Search products"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
          <Link
            to="/cart"
            className="relative text-obsidian-400 hover:text-gold-600 transition-colors p-2 rounded-xl hover:bg-obsidian-50"
            aria-label="Shopping cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            {totalCartItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-gold-500 text-white text-2xs font-black rounded-full flex items-center justify-center shadow-sm min-w-[18px] h-[18px]"
              >
                {totalCartItems > 9 ? '9+' : totalCartItems}
              </motion.span>
            )}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-obsidian-50 transition-colors"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-[2px] w-full bg-obsidian-900 transition-all duration-300 origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-[2px] w-full bg-obsidian-900 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-[2px] w-full bg-obsidian-900 transition-all duration-300 origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE_LUXURY }}
            className="md:hidden overflow-hidden border-t border-gold-200/20 bg-white/90 backdrop-blur-2xl"
          >
            <div className="px-6 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative mb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-obsidian-100 bg-obsidian-50/50 text-sm font-medium text-obsidian-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  aria-label="Search products"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-obsidian-300">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              {searchResults.length > 0 && (
                <div className="space-y-1 mb-2">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-obsidian-50 transition-colors"
                    >
                      <div className="w-3 h-3 rounded-full ring-1 ring-obsidian-200 flex-shrink-0" style={{ backgroundColor: product.hex }} />
                      <span className="text-sm font-bold text-obsidian-700">{product.color}</span>
                      <span className="text-xs text-obsidian-400 ml-auto">₹{product.price}</span>
                    </Link>
                  ))}
                </div>
              )}
              <div className="h-px bg-gradient-to-r from-gold-400/20 to-transparent" />
              <Link
                to="/collection"
                className={`block text-sm font-bold uppercase tracking-[0.15em] transition-colors duration-300 py-3 ${
                  location.pathname === '/collection' ? 'text-gold-600' : 'text-obsidian-600 hover:text-gold-600'
                }`}
              >
                Collection
              </Link>
              <div className="h-px bg-gradient-to-r from-gold-400/20 to-transparent" />
              <Link
                to="/about"
                className={`block text-sm font-bold uppercase tracking-[0.15em] transition-colors duration-300 py-3 ${
                  location.pathname === '/about' ? 'text-gold-600' : 'text-obsidian-600 hover:text-gold-600'
                }`}
              >
                Our Story
              </Link>
              <div className="h-px bg-gradient-to-r from-gold-400/20 to-transparent" />
              <Link
                to="/contact"
                className={`block text-sm font-bold uppercase tracking-[0.15em] transition-colors duration-300 py-3 ${
                  location.pathname === '/contact' ? 'text-gold-600' : 'text-obsidian-600 hover:text-gold-600'
                }`}
              >
                Contact
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Desktop Search Dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: EASE_LUXURY }}
            className="hidden md:block absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl border-b border-gold-200/20 shadow-luxury"
          >
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-6">
              <div className="relative max-w-md mx-auto">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by color, name..."
                  className="w-full px-5 py-4 pl-12 rounded-2xl border border-obsidian-100 bg-obsidian-50/50 text-sm font-medium text-obsidian-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-400 transition-all"
                  aria-label="Search products"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-obsidian-300">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              {searchResults.length > 0 && (
                <div className="mt-4 max-w-md mx-auto divide-y divide-obsidian-50">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-obsidian-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-obsidian-50 overflow-hidden flex-shrink-0">
                        <img src={product.image} alt={product.color} className="w-full h-full object-contain mix-blend-multiply p-1" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-obsidian-900 group-hover:text-gold-700 transition-colors">{product.color}</span>
                        {product.label && <span className="ml-2 text-2xs font-black text-gold-600 uppercase">{product.label}</span>}
                      </div>
                      <span className="text-sm font-black text-obsidian-900">₹{product.price}</span>
                    </Link>
                  ))}
                </div>
              )}
              {searchQuery.trim().length > 0 && searchResults.length === 0 && (
                <p className="text-center text-sm text-obsidian-400 mt-4">No products found for &ldquo;{searchQuery}&rdquo;</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
});

export default Header;
