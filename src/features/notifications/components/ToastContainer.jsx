/**
 * ToastContainer.jsx — Global Toast Notification Renderer
 * 
 * Renders stacked toast notifications from the Zustand toast store.
 * Supports: success (green), error (red), warning (amber), info (blue).
 * Auto-dismisses with animated exit.
 */

import { motion, AnimatePresence } from 'framer-motion';
import useToastStore from '../store/useToastStore';

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  const getStyles = (type) => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-600 to-red-500',
          border: 'border-red-400/20',
          icon: '✕',
          iconBg: 'bg-red-700/50',
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-emerald-600 to-emerald-500',
          border: 'border-emerald-400/20',
          icon: '✓',
          iconBg: 'bg-emerald-700/50',
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-600 to-amber-500',
          border: 'border-amber-400/20',
          icon: '!',
          iconBg: 'bg-amber-700/50',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-obsidian-800 to-obsidian-700',
          border: 'border-obsidian-600/20',
          icon: 'i',
          iconBg: 'bg-obsidian-600/50',
        };
    }
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm"
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const styles = getStyles(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`${styles.bg} text-white px-5 py-4 rounded-2xl shadow-luxury border ${styles.border} backdrop-blur-xl flex items-center gap-3`}
            >
              <span className={`w-6 h-6 rounded-lg ${styles.iconBg} flex items-center justify-center text-xs font-black`}>
                {styles.icon}
              </span>
              <p className="font-medium text-sm flex-1">{toast.message}</p>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => removeToast(toast.id)}
                className="text-white/50 hover:text-white transition-colors text-lg"
              >
                ×
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
