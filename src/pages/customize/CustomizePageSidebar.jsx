/**
 * CustomizePageSidebar.jsx — Design Studio Control Panel
 * 
 * Right sidebar containing:
 * - Logo upload control
 * - Numeric position/scale adjusters
 * - Color picker
 * - Product details and size guide
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '../../features/product/product.utils';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import UploadLogo from '../../features/customization/components/UploadLogo';
import NumericControls from '../../features/customization/components/NumericControls';
import useCustomizationStore from '../../features/customization/store/useCustomizationStore';
import useToastStore from '../../features/notifications/store/useToastStore';

export default function CustomizePageSidebar({ product, hasDesign, selectedSize = 'M' }) {
  const [quantity, setQuantity] = useState(1);
  const [showOrderPreview, setShowOrderPreview] = useState(false);

  const { activeView, design, centerLogo, copyDesign } = useCustomizationStore();
  const addToast = useToastStore((state) => state.addToast);

  const handleCenterLogo = () => {
    if (activeView === 'both') {
      centerLogo('front');
      centerLogo('back');
      addToast('Both logos centered!', 'success');
    } else {
      centerLogo(activeView);
      addToast('Logo centered!', 'success');
    }
  };

  const handleCopyFrontToBack = () => {
    copyDesign('front', 'back');
    addToast('Front design copied to back!', 'success');
  };

  const handleCopyBackToFront = () => {
    copyDesign('back', 'front');
    addToast('Back design copied to front!', 'success');
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    if (!phoneNumber) {
      addToast('WhatsApp number is not configured.', 'error');
      return;
    }
    const text = `*New Order from Coded Clothing*\n\n` +
      `- *Product:* ${product.color} Premium Tee\n` +
      `- *Size:* ${selectedSize}\n` +
      `- *Quantity:* ${quantity}\n` +
      `- *Front Logo:* ${design.front.logo ? 'Yes' : 'No'}\n` +
      `- *Back Logo:* ${design.back.logo ? 'Yes' : 'No'}\n` +
      `- *Total Price:* ${formatPrice(product.price * quantity)}`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1, x: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <>
      <motion.div
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="lg:col-span-4 flex flex-col gap-6 md:gap-8"
      >
        {/* Upload Panel */}
        <motion.div variants={itemVariants} className="bg-white p-6 md:p-10 rounded-4xl shadow-luxury border border-obsidian-50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-100/30 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

          <div className="relative">
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <motion.span
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center w-9 md:w-10 h-9 md:h-10 rounded-xl bg-obsidian-900 text-gold-500 text-xs md:text-sm font-black italic shadow-lg shadow-obsidian-900/20"
              >
                C
              </motion.span>
              <h3 className="text-[9px] md:text-xs font-black text-obsidian-900 uppercase tracking-[0.2em]">
                Brand Assets {activeView !== 'both' && `(${activeView})`}
              </h3>
            </div>

            <p className="text-xs md:text-sm text-obsidian-400 mb-6 md:mb-10 leading-relaxed font-medium">
              Position your identity. Select a transparent PNG for seamless integration. <br />
              <a href="https://www.flaticon.com/free-icons/logo" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700 hover:underline transition-colors">Find sample logos</a> to get started.
            </p>

            <UploadLogo />
          </div>
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-obsidian-50 to-obsidian-100/30 p-6 md:p-8 rounded-4xl border border-obsidian-100/50 space-y-4">
          <h4 className="text-[9px] md:text-[10px] font-black text-obsidian-900 mb-3 md:mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-glow-pulse" />
            Quick Actions
          </h4>

          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {[
              { label: '📍 Center', onClick: handleCenterLogo, disabled: !hasDesign },
              { label: '📋 F→B', onClick: handleCopyFrontToBack, disabled: !design.front.logo },
              { label: '📋 B→F', onClick: handleCopyBackToFront, disabled: !design.back.logo },
            ].map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={action.onClick}
                disabled={action.disabled}
                className="px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white border-2 border-obsidian-100 text-[8px] md:text-xs font-black uppercase tracking-widest text-obsidian-700 hover:border-gold-400 hover:bg-gold-50 hover:shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {action.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Numeric Controls */}
        <motion.div variants={itemVariants}>
          <NumericControls />
        </motion.div>

        {/* Interactive Tips */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-gold-50 to-amber-50 p-6 md:p-8 rounded-4xl border border-gold-100/50">
          <h4 className="text-[9px] md:text-[10px] font-black text-gold-900 mb-3 md:mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            Editor Tips
          </h4>
          <ul className="space-y-2 md:space-y-3">
            {[
              { icon: '🖱️', text: 'Drag to reposition' },
              { icon: '🖱️', text: 'Hover to see handles' },
              { icon: '⌨️', text: 'Scroll to resize' },
              { icon: '📍', text: 'Use Center button' }
            ].map((tip, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-2 md:gap-3 text-[11px] md:text-xs font-bold text-gold-800/70"
              >
                <span className="text-xs md:text-sm">{tip.icon}</span>
                {tip.text}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Craftsmanship Section */}
        <motion.div variants={itemVariants} className="bg-obsidian-900 p-10 rounded-4xl text-white shadow-luxury group overflow-hidden relative">
           <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-3xl -mb-24 -mr-24 transition-transform group-hover:scale-150 duration-1000" />
           <div className="absolute top-0 left-0 w-32 h-32 bg-gold-500/3 rounded-full blur-3xl -mt-16 -ml-16" />
           <h4 className="text-[10px] font-black text-gold-500/70 mb-4 uppercase tracking-[0.3em]">Craftsmanship</h4>
           <p className="text-sm text-obsidian-300 leading-relaxed font-medium">
             Each piece is treated with precision. Our screen-printing process ensures your {product.color} tee remains vibrant after countless washes.
           </p>
           <div className="mt-4 flex gap-4">
             {['Premium', 'Durable', 'Vibrant'].map((tag) => (
               <span key={tag} className="text-[9px] font-black text-gold-500/50 uppercase tracking-widest">{tag}</span>
             ))}
           </div>
        </motion.div>

        {/* Quantity and Order Section */}
        <motion.div variants={itemVariants} className="pt-4 space-y-4 md:space-y-6">
          <div className="bg-white p-4 md:p-6 rounded-3xl md:rounded-4xl border border-obsidian-100 flex items-center justify-between shadow-soft">
            <span className="text-[9px] md:text-[10px] font-black text-obsidian-400 uppercase tracking-widest">Qty</span>
            <div className="flex items-center gap-4 md:gap-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-obsidian-100 flex items-center justify-center text-obsidian-400 hover:border-gold-500 hover:text-gold-600 transition-all font-black text-lg md:text-xl"
              >
                −
              </motion.button>
              <span className="text-lg md:text-xl font-black text-obsidian-900 min-w-[2rem] text-center">{quantity}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-obsidian-100 flex items-center justify-center text-obsidian-400 hover:border-gold-500 hover:text-gold-600 transition-all font-black text-lg md:text-xl"
              >
                +
              </motion.button>
            </div>
          </div>

          <Button
             onClick={() => setShowOrderPreview(true)}
             className="w-full h-16 md:h-20 rounded-3xl md:rounded-4xl text-lg md:text-xl font-black bg-gradient-to-r from-obsidian-900 to-obsidian-800 hover:from-gold-600 hover:to-gold-500 shadow-luxury gap-3 md:gap-5 transition-all disabled:opacity-20 disabled:scale-100"
             disabled={!design.front.logo && !design.back.logo}
          >
            ORDER NOW
          </Button>

          {/* Share Design */}
          {(design.front.logo || design.back.logo) && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                const text = `Check out my custom ${product.color} tee design on Coded Clothing! 🎨👕`;
                const url = window.location.href;
                if (navigator.share) {
                  navigator.share({ title: 'My Coded Clothing Design', text, url }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
                    addToast('Link copied to clipboard!', 'success');
                  });
                }
              }}
              className="w-full py-4 rounded-2xl border-2 border-obsidian-100 text-obsidian-400 font-bold text-xs uppercase tracking-widest hover:border-gold-400 hover:text-gold-600 transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>
              </svg>
              Share Design
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      {/* Order Preview Modal */}
      <Modal isOpen={showOrderPreview} onClose={() => setShowOrderPreview(false)} title="Order Preview">
        <div className="space-y-4 text-sm">
          <div className="bg-gradient-to-br from-obsidian-50 to-white p-5 rounded-2xl border border-obsidian-100">
            <h4 className="font-black text-obsidian-900 mb-3 text-xs uppercase tracking-wider">Product Details</h4>
            <div className="space-y-2 text-obsidian-600">
              <p className="flex justify-between"><span>Item:</span> <span className="font-bold text-obsidian-900">{product.color} Premium Tee</span></p>
              <p className="flex justify-between"><span>Price:</span> <span className="font-bold text-obsidian-900">{formatPrice(product.price)}</span></p>
              <p className="flex justify-between"><span>Quantity:</span> <span className="font-bold text-obsidian-900">{quantity}</span></p>
              <div className="section-divider my-3" />
              <p className="flex justify-between text-base"><span className="font-bold">Total:</span> <span className="font-black gradient-text-gold text-lg">{formatPrice(product.price * quantity)}</span></p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gold-50 to-amber-50/30 p-5 rounded-2xl border border-gold-100/50">
            <h4 className="font-black text-obsidian-900 mb-3 text-xs uppercase tracking-wider">Design Details</h4>
            <div className="space-y-2 text-obsidian-600">
              <p className="flex justify-between"><span>Front Logo:</span> <span className={`font-bold ${design.front.logo ? 'text-gold-600' : 'text-obsidian-300'}`}>{design.front.logo ? '✓ Applied' : '✕ None'}</span></p>
              <p className="flex justify-between"><span>Back Logo:</span> <span className={`font-bold ${design.back.logo ? 'text-gold-600' : 'text-obsidian-300'}`}>{design.back.logo ? '✓ Applied' : '✕ None'}</span></p>
            </div>
          </div>
          <p className="text-[11px] text-obsidian-400 leading-relaxed">Click "Send to WhatsApp" to place your order. Our artisan team will contact you for payment and production details.</p>
        </div>
        <div className="flex gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowOrderPreview(false)}
            className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-obsidian-200 text-obsidian-600 font-bold hover:bg-obsidian-50 transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowOrderPreview(false);
              handleWhatsAppOrder();
            }}
            className="flex-1 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-obsidian-900 to-obsidian-800 text-white font-bold hover:from-gold-600 hover:to-gold-500 transition-all shadow-luxury"
          >
            Send to WhatsApp
          </motion.button>
        </div>
      </Modal>
    </>
  );
}