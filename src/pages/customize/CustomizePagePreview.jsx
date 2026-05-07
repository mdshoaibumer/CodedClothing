/**
 * CustomizePagePreview.jsx — Design Studio Canvas Area
 * 
 * Central preview panel with front/back view toggle.
 * Renders the CanvasPreview component with zoom/pan support.
 */

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import CanvasPreview from '../../features/customization/components/CanvasPreview';
import useCustomizationStore from '../../features/customization/store/useCustomizationStore';

export default function CustomizePagePreview({ product, previewRef }) {
  const { activeView, setActiveView } = useCustomizationStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-8 relative"
    >
      {/* Premium canvas wrapper */}
      <div className="relative rounded-[2rem] overflow-hidden shadow-luxury bg-gradient-to-br from-obsidian-50 to-white">
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold-300/30 rounded-tl-xl pointer-events-none z-20" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold-300/30 rounded-tr-xl pointer-events-none z-20" />
        <div className="absolute bottom-16 left-4 w-8 h-8 border-b-2 border-l-2 border-gold-300/30 rounded-bl-xl pointer-events-none z-20" />
        <div className="absolute bottom-16 right-4 w-8 h-8 border-b-2 border-r-2 border-gold-300/30 rounded-br-xl pointer-events-none z-20" />

        <div ref={previewRef}>
          <CanvasPreview product={product} />
        </div>
      </div>

      {/* Premium view switcher */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-white/90 backdrop-blur-2xl rounded-2xl border border-obsidian-100/50 shadow-luxury z-10">
        {['front', 'back', 'both'].map((view) => (
          <motion.button
            key={view}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveView(view)}
            className={cn(
              "relative px-5 md:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
              activeView === view
                ? "text-white"
                : "text-obsidian-400 hover:text-obsidian-900"
            )}
          >
            {activeView === view && (
              <motion.div
                layoutId="activeView"
                className="absolute inset-0 bg-obsidian-900 rounded-xl shadow-lg"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{view}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}