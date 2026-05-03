import { forwardRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

const Modal = forwardRef(({ isOpen, onClose, title, children, className }, ref) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",
          className
        )}
      >
        <div className="flex items-center justify-between p-8 pb-0">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
});

Modal.displayName = 'Modal';

export { Modal };