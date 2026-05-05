import { cn } from '../../lib/utils';
import CanvasPreview from '../../features/customization/components/CanvasPreview';
import useCustomizationStore from '../../features/customization/store/useCustomizationStore';

/**
 * CustomizePagePreview Component
 * Handles the main preview area with view switcher
 */
export default function CustomizePagePreview({ product, previewRef }) {
  const { activeView, setActiveView } = useCustomizationStore();

  return (
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
              "px-4 md:px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
              activeView === view
                ? "bg-gray-900 text-white shadow-lg scale-105"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-50 hover:scale-105"
            )}
          >
            {view}
          </button>
        ))}
      </div>
    </div>
  );
}