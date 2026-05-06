import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { formatPrice } from '../../features/product/product.utils';
import useToastStore from '../../features/notifications/store/useToastStore';
import useCustomizationStore from '../../features/customization/store/useCustomizationStore';
import { Modal } from '../../components/ui/Modal';

/**
 * CustomizePageHeader Component
 * Handles the top section with navigation, title, and action buttons
 */
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all group shadow-sm"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none">Design Studio</h1>
          <div className="flex items-center gap-3">
             <span className="h-px w-8 bg-gray-200" />
             <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                {product.color} <span className="mx-2 opacity-30">/</span> {formatPrice(product.price)}
             </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
           <button
              onClick={() => setShowHelp(true)}
              className="px-6 py-3 rounded-2xl bg-blue-50 border-2 border-blue-100 text-xs font-black uppercase tracking-widest text-blue-600 hover:border-blue-300 hover:bg-blue-100 transition-all"
           >
              Help
           </button>
           <button
              onClick={handleDownload}
              disabled={!hasDesign || isExporting}
              className="px-6 py-3 rounded-2xl bg-white border-2 border-gray-100 text-xs font-black uppercase tracking-widest text-gray-900 hover:border-gray-900 transition-all disabled:opacity-30 flex items-center gap-2"
           >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              {isExporting ? 'Exporting...' : 'Download'}
           </button>
           <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all designs? This action cannot be undone.')) {
                  resetDesign();
                }
              }}
              disabled={!hasDesign}
              className="px-6 py-3 rounded-2xl border-2 border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 hover:border-red-500 transition-all disabled:opacity-0"
           >
              Clear
           </button>
           <button
              onClick={() => { undo(); }}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
              className="px-3 py-3 rounded-2xl border-2 border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
           >
              ↶
           </button>
           <button
              onClick={() => { redo(); }}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
              className="px-3 py-3 rounded-2xl border-2 border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
           >
              ↷
           </button>
        </div>
      </div>

      {/* Help Modal */}
      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} title="Design Studio Guide">
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Getting Started</h4>
            <p>Upload a transparent PNG logo for best results. The design zone shows where your logo will be printed.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Customization</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Drag the logo to reposition it</li>
              <li>Use corner handles to resize</li>
              <li>Scroll with mouse wheel for quick scaling</li>
              <li>Use the scale slider for precise control</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Keyboard Shortcuts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Ctrl+Z: Undo last action</li>
              <li>Ctrl+Y or Ctrl+Shift+Z: Redo</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Tips</h4>
            <p>Use the Center button to quickly position your logo. For both sides, upload once and use copy actions.</p>
          </div>
        </div>
      </Modal>
    </>
  );
}