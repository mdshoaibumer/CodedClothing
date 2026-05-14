/**
 * PlacementZoneSelector.jsx — Vistaprint-style visual placement picker
 *
 * Renders an interactive T-shirt silhouette with clickable zones.
 * Users click a zone to snap the logo to that predefined position.
 * Active zone is highlighted; free-form mode is also available.
 */

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { getZonesForSide, getZoneById } from '../customization.types';
import useCustomizationStore from '../store/useCustomizationStore';

/* ─── T-Shirt Silhouette SVG ─── */
/**
 * Maps zone bounding box (relative to portrait image overlay)
 * to the silhouette SVG coordinates.
 * Portrait image: T-shirt body at ~18-82% width, 18-82% height.
 * Silhouette SVG: body at x=20-80%, y=23-92%.
 */
function mapToSilhouette(bb) {
  const left = parseFloat(bb.left);
  const top = parseFloat(bb.top);
  const width = parseFloat(bb.width);
  const height = parseFloat(bb.height);

  // Map from portrait image coords → silhouette coords
  // X: 18-82% in image → 20-80% in silhouette
  const silLeft = 20 + (left - 18) * (60 / 64);
  const silWidth = width * (60 / 64);
  // Y: 18-82% in image → 23-92% in silhouette
  const silTop = 23 + (top - 18) * (69 / 64);
  const silHeight = height * (69 / 64);

  return {
    top: `${Math.max(0, silTop).toFixed(1)}%`,
    left: `${Math.max(0, silLeft).toFixed(1)}%`,
    width: `${Math.min(100, silWidth).toFixed(1)}%`,
    height: `${Math.min(100, silHeight).toFixed(1)}%`,
  };
}

