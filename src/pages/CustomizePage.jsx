/**
 * CustomizePage.jsx — T-Shirt Customization Studio
 * 
 * Full-featured design editor allowing users to:
 * - Upload logos to front/back of the shirt
 * - Drag, scale, and rotate logo placement
 * - Undo/Redo with keyboard shortcuts (Ctrl+Z / Ctrl+Y)
 * - Export final design as image
 * 
 * State Management: Zustand store with localStorage persistence
 * Layout: 2-column grid (preview + sidebar controls)
 */

import { useRef, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductById } from '../features/product/product.utils';
import useCustomizationStore from '../features/customization/store/useCustomizationStore';

// New modular components
import CustomizePageHeader from './customize/CustomizePageHeader';
import CustomizePagePreview from './customize/CustomizePagePreview';
import CustomizePageSidebar from './customize/CustomizePageSidebar';

export default function CustomizePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const selectedSize = searchParams.get('size') || 'M';
  const navigate = useNavigate();
  const previewRef = useRef(null);

  // Zustand Store
  const { design, history } = useCustomizationStore();

  const product = getProductById(id);
  const hasDesign = design.front.logo || design.back.logo;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  // Keyboard shortcuts — reads fresh state via getState() so no deps needed
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { undo, redo, history: h } = useCustomizationStore.getState();
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (h.past.length > 0) undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (h.future.length > 0) redo();
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        if (h.future.length > 0) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
        <button
          onClick={() => navigate('/collection')}
          className="mt-4 text-gold-600 hover:underline inline-block font-bold uppercase tracking-widest text-xs"
        >
          Return to Collection
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-2 md:px-6 lg:px-8 pb-20 md:pb-12 relative"
    >
      {/* Ambient decorative elements */}
      <div className="absolute -top-20 -right-40 w-[500px] h-[500px] bg-gradient-radial from-gold-200/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-40 w-[400px] h-[400px] bg-gradient-radial from-gold-100/8 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <CustomizePageHeader
        product={product}
        previewRef={previewRef}
        hasDesign={hasDesign}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        <CustomizePagePreview
          product={product}
          previewRef={previewRef}
        />

        <CustomizePageSidebar
          product={product}
          hasDesign={hasDesign}
          selectedSize={selectedSize}
        />
      </div>

      {/* Mobile sticky upload CTA — only shown on small screens when no design yet */}
      {!hasDesign && (
        <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center lg:hidden pointer-events-none">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            onClick={() => {
              document.getElementById('upload-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="pointer-events-auto px-6 py-3 bg-obsidian-900 text-white rounded-full shadow-luxury text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-gold-500/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Upload Logo
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
