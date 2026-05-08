/**
 * CookieConsent.jsx — GDPR/CCPA cookie consent banner.
 * Persists consent in localStorage. Shows only once.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'cc-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[9999] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-luxury border border-obsidian-100/50 p-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <span className="text-lg">🍪</span>
            <div>
              <h3 className="text-sm font-bold text-obsidian-900 mb-1">We value your privacy</h3>
              <p className="text-xs text-obsidian-400 leading-relaxed">
                We use cookies to enhance your browsing experience and analyze site traffic. By clicking "Accept," you consent to our use of cookies.{' '}
                <Link to="/privacy" className="text-gold-600 hover:text-gold-700 font-bold underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDecline}
              className="flex-1 py-3 rounded-xl border border-obsidian-100 text-obsidian-400 font-bold text-xs uppercase tracking-widest hover:border-obsidian-300 transition-all"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-3 rounded-xl bg-obsidian-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-obsidian-800 transition-all shadow-lg"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
