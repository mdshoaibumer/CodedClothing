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
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeView, setActiveView] = useState('front');

  const product = getProductById(id);
  const sizes = getAvailableSizes();

  const handleCustomize = () => {
    navigate(`/customize/${id}`);
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
      className="flex flex-col md:flex-row gap-8 lg:gap-16 bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-luxury relative overflow-hidden border border-white/50"
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
              <thead className="bg-obsidian-50 text-obsidian-400 font-black uppercase tracking-widest text-[10px]">
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
        <div className="relative bg-gradient-to-br from-obsidian-50 to-obsidian-100/30 rounded-[2rem] overflow-hidden aspect-[3/4] md:aspect-square lg:aspect-[3/4] group">
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
            <Badge className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-obsidian-800 shadow-md border-none px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[9px]">
              {product.label}
            </Badge>
          )}
          
          {/* Active View Label */}
          <motion.div
            key={activeView + '-label'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-obsidian-900/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 text-[9px] font-black text-white/70 uppercase tracking-[0.2em] pointer-events-none"
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
              <img src={url} alt={key} className="w-full h-full object-contain p-2 mix-blend-multiply" />
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
          className="text-sm text-obsidian-400 hover:text-obsidian-900 mb-8 w-fit flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Collection
        </motion.button>

        <h1 className="text-4xl md:text-5xl font-black text-obsidian-900 mb-3 tracking-tighter leading-tight">
          Premium Cotton Tee
        </h1>
        
        <div className="flex items-center gap-4 mb-8">
          <p className="text-3xl font-black gradient-text-gold">{formatPrice(product.price)}</p>
          <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-full">
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
              <span className="text-[10px] font-bold text-obsidian-400 uppercase tracking-wider">{feature.label}</span>
            </div>
          ))}
        </div>

        <div className="section-divider mb-8" />

        <div className="mb-8">
          <h3 className="text-[10px] font-black text-obsidian-400 mb-4 uppercase tracking-[0.2em]">
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
            <h3 className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.2em]">
              Select Size
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-[10px] text-gold-600 font-black uppercase tracking-widest hover:text-gold-700 transition-colors"
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

        {/* Call to action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-2xl border-t border-gold-200/20 md:relative md:border-t-0 md:bg-transparent md:p-0 z-40">
          <motion.button
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCustomize}
            className="w-full bg-obsidian-900 hover:bg-obsidian-800
                       text-white font-black text-base uppercase tracking-[0.2em]
                       py-6 rounded-2xl shadow-luxury hover:shadow-luxury-hover transition-all duration-500
                       relative overflow-hidden group btn-liquid"
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold-600/0 via-gold-600/20 to-gold-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {/* Shimmer sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 delay-100" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              <motion.svg 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
              </motion.svg>
              Design This Tee
            </span>
          </motion.button>
        </div>
        <div className="h-24 md:hidden"></div>
      </motion.div>
    </motion.div>
  );
}
