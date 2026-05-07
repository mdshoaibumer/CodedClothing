/**
 * CustomizePageHeader.jsx — Design Studio Top Bar
 * 
 * Contains: Back navigation, product info, price display,
 * "Add to Cart" action with download-as-PNG, and size guide modal.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { formatPrice } from '../../features/product/product.utils';
import useToastStore from '../../features/notifications/store/useToastStore';
import useCustomizationStore from '../../features/customization/store/useCustomizationStore';
import { Modal } from '../../components/ui/Modal';

export default function CustomizePageHeader({ product, previewRef, hasDesign }) {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const { activeView, resetDesign, undo, redo, history } = useCustomizationStore();

  const [isExporting, setIsExporting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `coded-clothing-${product.color}-${activeView}.png`;
      link.href = dataUrl;
      link.click();
      addToast('Design downloaded!', 'success');
    } catch (err) {
      console.error('Export failed', err);
      addToast('Failed to download design', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12"
      >
        <div className="space-y-3">
          {/* Breadcrumbs for wayfinding */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-obsidian-300">
            <Link to="/" className="hover:text-gold-600 transition-colors">Collection</Link>
            <span aria-hidden="true">›</span>
            <Link to={`/product/${product.id}`} className="hover:text-gold-600 transition-colors">{product.color}</Link>
            <span aria-hidden="true">›</span>
            <span className="text-gold-600">Customize</span>
          </nav>
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-obsidian-100 text-xs font-black uppercase tracking-[0.2em] text-obsidian-400 hover:text-obsidian-900 hover:border-obsidian-900 transition-all group shadow-sm hover:shadow-md"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
          </motion.button>
          <h1 className="text-4xl md:text-5xl font-black text-obsidian-900 tracking-tighter leading-none">
            Design <span className="gradient-text-gold">Studio</span>
          </h1>
          <div className="flex items-center gap-3">
             <div className="h-px w-8 bg-gradient-to-r from-gold-500 to-transparent" />
             <p className="text-sm text-obsidian-400 font-bold uppercase tracking-widest">
                {product.color} <span className="mx-2 text-gold-400">|</span> {formatPrice(product.price)}
             </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
           <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowHelp(true)}
              className="px-6 py-3 rounded-2xl bg-gold-50 border-2 border-gold-200/50 text-xs font-black uppercase tracking-widest text-gold-700 hover:border-gold-400 hover:bg-gold-100 transition-all"
           >
              Help
           </motion.button>
           <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              disabled={!hasDesign || isExporting}
              className="px-6 py-3 rounded-2xl bg-white border-2 border-obsidian-100 text-xs font-black uppercase tracking-widest text-obsidian-900 hover:border-obsidian-900 hover:shadow-lg transition-all disabled:opacity-30 flex items-center gap-2"
           >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              {isExporting ? 'Exporting...' : 'Download'}
           </motion.button>
           <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all designs? This action cannot be undone.')) {
                  resetDesign();
                }
              }}
              disabled={!hasDesign}
              className="px-6 py-3 rounded-2xl border-2 border-obsidian-100 text-xs font-black uppercase tracking-widest text-obsidian-400 hover:text-red-500 hover:border-red-400 transition-all disabled:opacity-0"
           >
              Clear
           </motion.button>
           <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { undo(); }}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
              className="px-3 py-3 rounded-2xl border-2 border-obsidian-100 text-sm font-black text-obsidian-400 hover:text-gold-600 hover:border-gold-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
           >
              ↶
           </motion.button>
           <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { redo(); }}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
              className="px-3 py-3 rounded-2xl border-2 border-obsidian-100 text-sm font-black text-obsidian-400 hover:text-gold-600 hover:border-gold-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
           >
              ↷
           </motion.button>
        </div>
      </motion.div>

      {/* Help Modal */}
      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Design Studio Guide">
        <div className="space-y-5 text-sm text-obsidian-500">
          <div className="bg-gradient-to-br from-gold-50 to-gold-100/30 p-5 rounded-2xl">
            <h4 className="font-black text-obsidian-900 mb-2 flex items-center gap-2">
              <span className="text-gold-500">◈</span> Getting Started
            </h4>
            <p>Upload a transparent PNG logo for best results. The design zone shows where your logo will be printed.</p>
          </div>
          <div className="bg-obsidian-50 p-5 rounded-2xl">
            <h4 className="font-black text-obsidian-900 mb-2 flex items-center gap-2">
              <span className="text-gold-500">◇</span> Customization
            </h4>
            <ul className="list-none space-y-2">
              {['Drag the logo to reposition it', 'Use corner handles to resize', 'Scroll with mouse wheel for quick scaling', 'Use the scale slider for precise control'].map((tip) => (
                <li key={tip} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-gold-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-obsidian-50 p-5 rounded-2xl">
            <h4 className="font-black text-obsidian-900 mb-2 flex items-center gap-2">
              <span className="text-gold-500">△</span> Keyboard Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white rounded-lg text-xs font-bold border shadow-sm">Ctrl+Z</kbd>
                <span className="text-xs">Undo</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white rounded-lg text-xs font-bold border shadow-sm">Ctrl+Y</kbd>
                <span className="text-xs">Redo</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
