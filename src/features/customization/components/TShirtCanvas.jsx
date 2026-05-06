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
 * @param {number} rotation - Rotation angle in degrees.
 * @param {Function} onUpdate - Callback for position/scale/rotation changes.
 * @param {string} label - Optional label (e.g., "Front", "Back").
 * @param {string} className - Optional container classes.
 */
const TShirtCanvas = memo(
  function TShirtCanvas({ image, logo, scale, x, y, rotation = 0, onUpdate, label, className, showGuides = { horizontal: false, vertical: false, edges: [] } }) {
    return (
      <div className={cn(
        "relative flex-1 bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] group transition-all duration-500 hover:shadow-[0_48px_80px_-20px_rgba(0,0,0,0.1)]",
        className
      )}>
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,1)_0%,_rgba(248,249,250,1)_100%)]" />
        
        {/* T-Shirt Base */}
        <div className="relative aspect-[3/4] p-6 md:p-10">
          <img 
            src={image} 
            alt={label || 'T-shirt View'} 
            crossOrigin="anonymous"
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-transform duration-700 group-hover:scale-[1.02]"
          />

          {/* Design Area Overlay (matches padded area) */}
          <div className="absolute inset-6 md:inset-10 pointer-events-none">
            {/* Print Safe Area Guide */}
            <div className="absolute inset-0">
              <div
                className="absolute border-2 border-dashed border-red-300/30 rounded-lg"
                style={{
                  left: '15%',
                  top: '25%',
                  width: '70%',
                  height: '50%',
                }}
              />
              <div className="absolute top-[23%] left-1/2 -translate-x-1/2 bg-red-500/80 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                Print Area
              </div>
            </div>

            {/* Advanced Alignment Guide Lines */}
            <div className="absolute inset-0">
              {/* Subtle reference center lines */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-300/20" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-300/20" />

              {/* Active snapping guides */}
              {showGuides.vertical && (
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-400 via-blue-500 to-blue-400 animate-in fade-in duration-200" />
              )}
              {showGuides.horizontal && (
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 animate-in fade-in duration-200" />
              )}

              {/* Edge snapping guides */}
              {showGuides.edges?.includes('left') && (
                <div className="absolute left-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-green-400 via-green-500 to-green-400 animate-in fade-in duration-200" />
              )}
              {showGuides.edges?.includes('right') && (
                <div className="absolute right-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-green-400 via-green-500 to-green-400 animate-in fade-in duration-200" />
              )}
              {showGuides.edges?.includes('top') && (
                <div className="absolute top-[25%] left-0 right-0 h-px bg-gradient-to-r from-green-400 via-green-500 to-green-400 animate-in fade-in duration-200" />
              )}
              {showGuides.edges?.includes('bottom') && (
                <div className="absolute bottom-[25%] left-0 right-0 h-px bg-gradient-to-r from-green-400 via-green-500 to-green-400 animate-in fade-in duration-200" />
              )}
            </div>

            {/* Draggable Logo */}
            <div className="absolute inset-0 pointer-events-auto">
              {logo ? (
                <DraggableLogo
                  logo={logo}
                  scale={scale}
                  x={x}
                  y={y}
                  rotation={rotation}
                  onUpdate={onUpdate}
                />
              ) : (
                <div className="w-full h-full border-2 border-dashed border-gray-200/40 rounded-2xl flex flex-col items-center justify-center bg-white/5 backdrop-blur-[2px] pointer-events-none">
                  <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">Design Zone</span>
                  <span className="text-[6px] font-bold text-gray-300 uppercase tracking-[0.2em] mt-1">Click Upload to Start</span>
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
      prevProps.rotation === nextProps.rotation &&
      prevProps.label === nextProps.label &&
      prevProps.className === nextProps.className &&
      prevProps.showGuides?.horizontal === nextProps.showGuides?.horizontal &&
      prevProps.showGuides?.vertical === nextProps.showGuides?.vertical &&
      prevProps.showGuides?.edges?.length === nextProps.showGuides?.edges?.length &&
      prevProps.showGuides?.edges?.every((e, i) => e === nextProps.showGuides?.edges?.[i])
    );
  }
);

TShirtCanvas.displayName = 'TShirtCanvas';

export default TShirtCanvas;
