import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { getProductById, formatPrice } from '../features/product/product.utils';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import useToastStore from '../features/notifications/store/useToastStore';

// Features
import CanvasPreview from '../features/customization/components/CanvasPreview';
import UploadLogo from '../features/customization/components/UploadLogo';
import useCustomizationStore from '../features/customization/store/useCustomizationStore';

export default function CustomizePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const previewRef = useRef(null);
  
  // Zustand Store
  const { 
    activeView, 
    setActiveView, 
    design, 
    resetDesign,
    centerLogo,
    copyDesign,
    undo,
    redo,
    history,
  } = useCustomizationStore();

  // Toast
  const addToast = useToastStore((state) => state.addToast);

  const [quantity, setQuantity] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 text-blue-600 hover:underline inline-block font-bold uppercase tracking-widest text-xs"
        >
          Return to Collection
        </button>
      </div>
    );
  }

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

  const handleCenterLogo = () => {
    if (activeView === 'both') {
      centerLogo('front');
      centerLogo('back');
      addToast('Both logos centered!', 'success');
    } else {
      centerLogo(activeView);
      addToast('Logo centered!', 'success');
    }
  };

  const handleCopyFrontToBack = () => {
    copyDesign('front', 'back');
    addToast('Front design copied to back!', 'success');
  };

  const handleCopyBackToFront = () => {
    copyDesign('back', 'front');
    addToast('Back design copied to front!', 'success');
  };

  const hasDesign = design.front.logo || design.back.logo;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const handleWhatsAppOrder = () => {
    const phoneNumber = "919876543210";
    const text = `*New Custom Order - Coded Clothing* 🎯\n\n` +
      `- *Product:* ${product.color} Premium Tee\n` +
      `- *Quantity:* ${quantity}\n` +
      `- *Front Logo:* ${design.front.logo ? 'Yes' : 'No'}\n` +
      `- *Back Logo:* ${design.back.logo ? 'Yes' : 'No'}\n` +
      `- *Total Price:* ${formatPrice(product.price * quantity)}`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-6 lg:px-8 pb-20 md:pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <button 
            onClick={() => navigate(`/product/${id}`)}
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
              onClick={handleDownload}
              disabled={!hasDesign || isExporting}
              className="px-6 py-3 rounded-2xl bg-white border-2 border-gray-100 text-xs font-black uppercase tracking-widest text-gray-900 hover:border-gray-900 transition-all disabled:opacity-30 flex items-center gap-2"
           >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              {isExporting ? 'Exporting...' : 'Download'}
           </button>
           <button 
              onClick={() => { resetDesign(); setQuantity(1); }} 
              disabled={!hasDesign}
              className="px-6 py-3 rounded-2xl border-2 border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 hover:border-red-500 transition-all disabled:opacity-0"
           >
              Clear
           </button>
           <button
              onClick={() => { undo(); }}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="px-3 py-3 rounded-2xl border-2 border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
           >
              ↶
           </button>
           <button
              onClick={() => { redo(); }}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="px-3 py-3 rounded-2xl border-2 border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
           >
              ↷
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        <div className="lg:col-span-8 relative">
          <div ref={previewRef}>
            <CanvasPreview product={product} />
          </div>

          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 md:p-1.5 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl z-10 flex-wrap justify-center max-w-xs md:max-w-none">
            {['front', 'back', 'both'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={cn(
                  "px-4 md:px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeView === view 
                    ? "bg-gray-900 text-white shadow-lg" 
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
            
            <div className="relative">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <span className="flex items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-2xl bg-gray-900 text-white text-xs md:text-sm font-black italic shadow-lg shadow-gray-900/20">C</span>
                <h3 className="text-[9px] md:text-xs font-black text-gray-900 uppercase tracking-[0.2em]">
                  Brand Assets {activeView !== 'both' && `(${activeView})`}
                </h3>
              </div>
              
              <p className="text-xs md:text-sm text-gray-400 mb-6 md:mb-10 leading-relaxed font-bold">
                Position your identity. Select a transparent PNG for the most seamless integration.
              </p>

              {/* Modular Upload Component */}
              <UploadLogo />
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-8 rounded-[2rem] border border-green-100/50 space-y-4">
            <h4 className="text-[9px] md:text-[10px] font-black text-green-900 mb-3 md:mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Quick Actions
            </h4>
            
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <button
                onClick={handleCenterLogo}
                disabled={!hasDesign}
                className="px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white border-2 border-green-100 text-[8px] md:text-xs font-black uppercase tracking-widest text-green-700 hover:border-green-500 hover:bg-green-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                📍 Center
              </button>
              
              <button
                onClick={handleCopyFrontToBack}
                disabled={!design.front.logo}
                className="px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white border-2 border-green-100 text-[8px] md:text-xs font-black uppercase tracking-widest text-green-700 hover:border-green-500 hover:bg-green-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                📋 F→B
              </button>
              
              <button
                onClick={handleCopyBackToFront}
                disabled={!design.back.logo}
                className="px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-white border-2 border-green-100 text-[8px] md:text-xs font-black uppercase tracking-widest text-green-700 hover:border-green-500 hover:bg-green-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                📋 B→F
              </button>
            </div>
          </div>

          {/* Interactive Tips */}
          <div className="bg-blue-50 p-6 md:p-8 rounded-[2rem] border border-blue-100/50">
            <h4 className="text-[9px] md:text-[10px] font-black text-blue-900 mb-3 md:mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Editor Tips
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {[
                { icon: '🖱️', text: 'Drag to reposition' },
                { icon: '🖱️', text: 'Hover to see handles' },
                { icon: '⌨️', text: 'Scroll to resize' },
                { icon: '📍', text: 'Use Center button' }
              ].map((tip, i) => (
                <li key={i} className="flex items-center gap-2 md:gap-3 text-[11px] md:text-xs font-bold text-blue-800/70">
                  <span className="text-xs md:text-sm">{tip.icon}</span>
                  {tip.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-black/10 group overflow-hidden relative">
             <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mb-24 -mr-24 transition-transform group-hover:scale-125 duration-700" />
             <h4 className="text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.3em]">Craftsmanship</h4>
             <p className="text-sm text-gray-300 leading-relaxed font-medium">
               Each piece is treated with precision. Our screen-printing process ensures your {product.color} tee remains vibrant after countless washes.
             </p>
          </div>
          
          <div className="pt-4 space-y-4 md:space-y-6">
            <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm">
              <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</span>
              <div className="flex items-center gap-4 md:gap-6">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all font-black text-lg md:text-xl active:scale-95"
                >
                  −
                </button>
                <span className="text-lg md:text-xl font-black text-gray-900 min-w-[2rem] text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all font-black text-lg md:text-xl active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-gray-900 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] text-white shadow-2xl shadow-black/10 group overflow-hidden relative">
               <div className="absolute bottom-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-white/5 rounded-full blur-3xl -mb-24 -mr-24 transition-transform group-hover:scale-125 duration-700" />
               <h4 className="text-[9px] md:text-[10px] font-black text-gray-500 mb-3 md:mb-4 uppercase tracking-[0.3em]">Quality</h4>
               <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-medium">
                 Screen-printed for lasting vibrancy. Your {product.color} tee stays vibrant wash after wash.
               </p>
            </div>

            <Button 
               onClick={handleWhatsAppOrder}
               className="w-full h-16 md:h-24 rounded-[1.5rem] md:rounded-[2rem] text-lg md:text-2xl font-black bg-green-500 hover:bg-green-600 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)] gap-3 md:gap-5 transition-all active:scale-[0.96] hover:-translate-y-1 md:hover:-translate-y-2 disabled:opacity-20 disabled:scale-100 group"
               disabled={!design.front.logo && !design.back.logo}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="hidden md:block"><circle cx="12" cy="12" r="1"/><path d="M19.07 4.93L5.05 18.95M4.93 4.93l14.02 14.02"/></svg>
              ORDER NOW
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
