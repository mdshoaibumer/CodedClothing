/**
 * App.jsx — Root Application Component
 * 
 * Coded Clothing — Premium Custom T-Shirt Atelier
 * 
 * Architecture:
 * - Lazy-loaded route pages for optimal code splitting
 * - Global layout with header, footer, and ambient effects
 * - Error boundary wrapping for graceful failure handling
 * - Smooth scroll integration via Lenis
 */

import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/error/ErrorBoundary';
import ToastContainer from './features/notifications/components/ToastContainer';
import CursorFollower from './components/effects/CursorFollower';
import AuroraBackground from './components/effects/AuroraBackground';
import SplashScreen from './components/effects/SplashScreen';
import SmoothScroll from './components/effects/SmoothScroll';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

/* ─── Lazy-loaded Pages (Code Splitting) ─── */
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CustomizePage = lazy(() => import('./pages/CustomizePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'));

/* Heavy 3D effect — only loaded on capable desktop devices */
const ParticleField = lazy(() => import('./components/effects/ParticleField'));

/* ─── Animation Constants ─── */
const EASE_LUXURY = [0.16, 1, 0.3, 1];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * PremiumLoader — Elegant loading spinner shown during page transitions.
 */
const PremiumLoader = memo(function PremiumLoader() {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-t-gold-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gold-500" />
        </div>
      </div>
    </div>
  );
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * AnimatedRoutes — Provides smooth page transitions between routes.
 * Uses AnimatePresence for exit animations.
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: EASE_LUXURY }}
      >
        <Routes location={location}>
          <Route path="/" element={<CollectionPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/customize/:id" element={<CustomizePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * NotFoundPage — 404 error page with elegant animation.
 */
function NotFoundPage() {
  return (
    <div className="text-center py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_LUXURY }}
      >
        <h2 className="text-9xl font-black gradient-text-gold mb-4">404</h2>
        <p className="text-obsidian-400 mb-8 text-sm tracking-wide">
          This page has wandered beyond our collection
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-obsidian-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-gold-600 transition-all duration-500 shadow-luxury hover:shadow-gold btn-liquid"
        >
          Return to Collection
        </Link>
      </motion.div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * App — Root component orchestrating the entire application.
 * 
 * Responsibilities:
 * - Splash screen on initial load
 * - Global providers (Router, ErrorBoundary, SmoothScroll)
 * - Ambient visual effects (Aurora, Particles, Custom Cursor)
 * - Page layout structure
 */
export default function App() {
  // Skip splash screen on return visits (same session)
  const [showSplash, setShowSplash] = useState(() => {
    if (sessionStorage.getItem('cc-splash-shown')) return false;
    return true;
  });
  const [effectsReady, setEffectsReady] = useState(false);
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    sessionStorage.setItem('cc-splash-shown', '1');
  }, []);

  // Defer ambient effects until after first paint + idle time
  useEffect(() => {
    if (showSplash) return;
    const rIC = window.requestIdleCallback || ((cb) => setTimeout(cb, 1000));
    const cIC = window.cancelIdleCallback || clearTimeout;
    const id = rIC(() => setEffectsReady(true), { timeout: 2000 });
    return () => cIC(id);
  }, [showSplash]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SmoothScroll>
          {/* Splash Screen — plays once on initial page load */}
          <AnimatePresence>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
          </AnimatePresence>

          <div className="min-h-screen bg-[#fafaf8] text-obsidian-900 font-sans relative noise-overlay">
            {/* Ambient background effects — deferred until after first paint */}
            {effectsReady && (
              <>
                <AuroraBackground />
                <Suspense fallback={null}>
                  <ParticleField />
                </Suspense>
                <CursorFollower />
              </>
            )}
            
            {/* Main Content */}
            <div className="relative z-10">
              <Header />
              <main id="main-content" className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-10">
                <Suspense fallback={<PremiumLoader />}>
                  <AnimatedRoutes />
                </Suspense>
              </main>
              <Footer />
            </div>

            {/* Toast Notifications */}
            <ToastContainer />
          </div>
        </SmoothScroll>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
