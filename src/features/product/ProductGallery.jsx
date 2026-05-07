/**
 * ProductGallery.jsx — Product Collection Grid
 * 
 * Animated grid of TShirtCards with staggered entrance.
 * Uses Framer Motion's useInView for scroll-triggered reveal.
 */

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { tshirts } from '../../data/tshirts';
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

const itemVariants = {
  hidden: { opacity: 0, y: 100, scale: 0.8, filter: 'blur(12px)', rotateX: 15 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotateX: 0,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function ProductGallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="flex flex-col gap-6" ref={ref}>
      {/* Section header - enhanced */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-glow-pulse" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-gold-500 animate-ping opacity-30" />
          </div>
          <span className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.3em]">
            {tshirts.length} Premium Styles Available
          </span>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="hidden md:flex items-center gap-2 text-[10px] text-obsidian-300 uppercase tracking-wider font-bold"
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

      {/* Premium grid with stagger animation and perspective */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7"
        style={{ perspective: '1500px' }}
      >
        {tshirts.map((shirt, index) => (
          <motion.div 
            key={shirt.id} 
            variants={itemVariants}
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
      </motion.div>
    </div>
  );
}