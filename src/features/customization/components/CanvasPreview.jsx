import { useEffect, useRef, useState, useCallback } from 'react';
import useCustomizationStore from '../store/useCustomizationStore';
import { getZoneById } from '../customization.types';
import TShirtCanvas from './TShirtCanvas';

/**
 * CanvasPreview Component
 * Main orchestrator for the Design Studio's visual area.
 * Zone-locked Vistaprint-style — canvas is display-only, controls are in sidebar.
 * Includes canvas zoom & pan for inspecting print placement.
 * 
 * @param {Object} product - The product data containing image views.
 */
export default function CanvasPreview({ product }) {
  const { activeView, design, placementZones, setPosition, setScale, setLogo, saveToHistory } = useCustomizationStore();
  const [statusMessage, setStatusMessage] = useState('');

  // Canvas zoom/pan state
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const containerRef = useRef(null);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.25;

  // Handle mouse wheel zoom on the canvas
  const handleWheel = useCallback((e) => {
    // Only zoom if Ctrl/Cmd is held (to not interfere with logo scale)
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();

    setCanvasZoom((prev) => {
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta));
      // Reset pan when zooming back to 1x
      if (newZoom === 1) {
        setPanOffset({ x: 0, y: 0 });
      }
      return newZoom;
    });
  }, []);

  // Pan with middle-click or Ctrl+drag
  const handlePanStart = useCallback((e) => {
    // Middle mouse button OR Ctrl+left click for panning
    if (e.button === 1 || (e.ctrlKey && e.button === 0)) {
      if (canvasZoom <= 1) return;
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        offsetX: panOffset.x,
        offsetY: panOffset.y,
      };
    }
  }, [canvasZoom, panOffset]);

  useEffect(() => {
    if (!isPanning) return;

    const handlePanMove = (e) => {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      const maxPan = (canvasZoom - 1) * 150; // Limit pan based on zoom level
      setPanOffset({
        x: Math.max(-maxPan, Math.min(maxPan, panStartRef.current.offsetX + dx)),
        y: Math.max(-maxPan, Math.min(maxPan, panStartRef.current.offsetY + dy)),
      });
    };

    const handlePanEnd = () => {
      setIsPanning(false);
    };

    window.addEventListener('mousemove', handlePanMove);
    window.addEventListener('mouseup', handlePanEnd);
    return () => {
      window.removeEventListener('mousemove', handlePanMove);
      window.removeEventListener('mouseup', handlePanEnd);
    };
  }, [isPanning, canvasZoom]);

  // Reset zoom/pan
  const resetZoom = useCallback(() => {
    setCanvasZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  // Compute snap guides from current position
  const computeGuides = useCallback((viewKey) => {
    const d = design[viewKey];
    if (!d || !d.logo) return { horizontal: false, vertical: false, edges: [] };
    const SNAP_THRESHOLD = 2;
    const horizontal = Math.abs(d.y) < SNAP_THRESHOLD;
    const vertical = Math.abs(d.x) < SNAP_THRESHOLD;
    return { horizontal, vertical, edges: [] };
  }, [design]);

  if (!product) return null;

  // Define which views to render based on activeView
  const viewsToRender = activeView === 'both' ? ['front', 'back'] : [activeView];

  return (
    <div className="w-full" role="region" aria-label="Design canvas">
      {/* ARIA live region for screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusMessage}
      </div>
      {/* Zoom Controls */}
      <div data-export-ignore className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-1 p-1.5 bg-white rounded-2xl border border-obsidian-100 shadow-sm">
          <button
            onClick={() => setCanvasZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
            disabled={canvasZoom <= MIN_ZOOM}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold text-obsidian-400 hover:bg-obsidian-50 hover:text-obsidian-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            onClick={resetZoom}
            className="px-3 h-8 flex items-center justify-center rounded-xl text-xs font-black text-obsidian-600 hover:bg-obsidian-50 transition-all uppercase tracking-widest min-w-[4rem]"
            title="Reset zoom (click to reset)"
          >
            {Math.round(canvasZoom * 100)}%
          </button>
          <button
            onClick={() => setCanvasZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
            disabled={canvasZoom >= MAX_ZOOM}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold text-obsidian-400 hover:bg-obsidian-50 hover:text-obsidian-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
        {canvasZoom > 1 && (
          <span className="text-2xs font-bold text-obsidian-500 uppercase tracking-widest animate-in fade-in">
            Ctrl+Scroll to zoom · Middle-click to pan
          </span>
        )}
      </div>

      {/* Zoomable Canvas Container */}
      <div
        ref={containerRef}
        className="overflow-hidden rounded-5xl"
        onWheel={handleWheel}
        onMouseDown={handlePanStart}
        style={{ cursor: isPanning ? 'grabbing' : canvasZoom > 1 ? 'grab' : 'default' }}
      >
        <div
          className="flex flex-col md:flex-row gap-6 justify-center items-start w-full transition-transform duration-300 ease-out origin-center"
          style={{
            transform: `scale(${canvasZoom}) translate(${panOffset.x / canvasZoom}px, ${panOffset.y / canvasZoom}px)`,
          }}
        >
          {viewsToRender.map((viewKey) => (
            <TShirtCanvas
              key={viewKey}
              image={product.views?.[viewKey] || product.image}
              logo={design[viewKey]?.logo}
              scale={design[viewKey]?.scale || 1}
              x={design[viewKey]?.x || 0}
              y={design[viewKey]?.y || 0}
              showGuides={computeGuides(viewKey)}
              activeZone={placementZones[viewKey] ? getZoneById(placementZones[viewKey]) : null}
              onRemoveLogo={() => { setLogo(viewKey, null); saveToHistory(); }}
              label={viewKey.toUpperCase()}
              className={activeView !== 'both' ? "max-w-2xl mx-auto" : ""}
            />
          ))}
        </div>
      </div>
      
      {/* High-Fidelity Rendering Indicator */}
      <div data-export-ignore className="mt-8 flex justify-center">
        <div className="px-6 py-2 bg-obsidian-50 rounded-full border border-obsidian-100 shadow-sm flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-gold-500 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-gold-500 animate-pulse delay-75" />
            <div className="w-1 h-1 rounded-full bg-gold-500 animate-pulse delay-150" />
          </div>
          <span className="text-xs font-black text-obsidian-400 uppercase tracking-[0.3em]">
            Precision Print Preview Active
          </span>
        </div>
      </div>
    </div>
  );
}
