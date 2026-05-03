import { memo } from 'react';
import { cn } from '../../../lib/utils';
import DraggableLogo from './DraggableLogo';

/**
 * TShirtCanvas Component
 * Renders a single side of the T-shirt with interactive logo positioning.
 * Memoized to prevent unnecessary re-renders when props haven't changed.
 * 
 * @param {string} image - The base T-shirt image URL.
 * @param {string} logo - The uploaded logo URL.
 * @param {number} scale - The scale factor for the logo.
 * @param {number} x - Horizontal offset.
 * @param {number} y - Vertical offset.
 * @param {Function} onUpdate - Callback for position/scale changes.
 * @param {string} label - Optional label (e.g., "Front", "Back").
 * @param {string} className - Optional container classes.
 */
const TShirtCanvas = memo(
  function TShirtCanvas({ image, logo, scale, x, y, onUpdate, label, className }) {
    return (
      <div className={cn(
        "relative flex-1 bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] group transition-all duration-500 hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.1)]",
        className
      )}>
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,1)_0%,_rgba(248,249,250,1)_100%)]" />
        
        {/* T-Shirt Base */}
        <div className="relative aspect-[3/4] p-10 flex items-center justify-center">
          <img 
            src={image} 
            alt={label || 'T-shirt View'} 
            crossOrigin="anonymous"
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-transform duration-700 group-hover:scale-[1.02]"
          />

          {/* --- Interactive Logo Positioning --- */}
          <div className="absolute inset-0 z-20">
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-[28%] aspect-square flex items-center justify-center"
              style={{ top: '38%' }}
            >
              {logo ? (
                <DraggableLogo 
                  logo={logo}
                  scale={scale}
                  x={x}
                  y={y}
                  onUpdate={onUpdate}
                />
              ) : (
                <div className="w-full h-full border-2 border-dashed border-gray-200/40 rounded-2xl flex flex-col items-center justify-center bg-white/5 backdrop-blur-[2px] pointer-events-none">
                   <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">Design Zone</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Label */}
        {label && (
          <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm z-30">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
          </div>
        )}
      </div>
    );
  },
  // Custom equality check: only re-render if these props actually change
  (prevProps, nextProps) => {
    return (
      prevProps.image === nextProps.image &&
      prevProps.logo === nextProps.logo &&
      prevProps.scale === nextProps.scale &&
      prevProps.x === nextProps.x &&
      prevProps.y === nextProps.y &&
      prevProps.label === nextProps.label &&
      prevProps.className === nextProps.className
    );
  }
);

TShirtCanvas.displayName = 'TShirtCanvas';

export default TShirtCanvas;
