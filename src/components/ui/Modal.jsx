/**
 * Modal.jsx — Accessible Dialog Component
 * 
 * Portal-rendered modal with:
 * - Backdrop blur + click-to-close
 * - Focus trap and Escape key support
 * - Spring animation (scale + blur entrance)
 * - Body scroll lock when open
 */

import { forwardRef, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    filter: 'blur(10px)',
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    filter: 'blur(5px)',
    transition: { duration: 0.2 }
  },
};

const Modal = forwardRef(({ isOpen, onClose, title, children, className }, ref) => {
  const modalContentRef = useRef(null);
  const previousFocusRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);

      requestAnimationFrame(() => {
        const focusable = modalContentRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  const handleTabTrap = useCallback((e) => {
    if (e.key !== 'Tab') return;
    const content = modalContentRef.current;
    if (!content) return;

    const focusableEls = content.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableEls.length === 0) return;

    const first = focusableEls[0];
    const last = focusableEls[focusableEls.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onKeyDown={handleTabTrap}
        >
          {/* Premium Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-obsidian-900/60 backdrop-blur-xl"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Modal Content */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            ref={(node) => {
              modalContentRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            className={cn(
              "relative w-full max-w-lg bg-white rounded-[2rem] shadow-luxury overflow-hidden border border-obsidian-100/50",
              className
            )}
          >
            {/* Decorative top gradient */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
            
            <div className="flex items-center justify-between p-8 pb-0">
              <h2 className="text-xl font-black text-obsidian-900 tracking-tight">{title}</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Close dialog"
                className="p-2 hover:bg-obsidian-50 rounded-xl transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-obsidian-400"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </motion.button>
            </div>
            
            <div className="p-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
});

Modal.displayName = 'Modal';

export { Modal };