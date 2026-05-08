/**
 * AnnouncementBar.jsx — Top-of-page promotional banner
 * 
 * Dismissible announcement bar for offers, free shipping thresholds, etc.
 * Persists dismissal in sessionStorage so it doesn't reappear on navigation.
 */

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementBar = memo(function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('cc-announcement-dismissed') === '1';
  });

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('cc-announcement-dismissed', '1');
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-obsidian-900 text-white relative z-[60] overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-center gap-4 relative">
            <p className="text-center text-xs md:text-sm font-bold tracking-wide">
              <span className="text-gold-400">FREE SHIPPING</span> on orders above ₹999
              <span className="hidden md:inline mx-2 text-obsidian-500">|</span>
              <span className="hidden md:inline text-obsidian-300">Premium Egyptian Cotton • DTG Printed • 48hr Express</span>
            </p>
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-white transition-colors p-1"
              aria-label="Dismiss announcement"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default AnnouncementBar;
