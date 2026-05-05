import { useEffect } from 'react';
import useCustomizationStore from '../store/useCustomizationStore';
import TShirtCanvas from './TShirtCanvas';

/**
 * CanvasPreview Component
 * Main orchestrator for the Design Studio's visual area.
 * Utilizes the reusable TShirtCanvas component to render front, back, or both views.
 * 
 * @param {Object} product - The product data containing image views.
 */
export default function CanvasPreview({ product }) {
  const { activeView, design, setPosition, setScale, setRotation, saveToHistory } = useCustomizationStore();

  // Save to history when design changes (debounced via useEffect)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToHistory();
    }, 500); // Save after 500ms of no changes

    return () => clearTimeout(timer);
  }, [design, saveToHistory]);

  if (!product) return null;

  // Define which views to render based on activeView
  const viewsToRender = activeView === 'both' ? ['front', 'back'] : [activeView];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6 justify-center items-start w-full transition-all duration-500">
        {viewsToRender.map((viewKey) => (
          <TShirtCanvas
            key={viewKey}
            image={product.views?.[viewKey] || product.image}
            logo={design[viewKey].logo}
            scale={design[viewKey].scale}
            x={design[viewKey].x}
            y={design[viewKey].y}
            rotation={design[viewKey].rotation}
            onUpdate={(newX, newY, newScale, newRotation) => {
              setPosition(viewKey, newX, newY);
              setScale(viewKey, newScale);
              if (newRotation !== undefined) {
                setRotation(viewKey, newRotation);
              }
            }}
            label={viewKey.toUpperCase()}
            className={activeView !== 'both' ? "max-w-2xl mx-auto" : ""}
          />
        ))}
      </div>
      
      {/* High-Fidelity Rendering Indicator */}
      <div className="mt-8 flex justify-center">
        <div className="px-6 py-2 bg-gray-50 rounded-full border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse delay-75" />
            <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse delay-150" />
          </div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Precision Print Preview Active
          </span>
        </div>
      </div>
    </div>
  );
}
