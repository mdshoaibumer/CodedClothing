/**
 * TShirtCard.jsx — Product Card (Performance Optimized)
 * 
 * Interactive product card for the collection grid.
 * Uses CSS transitions for hover effects instead of JS-driven springs.
 * Falls back to SVG placeholder when product images aren't available.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import OptimizedImage from '../ui/OptimizedImage';
import ProductPlaceholder from '../ui/ProductPlaceholder';
import { CATEGORIES } from '../../data/products';

export default function TShirtCard({ product, index = 0 }) {
  const isAboveFold = index < 4;
  const [imgError, setImgError] = useState(false);

  const categoryLabel = CATEGORIES.find(c => c.slug === product.category)?.label || 'Apparel';

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group relative flex flex-col bg-white rounded-3xl overflow-hidden
                   shadow-soft hover:shadow-luxury transition-all duration-500 ease-luxury
                   cursor-view card-premium"
      >
        {/* Ambient glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-100/0 to-gold-200/0 group-hover:from-gold-100/20 group-hover:to-gold-200/15 transition-all duration-500 rounded-3xl z-10 pointer-events-none" />

        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-obsidian-50 to-obsidian-100/50">
          {imgError ? (
            <ProductPlaceholder
              category={product.category}
              hex={product.hex}
              className="w-full h-full"
            />
          ) : (
            <OptimizedImage
              src={product.image}
              alt={`${product.color} ${categoryLabel} — ${product.label || 'Custom Apparel'}`}
              width={400}
              height={533}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={isAboveFold}
              className="w-full h-full"
              onError={() => setImgError(true)}
            />
          )}

          {product.label && (
            <span
              className="absolute top-4 left-4
                         bg-white/90 backdrop-blur-sm text-xs font-black
                         px-3 py-1.5 rounded-full
                         text-obsidian-800 shadow-lg border border-white/50 z-10
                         uppercase tracking-[0.15em]"
            >
              {product.label}
            </span>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-500 opacity-0 group-hover:opacity-100" />

          {/* View CTA */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
            <span className="px-8 py-3.5 bg-obsidian-900/95 backdrop-blur-sm rounded-2xl text-xs font-black uppercase tracking-[0.25em] text-white shadow-2xl border border-white/10 whitespace-nowrap flex items-center gap-2">
              <span>Explore</span>
              <span>→</span>
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-3 relative">
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full shadow-inner ring-2 ring-obsidian-100"
              style={{ backgroundColor: product.hex }}
            />
            <h3 className="text-sm font-bold text-obsidian-900 tracking-tight group-hover:text-gold-700 transition-colors duration-300">
              {product.color}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-obsidian-500">
              From <span className="text-obsidian-900 font-black text-base">₹{product.price}</span>
            </p>
            <div className="text-obsidian-300 group-hover:text-gold-600 group-hover:translate-x-1 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
