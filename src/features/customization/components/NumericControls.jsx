/**
 * NumericControls — Vistaprint-style Zone-Locked Controls
 *
 * Replaces freeform position/rotation inputs with:
 * - A size slider (capped by zone's maxScale)
 * - Nudge buttons (±nudgeRange within zone boundary)
 * - Center-in-zone button to snap back to zone center
 * - No rotation controls (screen printing doesn't need it)
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import useCustomizationStore from '../store/useCustomizationStore';
import { getZoneById, SCALE_LIMITS } from '../customization.types';

const NumericControls = memo(function NumericControls() {
  const { activeView, design, placementZones, setPosition, setScale, saveToHistory } = useCustomizationStore();

  // Determine which side to edit
  const editSide = activeView === 'both' ? 'front' : activeView;
  const currentDesign = design[editSide];
  const zoneId = placementZones[editSide];
  const zone = zoneId ? getZoneById(zoneId) : null;

  // Don't show if no logo uploaded
  if (!currentDesign?.logo) return null;

  // Scale limits based on zone
  const minScale = SCALE_LIMITS.MIN;
  const maxScale = zone?.maxScale || SCALE_LIMITS.MAX;
  const nudgeStep = 2; // Each nudge moves 2%

  const handleNudge = (dx, dy) => {
    saveToHistory();
    setPosition(editSide, currentDesign.x + dx, currentDesign.y + dy);
  };

  const handleScaleChange = (value) => {
    setScale(editSide, parseFloat(value));
  };

  const handleCenterInZone = () => {
    if (!zone) return;
    saveToHistory();
    setPosition(editSide, zone.x, zone.y);
    setScale(editSide, zone.scale);
  };

  // Calculate how much the logo has been nudged from zone center
  const nudgeOffsetX = zone ? Math.round(currentDesign.x - zone.x) : 0;
  const nudgeOffsetY = zone ? Math.round(currentDesign.y - zone.y) : 0;
  const isAtCenter = nudgeOffsetX === 0 && nudgeOffsetY === 0;

  return (
    <div className="bg-white p-5 md:p-6 rounded-4xl shadow-luxury border border-obsidian-50 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[9px] md:text-xs font-black text-obsidian-900 uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
          Size & Position
        </h3>
        {zone && (
          <span className="text-[9px] font-bold text-gold-600 uppercase tracking-widest bg-gold-50 px-2 py-1 rounded-md">
            {zone.label}
          </span>
        )}
      </div>

      {/* Size Slider */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-obsidian-600 uppercase tracking-widest">
            Logo Size
          </label>
          <span className="text-[10px] font-black text-obsidian-900 bg-obsidian-50 px-2.5 py-1 rounded-lg">
            {Math.round(currentDesign.scale * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={minScale}
          max={maxScale}
          step="0.01"
          value={currentDesign.scale}
          onChange={(e) => handleScaleChange(e.target.value)}
          className="w-full h-2 bg-obsidian-100 rounded-full appearance-none cursor-pointer accent-gold-500
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-500 [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-125"
        />
        <div className="flex justify-between">
          <span className="text-[9px] font-bold text-obsidian-400 uppercase">Small</span>
          {zone && (
            <span className="text-[9px] font-bold text-gold-500 uppercase">Max: {Math.round(maxScale * 100)}%</span>
          )}
          <span className="text-[9px] font-bold text-obsidian-400 uppercase">Large</span>
        </div>
      </div>

      {/* Nudge Controls */}
      {zone && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-obsidian-600 uppercase tracking-widest">
              Fine-Tune Position
            </label>
            {!isAtCenter && (
              <span className="text-[9px] font-medium text-obsidian-400">
                offset: {nudgeOffsetX > 0 ? '+' : ''}{nudgeOffsetX}, {nudgeOffsetY > 0 ? '+' : ''}{nudgeOffsetY}
              </span>
            )}
          </div>

          {/* D-pad nudge controls */}
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-3 gap-1 w-fit">
              {/* Top row */}
              <div />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNudge(0, -nudgeStep)}
                className="w-10 h-10 rounded-xl bg-obsidian-50 border border-obsidian-100 flex items-center justify-center text-obsidian-500 hover:bg-gold-50 hover:border-gold-300 hover:text-gold-600 transition-all"
                aria-label="Nudge up"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </motion.button>
              <div />

              {/* Middle row */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNudge(-nudgeStep, 0)}
                className="w-10 h-10 rounded-xl bg-obsidian-50 border border-obsidian-100 flex items-center justify-center text-obsidian-500 hover:bg-gold-50 hover:border-gold-300 hover:text-gold-600 transition-all"
                aria-label="Nudge left"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCenterInZone}
                disabled={isAtCenter}
                className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 hover:bg-gold-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Center in zone"
                title="Reset to zone center"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNudge(nudgeStep, 0)}
                className="w-10 h-10 rounded-xl bg-obsidian-50 border border-obsidian-100 flex items-center justify-center text-obsidian-500 hover:bg-gold-50 hover:border-gold-300 hover:text-gold-600 transition-all"
                aria-label="Nudge right"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>

              {/* Bottom row */}
              <div />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNudge(0, nudgeStep)}
                className="w-10 h-10 rounded-xl bg-obsidian-50 border border-obsidian-100 flex items-center justify-center text-obsidian-500 hover:bg-gold-50 hover:border-gold-300 hover:text-gold-600 transition-all"
                aria-label="Nudge down"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </motion.button>
              <div />
            </div>
          </div>

          <p className="text-[9px] text-obsidian-400 text-center font-medium mt-2">
            Fine-tune within ±{zone.nudgeRange}% of zone center
          </p>
        </div>
      )}

      {/* No zone selected — show helpful message */}
      {!zone && currentDesign?.logo && (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/50 mt-2">
          <p className="text-[10px] text-amber-700 font-medium text-center">
            ⚠️ Select a placement zone above to lock your logo's position
          </p>
        </div>
      )}
    </div>
  );
});

export default NumericControls;
