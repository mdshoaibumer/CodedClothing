/**
 * Header — Sticky navigation bar with scroll-aware transparency.
 * Memoized to prevent re-renders from parent state changes.
 */

import { useState, useEffect, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const EASE_LUXURY = [0.16, 1, 0.3, 1];

const Header = memo(function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
            to="/" 
            className={`text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-gold-600 ${
              location.pathname === '/' ? 'text-gold-600' : 'text-obsidian-400'
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
              <Link
                to="/"
                className={`block text-sm font-bold uppercase tracking-[0.15em] transition-colors duration-300 py-3 ${
                  location.pathname === '/' ? 'text-gold-600' : 'text-obsidian-600 hover:text-gold-600'
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
    </motion.header>
  );
});

export default Header;
