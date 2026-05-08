/**
 * ProductDetail.jsx — Full Product View Component
 * 
 * Displays single product with image gallery, color/size selection,
 * pricing, and "Customize" CTA. Uses URL params for product ID.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductById, getAvailableSizes, formatPrice } from './product.utils';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [activeView, setActiveView] = useState('front');

  const product = getProductById(id);
  const sizes = getAvailableSizes();

  const handleCustomize = () => {
    navigate(`/customize/${id}?size=${selectedSize}`);
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    if (!phoneNumber) {
      setIsOrderOpen(false);
      return;
    }
    const text = `*New Order — Coded Clothing*\n\n` +
      `*Product:* ${product.color} Premium Cotton Tee\n` +
      `*Size:* ${selectedSize}\n` +
      `*Quantity:* ${quantity}\n` +
      `*Unit Price:* ${formatPrice(product.price)}\n` +
      `*Total:* ${formatPrice(product.price * quantity)}\n\n` +
      `_Plain tee (no custom design)_`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setIsOrderOpen(false);
  };

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Product not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-gold-600 underline">
          Return to Collection
        </button>
      </div>
    );
  }

  const sizeChart = [
    { size: 'S', chest: '38"', length: '27"' },
    { size: 'M', chest: '40"', length: '28"' },
    { size: 'L', chest: '42"', length: '29"' },
    { size: 'XL', chest: '44"', length: '30"' },
    { size: 'XXL', chest: '46"', length: '31"' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row gap-8 lg:gap-16 bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-4xl shadow-luxury relative overflow-hidden border border-white/50"
    >
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gold-100/20 to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-gold-50/30 to-transparent rounded-tr-full pointer-events-none" />
      
      {/* Animated corner brackets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 0.8 }}
        className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-gold-400/40 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-gold-400/40 pointer-events-none"
      />
      
      {/* Size Guide Modal */}
      <Modal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)}
        title="Size Guide"
      >
        <div className="space-y-6">
          <p className="text-sm text-obsidian-400 font-medium">
            Measurements are in inches. All our tees are pre-shrunk and feature a premium tailored fit.
          </p>
          <div className="overflow-hidden rounded-2xl border border-obsidian-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-obsidian-50 text-obsidian-400 font-black uppercase tracking-widest text-xs">
                <tr>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Chest</th>
                  <th className="px-6 py-4">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-50 font-bold text-obsidian-900">
                {sizeChart.map((row) => (
                  <tr key={row.size} className={selectedSize === row.size ? "bg-gold-50/50" : ""}>
                    <td className="px-6 py-4">{row.size}</td>
                    <td className="px-6 py-4">{row.chest}</td>
                    <td className="px-6 py-4">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gold-50/50 p-4 rounded-xl flex items-start gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5" />
             <p className="text-xs text-gold-700 font-medium leading-relaxed">
               Tip: For an oversized look, we recommend ordering one size up from your standard fit.
             </p>
          </div>
        </div>
      </Modal>

      {/* Product Image & Gallery */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-1/2 flex flex-col gap-5"
      >
        <div className="relative bg-gradient-to-br from-obsidian-50 to-obsidian-100/30 rounded-4xl overflow-hidden aspect-[3/4] md:aspect-square lg:aspect-[3/4] group">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeView}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              src={product.views?.[activeView] || product.image} 
              alt={`${product.color} - ${activeView}`} 
              className="object-contain w-full h-full mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
            />
          </AnimatePresence>
          {product.label && (
            <Badge className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-obsidian-800 shadow-md border-none px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-xs">
              {product.label}
            </Badge>
          )}
          
          {/* Active View Label */}
          <motion.div
            key={activeView + '-label'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-obsidian-900/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 text-xs font-black text-white/70 uppercase tracking-[0.2em] pointer-events-none"
          >
            {activeView.replace('_', ' ')}
          </motion.div>

          {/* Ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>

        {/* Thumbnail Switcher */}
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(product.views || {}).map(([key, url]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveView(key)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                activeView === key 
                  ? 'border-obsidian-900 bg-white shadow-luxury ring-4 ring-gold-500/10' 
                  : 'border-obsidian-100 bg-obsidian-50 hover:border-obsidian-300'
              }`}
            >
              <img src={url} alt={key} className="w-full h-full object-contain p-2 mix-blend-multiply" loading="lazy" decoding="async" />
              {activeView === key && (
                <motion.div
                  layoutId="activeThumb"
                  className="absolute inset-0 border-2 border-gold-500/30 rounded-2xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Product Details */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full md:w-1/2 flex flex-col justify-center relative"
      >
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate('/')}
          className="text-sm text-obsidian-400 hover:text-obsidian-900 mb-8 w-fit flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Collection
        </motion.button>

        <h1 className="text-4xl md:text-5xl font-black text-obsidian-900 mb-3 tracking-tighter leading-tight">
          Premium Cotton Tee
        </h1>
        
        <div className="flex items-center gap-4 mb-8">
          <p className="text-3xl font-black gradient-text-gold">{formatPrice(product.price)}</p>
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-black uppercase tracking-wider rounded-full">
            In Stock
          </span>
        </div>

        <p className="text-sm text-obsidian-400 mb-10 leading-relaxed font-medium max-w-sm">
          Crafted from 100% long-staple Egyptian cotton. Breathable, durable, and engineered for the perfect custom print with vibrant color reproduction.
        </p>

        {/* Premium features */}
        <div className="flex gap-6 mb-10">
          {[
            { icon: '◈', label: 'Egyptian Cotton' },
            { icon: '◇', label: 'Pre-Shrunk' },
            { icon: '△', label: 'Premium Print' },
          ].map((feature) => (
            <div key={feature.label} className="flex items-center gap-2">
              <span className="text-gold-500 text-xs">{feature.icon}</span>
              <span className="text-xs font-bold text-obsidian-400 uppercase tracking-wider">{feature.label}</span>
            </div>
          ))}
        </div>

        <div className="section-divider mb-8" />

        <div className="mb-8">
          <h3 className="text-xs font-black text-obsidian-400 mb-4 uppercase tracking-[0.2em]">
            Surface Color
          </h3>
          <div className="flex items-center gap-3 glass-card p-4 rounded-2xl w-fit">
            <div className="relative">
              <div 
                className="w-6 h-6 rounded-full shadow-inner ring-2 ring-obsidian-100" 
                style={{ backgroundColor: product.hex }}
              />
              <div 
                className="absolute inset-0 rounded-full blur-md opacity-30"
                style={{ backgroundColor: product.hex }}
              />
            </div>
            <span className="text-obsidian-900 font-bold text-sm tracking-tight">{product.color}</span>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-xs font-black text-obsidian-400 uppercase tracking-[0.2em]">
              Select Size
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-xs text-gold-600 font-black uppercase tracking-widest hover:text-gold-700 transition-colors"
            >
              Size Guide →
            </motion.button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {sizes.map(size => (
              <motion.button
                key={size}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSize(size)}
                className={`py-4 rounded-2xl border-2 text-xs font-black transition-all duration-300 ${
                  selectedSize === size 
                    ? 'border-obsidian-900 bg-obsidian-900 text-white shadow-luxury' 
                    : 'border-obsidian-100 text-obsidian-400 hover:border-gold-500 hover:text-gold-600'
                }`}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quantity selector */}
        <div className="mb-8">
          <h3 className="text-xs font-black text-obsidian-400 mb-4 uppercase tracking-[0.2em]">Quantity</h3>
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 rounded-xl border-2 border-obsidian-100 flex items-center justify-center text-obsidian-400 hover:border-gold-500 hover:text-gold-600 transition-all font-bold text-lg"
            >
              −
            </motion.button>
            <span className="w-12 text-center text-lg font-black text-obsidian-900">{quantity}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-12 h-12 rounded-xl border-2 border-obsidian-100 flex items-center justify-center text-obsidian-400 hover:border-gold-500 hover:text-gold-600 transition-all font-bold text-lg"
            >
              +
            </motion.button>
          </div>
        </div>

        {/* Call to action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-2xl border-t border-gold-200/20 md:relative md:border-t-0 md:bg-transparent md:p-0 z-40 space-y-3">
          <motion.button
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOrderOpen(true)}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600
                       text-white font-black text-sm uppercase tracking-[0.15em]
                       py-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)] hover:shadow-[0_25px_50px_-10px_rgba(34,197,94,0.4)] transition-all duration-500
                       relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order on WhatsApp — {formatPrice(product.price * quantity)}
            </span>
          </motion.button>
          <motion.button
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCustomize}
            className="w-full bg-obsidian-900 hover:bg-obsidian-800
                       text-white font-black text-sm uppercase tracking-[0.15em]
                       py-5 rounded-2xl shadow-luxury hover:shadow-luxury-hover transition-all duration-500
                       relative overflow-hidden group btn-liquid"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-600/0 via-gold-600/20 to-gold-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
              </svg>
              Customize This Tee
            </span>
          </motion.button>
        </div>
        <div className="h-32 md:hidden"></div>

        {/* Order Confirmation Modal */}
        <Modal
          isOpen={isOrderOpen}
          onClose={() => setIsOrderOpen(false)}
          title="Order Summary"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-obsidian-50 overflow-hidden flex-shrink-0">
                <img src={product.image} alt={product.color} className="w-full h-full object-contain mix-blend-multiply p-2" />
              </div>
              <div>
                <h4 className="font-bold text-obsidian-900 text-sm">Premium Cotton Tee</h4>
                <p className="text-xs text-obsidian-400">{product.color}</p>
              </div>
            </div>

            <div className="divide-y divide-obsidian-50 text-sm">
              <div className="flex justify-between py-3">
                <span className="text-obsidian-400 font-medium">Size</span>
                <span className="font-bold text-obsidian-900">{selectedSize}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-obsidian-400 font-medium">Quantity</span>
                <span className="font-bold text-obsidian-900">{quantity}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-obsidian-400 font-medium">Unit Price</span>
                <span className="font-bold text-obsidian-900">{formatPrice(product.price)}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-obsidian-400 font-medium">Custom Design</span>
                <span className="font-bold text-obsidian-900">None (plain)</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-bold text-obsidian-900">Total</span>
                <span className="font-black text-lg gradient-text-gold">{formatPrice(product.price * quantity)}</span>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
              <p className="text-xs text-green-700 font-medium leading-relaxed">
                You&rsquo;ll be redirected to WhatsApp to complete your order. Payment details will be shared there.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsOrderOpen(false)}
                className="flex-1 py-4 rounded-xl border-2 border-obsidian-100 text-obsidian-400 font-bold text-xs uppercase tracking-widest hover:border-obsidian-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleWhatsAppOrder}
                className="flex-1 py-4 rounded-xl bg-green-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Confirm Order
              </button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </motion.div>
  );
}
