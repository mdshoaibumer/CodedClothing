/**
 * RelatedProducts.jsx — "You May Also Like" cross-sell section
 * 
 * Shows other products from the collection, excluding the current product.
 * Displayed on the product detail page.
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { products } from '../../data/products';

export default function RelatedProducts({ currentProductId }) {
  const related = useMemo(() => {
    // Show related products from the same category first, then others
    const current = products.find(p => p.id === currentProductId);
    const sameCategory = products.filter(p => p.id !== currentProductId && p.category === current?.category);
    const others = products.filter(p => p.id !== currentProductId && p.category !== current?.category);
    return [...sameCategory, ...others].slice(0, 4);
  }, [currentProductId]);

  if (related.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-16"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-black text-gold-600 uppercase tracking-[0.5em] block mb-2">Explore More</span>
          <h2 className="text-2xl md:text-3xl font-black text-obsidian-900 tracking-tighter">You May Also Like</h2>
        </div>
        <Link
          to="/"
          className="hidden md:inline-flex items-center gap-2 text-xs font-black text-obsidian-400 uppercase tracking-widest hover:text-gold-600 transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {related.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Link
              to={`/product/${product.id}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-obsidian-100/50 hover:shadow-luxury transition-all duration-500"
            >
              <div className="aspect-square bg-obsidian-50 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.color}
                  className="w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                {product.label && (
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-2xs font-black px-2 py-1 rounded-full text-obsidian-800 uppercase tracking-widest">
                    {product.label}
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3.5 h-3.5 rounded-full ring-1 ring-obsidian-200" style={{ backgroundColor: product.hex }} />
                  <h3 className="text-xs font-bold text-obsidian-900 group-hover:text-gold-600 transition-colors truncate">
                    {product.color}
                  </h3>
                </div>
                <p className="text-sm font-black text-obsidian-900">₹{product.price}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