function TShirtSilhouette({ zones, activeZoneId, hoveredZone, onZoneClick, onZoneHover }) {
  return (
    <div className="relative w-full aspect-[3/4] max-w-[180px] mx-auto">
      {/* T-shirt outline SVG */}
      <svg
        viewBox="0 0 200 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* T-shirt body outline */}
        <path
          d="M40 60 L20 80 L5 70 L30 40 L55 25 L75 20 L80 35 C85 42 95 46 100 46 C105 46 115 42 120 35 L125 20 L145 25 L170 40 L195 70 L180 80 L160 60 L160 240 L40 240 Z"
          fill="#f8f8f6"
          stroke="#d4d4d4"
          strokeWidth="1.5"
          className="transition-colors duration-300"
        />
        {/* Collar */}
        <path
          d="M75 20 L80 35 C85 42 95 46 100 46 C105 46 115 42 120 35 L125 20"
          fill="none"
          stroke="#d4d4d4"
          strokeWidth="1.5"
        />
      </svg>

      {/* Clickable zone overlays on the silhouette */}
      {zones.map((zone) => {
        const isActive = activeZoneId === zone.id;
        const isHovered = hoveredZone === zone.id;
        const bb = mapToSilhouette(zone.boundingBox);

        // Smaller zones get higher z-index so they're clickable over larger zones
        const area = parseFloat(bb.width) * parseFloat(bb.height);
        const zIndex = Math.round(1000 / Math.max(area, 1));

        return (
          <button
            key={zone.id}
            onClick={() => onZoneClick(zone.id)}
            onMouseEnter={() => onZoneHover(zone.id)}
            onMouseLeave={() => onZoneHover(null)}
            title={zone.description}
            className={cn(
              "absolute border-2 border-dashed rounded-md transition-all duration-300 flex items-center justify-center cursor-pointer group/zone",
              isActive
                ? "border-gold-500 bg-gold-400/20 shadow-[0_0_12px_rgba(201,162,67,0.3)]"
                : isHovered
                  ? "border-gold-400/60 bg-gold-100/30"
                  : "border-obsidian-300/30 bg-transparent hover:border-obsidian-400/50 hover:bg-obsidian-50/40"
            )}
            style={{
              top: bb.top,
              left: bb.left,
              width: bb.width,
              height: bb.height,
              zIndex,
            }}
            aria-label={`${zone.label} placement zone`}
            aria-pressed={isActive}
          >
            <span
              className={cn(
                "text-[8px] font-black uppercase tracking-wider transition-all duration-200 px-1 py-0.5 rounded whitespace-nowrap",
                isActive
                  ? "text-gold-700 bg-gold-100/80"
                  : "text-obsidian-400 opacity-0 group-hover/zone:opacity-100"
              )}
            >
              {zone.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Zone List (button list below the silhouette) ─── */
function ZoneButtonList({ zones, activeZoneId, onZoneClick, onZoneHover }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 mt-3">
      {zones.map((zone) => {
        const isActive = activeZoneId === zone.id;
        return (
          <motion.button
            key={zone.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onZoneClick(zone.id)}
            onMouseEnter={() => onZoneHover(zone.id)}
            onMouseLeave={() => onZoneHover(null)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all duration-200 text-left",
              isActive
                ? "border-gold-500 bg-gold-50 shadow-sm"
                : "border-obsidian-100 bg-white hover:border-gold-300 hover:bg-gold-50/30"
            )}
          >
            <span className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 transition-colors",
              isActive
                ? "bg-gold-500 text-white"
                : "bg-obsidian-50 text-obsidian-400"
            )}>
              {zone.icon}
            </span>
            <div className="flex-1 min-w-0">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest block",
                isActive ? "text-gold-700" : "text-obsidian-700"
              )}>
                {zone.label}
              </span>
              <span className="text-[9px] text-obsidian-400 leading-tight block truncate">
                {zone.description}
              </span>
            </div>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─── Main Component ─── */
const PlacementZoneSelector = memo(function PlacementZoneSelector() {
  const { activeView, placementZones, applyPlacementZone, clearPlacementZone, saveToHistory } = useCustomizationStore();
  const [hoveredZone, setHoveredZone] = useState(null);

  // Determine the effective side
  const effectiveSide = activeView === 'both' ? 'front' : activeView;
  const zones = getZonesForSide(effectiveSide);
  const activeZoneId = placementZones[effectiveSide];

  const handleZoneClick = (zoneId) => {
    if (activeZoneId === zoneId) {
      // In zone-locked mode, clicking active zone does nothing (no free-form)
      return;
    }
    saveToHistory();
    applyPlacementZone(zoneId);
  };

  const activeZone = activeZoneId ? getZoneById(activeZoneId) : null;

  return (
    <div className="bg-white p-5 md:p-6 rounded-4xl shadow-luxury border border-obsidian-50 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[9px] md:text-xs font-black text-obsidian-900 uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
          Print Placement
        </h3>
        {activeZoneId && (
          <span className="text-[9px] font-bold text-gold-600 uppercase tracking-widest flex items-center gap-1">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Locked
          </span>
        )}
      </div>

      {/* Instructional text */}
      {!activeZoneId && (
        <p className="text-[10px] text-obsidian-500 font-medium mb-4 leading-relaxed">
          Select where your logo will be printed. Your design will be locked to the chosen zone for production accuracy.
        </p>
      )}

      {/* Side toggle when in "both" view */}
      {activeView === 'both' && (
        <div className="flex gap-2 p-1.5 bg-obsidian-50 rounded-xl mb-4">
          {['front', 'back'].map((side) => (
            <button
              key={side}
              onClick={() => {/* Handled by parent view toggle */}}
              className={cn(
                "flex-1 px-3 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                effectiveSide === side
                  ? "bg-white text-obsidian-900 shadow-sm"
                  : "text-obsidian-400"
              )}
            >
              {side}
            </button>
          ))}
        </div>
      )}

      {/* Visual T-shirt silhouette with zones */}
      <TShirtSilhouette
        zones={zones}
        activeZoneId={activeZoneId}
        hoveredZone={hoveredZone}
        onZoneClick={handleZoneClick}
        onZoneHover={setHoveredZone}
        side={effectiveSide}
      />

      {/* Active zone info */}
      <AnimatePresence mode="wait">
        {activeZone ? (
          <motion.div
            key={activeZone.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-4 p-3 bg-gold-50 rounded-xl border border-gold-200/50"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gold-500 text-white flex items-center justify-center text-xs">
                {activeZone.icon}
              </span>
              <div>
                <span className="text-[10px] font-black text-gold-800 uppercase tracking-widest block">
                  {activeZone.label}
                </span>
                <span className="text-[9px] text-gold-600">{activeZone.description}</span>
              </div>
            </div>
            {/* Change zone button */}
            <button
              onClick={() => clearPlacementZone(effectiveSide)}
              className="mt-2 w-full text-[9px] font-bold text-obsidian-400 uppercase tracking-widest hover:text-gold-600 transition-colors text-center py-1"
            >
              Change placement →
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="select-zone"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-4 p-3 bg-obsidian-50 rounded-xl border border-obsidian-100"
          >
            <p className="text-[9px] text-obsidian-500 text-center font-medium">
              👆 Select a zone to lock your logo placement
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zone button list */}
      <ZoneButtonList
        zones={zones}
        activeZoneId={activeZoneId}
        onZoneClick={handleZoneClick}
        onZoneHover={setHoveredZone}
        hoveredZone={hoveredZone}
      />
    </div>
  );
});

export default PlacementZoneSelector;
