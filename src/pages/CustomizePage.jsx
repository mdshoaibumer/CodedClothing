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
import Breadcrumb from '../components/ui/Breadcrumb';

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          const { undo } = useCustomizationStore.getState();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) {
          const { redo } = useCustomizationStore.getState();
          redo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        if (canRedo) {
          const { redo } = useCustomizationStore.getState();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo]);

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
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Home', to: '/' },
        { label: product.color, to: `/product/${id}` },
        { label: 'Customize' },
      ]} />
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
    </motion.div>
  );
}
