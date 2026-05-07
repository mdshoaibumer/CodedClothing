/**
 * TShirtCard.jsx — Product Card with 3D Tilt Effect
 * 
 * Interactive product card for the collection grid.
 * Features physics-based 3D tilt on mouse move, image lazy loading
 * with skeleton placeholder, and staggered entrance animations.
 */

import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Skeleton } from '../ui/Skeleton';

export default function TShirtCard({ product, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  // 3D Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, scale: 0.85, rotateX: 15 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{ duration: 1, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="perspective-1000"
    >
      <Link
        to={`/product/${product.id}`}
        className="group relative flex flex-col bg-white rounded-3xl overflow-hidden
                   shadow-soft hover:shadow-luxury transition-all duration-700 ease-luxury
                   gradient-border cursor-view holographic-card card-3d-pop"
      >
        {/* Ambient glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold-100/0 to-gold-200/0 group-hover:from-gold-100/20 group-hover:to-gold-200/15 transition-all duration-500 rounded-3xl z-10 pointer-events-none" />

        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-obsidian-50 to-obsidian-100/50">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <motion.img
            src={product.image}
            alt={`${product.color} T-Shirt`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`object-cover w-full h-full ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transition: 'opacity 0.5s ease' }}
          />

          {product.label && (
            <span
              className="absolute top-4 left-4
                         bg-white/90 backdrop-blur-xl text-[9px] font-black
                         px-3 py-1.5 rounded-full
                         text-obsidian-800 shadow-lg border border-white/50 z-10
                         uppercase tracking-[0.15em]"
            >
              {product.label}
            </span>
          )}

          {/* Hover overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Shine reflection */}
          <div className="absolute inset-0 bg-gradient-to-bl from-white/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* View CTA with scale animation - enhanced */}
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20, scale: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
          >
            <span className="px-8 py-3.5 bg-obsidian-900/95 backdrop-blur-xl rounded-2xl text-[9px] font-black uppercase tracking-[0.25em] text-white shadow-2xl border border-white/10 whitespace-nowrap flex items-center gap-2 relative overflow-hidden btn-glow-luxury">
              <span className="relative z-10">Explore</span>
              <motion.span className="relative z-10" animate={{ x: isHovered ? [0, 4, 0] : 0 }} transition={{ repeat: Infinity, duration: 1.2 }}>→</motion.span>
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"
              />
            </span>
          </motion.div>
        </div>

        <div className="p-6 flex flex-col gap-3 relative" style={{ transform: 'translateZ(15px)' }}>
          {/* Premium divider line */}
          <motion.div 
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-gold-400/40 to-transparent origin-left"
          />
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                animate={{ scale: isHovered ? 1.4 : 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-5 h-5 rounded-full shadow-inner ring-2 ring-obsidian-100"
                style={{ backgroundColor: product.hex }}
              />
              <motion.div 
                animate={{ opacity: isHovered ? 0.7 : 0, scale: isHovered ? 2.5 : 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full blur-md"
                style={{ backgroundColor: product.hex }}
              />
            </div>
            <h3 className="text-sm font-bold text-obsidian-900 tracking-tight group-hover:text-gold-700 transition-colors duration-300">
              {product.color}
            </h3>
            {/* Premium badge */}
            <motion.span 
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
              className="ml-auto text-[8px] font-black uppercase tracking-[0.2em] text-gold-600 bg-gold-100/50 px-2 py-0.5 rounded-full"
            >
              Premium
            </motion.span>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-obsidian-500">
              From <span className="text-obsidian-900 font-black text-iridescent text-base">₹{product.price}</span>
            </p>
            <motion.div
              animate={{ x: isHovered ? 8 : 0, scale: isHovered ? 1.4 : 1 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
              className="text-obsidian-300 group-hover:text-gold-600 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
