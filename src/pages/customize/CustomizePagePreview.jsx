/**
 * CustomizePagePreview.jsx — Design Studio Canvas Area
 * 
 * Central preview panel with front/back view toggle.
 * Renders the CanvasPreview component with zoom/pan support.
 * Shows onboarding guidance when no design is applied.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import CanvasPreview from '../../features/customization/components/CanvasPreview';
import useCustomizationStore from '../../features/customization/store/useCustomizationStore';

export default function CustomizePagePreview({ product, previewRef }) {
  const { activeView, setActiveView, design } = useCustomizationStore();
  const hasAnyDesign = design.front.logo || design.back.logo;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="lg:col-span-8 relative"
    >
      {/* Premium canvas wrapper */}
      <div className="relative rounded-4xl overflow-hidden shadow-luxury bg-gradient-to-br from-obsidian-50 to-white">
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gold-300/30 rounded-tl-xl pointer-events-none z-20" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gold-300/30 rounded-tr-xl pointer-events-none z-20" />
        <div className="absolute bottom-16 left-4 w-8 h-8 border-b-2 border-l-2 border-gold-300/30 rounded-bl-xl pointer-events-none z-20" />
        <div className="absolute bottom-16 right-4 w-8 h-8 border-b-2 border-r-2 border-gold-300/30 rounded-br-xl pointer-events-none z-20" />

        <div ref={previewRef}>
          <CanvasPreview product={product} />
        </div>

        {/* Onboarding overlay — shown when no logo has been uploaded yet */}
        <AnimatePresence>
          {!hasAnyDesign && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gold-200/50 shadow-luxury px-8 py-6 text-center max-w-xs">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-3xl mb-3"
                >
                  🎨
                </motion.div>
                <h4 className="text-xs font-black text-obsidian-900 uppercase tracking-widest mb-2">Start Designing</h4>
                <p className="text-[11px] text-obsidian-400 leading-relaxed">
                  Upload a logo using the panel on the right to begin customizing your tee.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-gold-600 uppercase tracking-widest">
                  <span>→</span>
                  <span>Upload Panel</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
