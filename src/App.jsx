import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/error/ErrorBoundary';
import ToastContainer from './features/notifications/components/ToastContainer';
import CursorFollower from './components/effects/CursorFollower';
import AuroraBackground from './components/effects/AuroraBackground';
import SplashScreen from './components/effects/SplashScreen';
import SmoothScroll from './components/effects/SmoothScroll';

// Lazy load pages for code splitting
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CustomizePage = lazy(() => import('./pages/CustomizePage'));

// Lazy load heavy 3D particle effect (only on desktop)
const ParticleField = lazy(() => import('./components/effects/ParticleField'));

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={`sticky top-0 z-50 transition-all duration-700 ease-luxury ${
        scrolled
          ? 'bg-white/70 backdrop-blur-3xl shadow-[0_4px_40px_rgba(0,0,0,0.08)] border-b border-gold-200/30'
          : 'bg-transparent'
      }`}
    >
      {/* Top accent line - animated gradient */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/70 to-transparent"
      />

      {/* Subtle animated shimmer across header on scroll */}
      {scrolled && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-200/10 to-transparent pointer-events-none"
        />
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 h-20 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-3 cursor-hover">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-11 h-11 rounded-xl bg-obsidian-900 flex items-center justify-center shadow-lg shadow-black/20 relative overflow-hidden"
          >
            <span className="text-gold-500 font-black text-sm italic relative z-10">C</span>
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-conic from-gold-500/20 via-transparent to-gold-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-obsidian-900 group-hover:text-gold-600 transition-colors duration-300">
              CODED CLOTHING
            </span>
            <span className="text-[9px] font-medium tracking-[0.3em] text-obsidian-400 uppercase">
              Premium Atelier
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-gold-600 ${
              location.pathname === '/' ? 'text-gold-600' : 'text-obsidian-400'
            }`}
          >
            Collection
          </Link>
          <div className="w-px h-4 bg-gradient-to-b from-transparent via-gold-400/30 to-transparent" />
          <span className="text-[10px] font-medium tracking-[0.2em] text-obsidian-300 uppercase">
            {time.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
          <div className="w-px h-4 bg-gradient-to-b from-transparent via-gold-400/30 to-transparent" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-gold-600 uppercase relative">
            Bespoke Design
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-gold-400/50" />
          </span>
        </nav>
      </div>
    </motion.header>
  );
};

const PremiumLoader = () => (
  <div className="flex items-center justify-center min-h-[600px]">
    <div className="relative">
      {/* Outermost ring - slowest */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="w-24 h-24 rounded-full border border-gold-200/20"
      />
      {/* Middle ring */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2 rounded-full border border-gold-300/30"
      />
      {/* Inner ring - fastest */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 rounded-full border-2 border-t-gold-500 border-r-transparent border-b-transparent border-l-transparent"
      />
      {/* Center dot with glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-3 h-3 rounded-full bg-gold-500 shadow-[0_0_15px_rgba(201,169,110,0.6)]" 
        />
      </div>
    </div>
  </div>
);

const Footer = () => (
  <footer className="relative mt-32 border-t border-obsidian-100/50 overflow-hidden">
    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
    
    {/* Ambient glow - enhanced */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-gold-200/12 to-transparent rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-gold-100/8 to-transparent rounded-full blur-3xl pointer-events-none" />
    <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-gradient-radial from-gold-200/5 to-transparent rounded-full blur-3xl pointer-events-none" />
    
    {/* Grid pattern overlay */}
    <div className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(201, 169, 110, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201, 169, 110, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
    
    {/* Animated scan line */}
    <motion.div
      animate={{ y: ['-100%', '100%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent pointer-events-none"
    />

    {/* Floating particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -200], opacity: [0, 0.4, 0] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, delay: i * 1.5, ease: 'linear' }}
          className="absolute bottom-0 w-1 h-1 rounded-full bg-gold-400/30"
          style={{ left: `${10 + i * 12}%` }}
        />
      ))}
    </div>
    
    <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-24 relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-obsidian-900 flex items-center justify-center shadow-lg relative overflow-hidden"
            >
              <span className="text-gold-500 font-black text-lg italic relative z-10">C</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-conic from-gold-500/20 via-transparent to-gold-500/20"
              />
            </motion.div>
            <div>
              <span className="text-sm font-bold text-obsidian-900 block">CODED CLOTHING</span>
              <span className="text-[8px] font-medium text-obsidian-400 tracking-[0.3em] uppercase">Premium Atelier Est. 2024</span>
            </div>
          </div>
          <p className="text-sm text-obsidian-400 leading-relaxed max-w-sm mb-8">
            Crafting premium custom apparel with precision engineering and artistic vision. 
            Where technology meets craftsmanship. Every thread tells a story.
          </p>
          <div className="flex gap-3">
            {['IG', 'TW', 'LI', 'YT'].map((social) => (
              <motion.div 
                key={social} 
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-xl bg-obsidian-50 flex items-center justify-center text-xs font-bold text-obsidian-400 hover:bg-obsidian-900 hover:text-gold-500 transition-all duration-300 cursor-pointer border border-obsidian-100 hover:border-obsidian-800 hover:shadow-lg hover:shadow-obsidian-900/20 relative overflow-hidden group"
              >
                <span className="relative z-10">{social}</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-400/0 group-hover:from-gold-500/10 group-hover:to-gold-400/5 transition-all duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-black text-obsidian-900 uppercase tracking-[0.3em] mb-5">Atelier</h4>
          <ul className="space-y-3">
            {['Custom Design', 'Premium Fabric', 'Screen Printing', 'Express Delivery', 'Gift Cards'].map((item) => (
              <li key={item}>
                <motion.span 
                  whileHover={{ x: 4 }}
                  className="text-sm text-obsidian-400 hover:text-gold-600 transition-all duration-300 cursor-pointer inline-block"
                >
                  {item}
                </motion.span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black text-obsidian-900 uppercase tracking-[0.3em] mb-5">Company</h4>
          <ul className="space-y-3">
            {['About Us', 'Sustainability', 'Careers', 'Press Kit', 'Contact'].map((item) => (
              <li key={item}>
                <motion.span 
                  whileHover={{ x: 4 }}
                  className="text-sm text-obsidian-400 hover:text-gold-600 transition-all duration-300 cursor-pointer inline-block"
                >
                  {item}
                </motion.span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="section-divider-animated mt-16 mb-8" />
      
      {/* Premium bottom bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-[10px] tracking-[0.2em] text-obsidian-300 uppercase">
          &copy; {new Date().getFullYear()} Coded Clothing. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-2 h-2 rounded-full bg-gold-400"
            style={{ boxShadow: '0 0 8px rgba(201, 169, 110, 0.6)' }}
          />
          <p className="text-[10px] tracking-[0.15em] text-obsidian-300 uppercase">
            Handcrafted with precision & passion
          </p>
        </div>
      </div>
    </div>
  </footer>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 80, filter: 'blur(16px)', scale: 0.92 }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
        exit={{ opacity: 0, y: -50, filter: 'blur(16px)', scale: 1.05 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<CollectionPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/customize/:id" element={<CustomizePage />} />
          <Route path="*" element={
            <div className="text-center py-32">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-9xl font-black gradient-text-gold mb-4">404</h2>
                <p className="text-obsidian-400 mb-8 text-sm tracking-wide">This page has wandered beyond our collection</p>
                <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-obsidian-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-gold-600 transition-all duration-500 shadow-luxury hover:shadow-gold btn-liquid">
                  Return to Collection
                </Link>
              </motion.div>
            </div>
          } />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SmoothScroll>
          {/* Splash Screen */}
          <AnimatePresence>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          </AnimatePresence>

          <div className="min-h-screen bg-[#fafaf8] text-obsidian-900 font-sans relative noise-overlay letterbox">
            {/* Aurora animated background */}
            <AuroraBackground />
            
            {/* 3D Particle field - desktop only */}
            <Suspense fallback={null}>
              <ParticleField />
            </Suspense>
            
            {/* Ambient background mesh - enhanced */}
            <div className="fixed inset-0 bg-mesh pointer-events-none z-0" />
            <div className="fixed inset-0 dots-pattern pointer-events-none z-0 opacity-30" />
            
            {/* Custom cursor */}
            <CursorFollower />
            
            <div className="relative z-10">
              <Header />
              <main className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-10">
                <Suspense fallback={<PremiumLoader />}>
                  <AnimatedRoutes />
                </Suspense>
              </main>
              <Footer />
            </div>
            <ToastContainer />
          </div>
        </SmoothScroll>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
