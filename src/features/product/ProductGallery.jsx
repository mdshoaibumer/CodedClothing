/**
 * ProductGallery.jsx — Product Collection Grid
 * 
 * Animated grid of product cards with staggered entrance.
 * Includes category tabs, color filtering, and sort options.
 * Uses Framer Motion's useInView for scroll-triggered reveal.
 */

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import { products, CATEGORIES } from '../../data/products';
import TShirtCard from '../../components/product/TShirtCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'name', label: 'Name: A → Z' },
];

export default function ProductGallery({ category = 'all' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState(category);
  const [activeColor, setActiveColor] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Products for active category
  const categoryProducts = useMemo(() => {
    return activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  // Unique colors from the active category
  const colors = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const p of categoryProducts) {
      if (!seen.has(p.hex)) {
        seen.add(p.hex);
        list.push({ hex: p.hex, label: p.color });
      }
    }
    return [{ hex: 'all', label: 'All' }, ...list];
  }, [categoryProducts]);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = activeColor === 'all' ? [...categoryProducts] : categoryProducts.filter(t => t.hex === activeColor);
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.color.localeCompare(b.color)); break;
      default: break;
    }
    return result;
  }, [categoryProducts, activeColor, sortBy]);

  // Reset color filter when category changes
  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    setActiveColor('all');
  };

  return (
    <div className="flex flex-col gap-6" ref={ref}>
      {/* Category tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.05, duration: 0.5 }}
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1"
      >
        <button
          onClick={() => handleCategoryChange('all')}
          className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 border ${
            activeCategory === 'all'
              ? 'bg-obsidian-900 text-white border-obsidian-900 shadow-lg'
              : 'bg-white text-obsidian-400 border-obsidian-100 hover:border-obsidian-300'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all duration-300 border whitespace-nowrap ${
              activeCategory === cat.slug
                ? 'bg-obsidian-900 text-white border-obsidian-900 shadow-lg'
                : 'bg-white text-obsidian-400 border-obsidian-100 hover:border-obsidian-300'
            }`}
          >
            <span className="mr-1.5">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-glow-pulse" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-gold-500 animate-ping opacity-30" />
          </div>
          <span className="text-xs font-black text-obsidian-400 uppercase tracking-[0.3em]">
            {filtered.length} Premium Style{filtered.length !== 1 ? 's' : ''} Available
          </span>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="hidden md:flex items-center gap-2 text-xs text-obsidian-300 uppercase tracking-wider font-bold"
        >
          <span>Scroll to explore</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↓
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Filters & Sort */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4"
      >
        {/* Color filters */}
        <div className="flex items-center gap-2 flex-wrap" role="radiogroup" aria-label="Filter by color">
          {colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => setActiveColor(c.hex)}
              aria-label={`Filter by ${c.label}`}
              aria-checked={activeColor === c.hex}
              role="radio"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                activeColor === c.hex
                  ? 'border-obsidian-900 bg-obsidian-900 text-white shadow-lg'
                  : 'border-obsidian-100 text-obsidian-400 hover:border-obsidian-300 bg-white'
              }`}
            >
              {c.hex !== 'all' && (
                <span className="w-3 h-3 rounded-full ring-1 ring-obsidian-200" style={{ backgroundColor: c.hex }} />
              )}
              <span>{c.hex === 'all' ? 'All' : c.label.split(' ').pop()}</span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort products"
          className="px-4 py-2.5 rounded-xl border border-obsidian-100 text-xs font-bold text-obsidian-500 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </motion.div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <span className="text-6xl block mb-4 opacity-30">◇</span>
          <h3 className="text-lg font-bold text-obsidian-900 mb-2">No products match your filter</h3>
          <p className="text-sm text-obsidian-400 mb-6">Try selecting a different color or resetting filters.</p>
          <button
            onClick={() => setActiveColor('all')}
            className="text-gold-600 font-bold text-xs uppercase tracking-widest hover:text-gold-700"
          >
            Show All Products
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7"
          style={{ perspective: '1500px' }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((shirt, index) => (
              <motion.div 
                key={shirt.id} 
                layout
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                custom={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  filter: hoveredIndex !== null && hoveredIndex !== index ? 'brightness(0.7) saturate(0.5)' : 'none',
                  transition: 'filter 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <TShirtCard product={shirt} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
