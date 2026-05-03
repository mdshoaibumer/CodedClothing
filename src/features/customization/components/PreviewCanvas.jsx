import { useState } from 'react';
import { cn } from '../../../lib/utils';

/**
 * PreviewCanvas Component
 * Renders the T-shirt base and overlays the logo with scale controls.
 * 
 * @param {string} baseImage - URL of the T-shirt base image
 * @param {string} logo - URL of the uploaded logo image
 */
export default function PreviewCanvas({ baseImage, logo }) {
  const [scale, setScale] = useState('medium'); // small, medium, large

  const scaleValues = {
    small: 'w-1/4',
    medium: 'w-1/3',
    large: 'w-1/2'
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Visual Canvas */}
      <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center p-8 md:p-12">
        
        {/* T-Shirt Base */}
        <img 
          src={baseImage} 
          alt="T-shirt Base" 
          className="max-w-full max-h-full object-contain mix-blend-multiply opacity-95"
        />

        {/* Logo Overlay Area */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Defined Safe Zone on Chest */}
          <div className="w-1/2 aspect-[4/5] mt-[-10%] flex items-center justify-center">
            {logo ? (
              <div className={cn(
                "transition-all duration-300 ease-out flex items-center justify-center",
                scaleValues[scale]
              )}>
                <img 
                  src={logo} 
                  alt="Custom Design" 
                  className="w-full h-auto object-contain mix-blend-multiply drop-shadow-sm"
                  style={{ filter: 'contrast(1.1) brightness(0.95)' }}
                />
              </div>
            ) : (
              <div className="w-1/3 aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-[1px]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Logo Zone</span>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100 shadow-sm">
            Professional Preview
          </span>
        </div>
      </div>

      {/* Scale Controls */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
          Logo Size
        </label>
        <div className="grid grid-cols-3 gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-100">
          {['small', 'medium', 'large'].map((s) => (
            <button
              key={s}
              onClick={() => setScale(s)}
              disabled={!logo}
              className={cn(
                "py-2.5 rounded-xl text-xs font-bold capitalize transition-all",
                !logo && "opacity-50 cursor-not-allowed",
                scale === s && logo
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
