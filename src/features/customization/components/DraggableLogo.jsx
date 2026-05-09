import { useState, useRef, useEffect, useCallback } from 'react';
import { SCALE_LIMITS, POSITION_LIMITS } from '../customization.types';

/**
 * DraggableLogo - Professional Design Editor
 *
 * Interactions (Canva/Figma style):
 * - Click to select, click away to deselect
 * - Drag to move (mouse + touch)
 * - Corner handles to proportionally resize
 * - Top-center circular handle to rotate (with snapping to 0/90/180/270)
 * - Mouse wheel (no modifier) to scale logo up/down
 * - Arrow keys for 1% nudge, Shift+Arrow for 5% nudge
 * - +/- to scale, [/] to rotate 15°
 * - Double-click to center the logo
 */
export default function DraggableLogo({ logo, scale, x, y, rotation = 0, onUpdate, onInteractionEnd }) {
  const [isSelected, setIsSelected] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [activeHandle, setActiveHandle] = useState(null);

  const containerRef = useRef(null);
  const dragStartRef = useRef({ clientX: 0, clientY: 0, x: 0, y: 0 });
  const resizeStartRef = useRef({ clientX: 0, clientY: 0, scale: 1 });
  const rotateStartRef = useRef({ angle: 0, rotation: 0 });
  const pinchStartRef = useRef({ distance: 0, scale: 1 });

  // Stable refs for values used inside effects (prevents effect re-runs during interaction)
  const propsRef = useRef({ x, y, scale, rotation, onUpdate, onInteractionEnd });
  useEffect(() => {
    propsRef.current = { x, y, scale, rotation, onUpdate, onInteractionEnd };
  });

  const MIN_SCALE = SCALE_LIMITS.MIN;
  const MAX_SCALE = SCALE_LIMITS.MAX;
  const POS_MAX = POSITION_LIMITS.MAX;

  // ─── MOUSE WHEEL → SCALE LOGO ────────────────────────────────────────
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) return; // Let canvas zoom handle Ctrl+wheel
    e.preventDefault();
    e.stopPropagation();

    const { x: cx, y: cy, scale: cs, rotation: cr, onUpdate: update } = propsRef.current;
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, cs + delta));
    update(cx, cy, newScale, cr);
  }, [MIN_SCALE, MAX_SCALE]);

  // ─── PINCH-TO-ZOOM (MOBILE) → SCALE LOGO ─────────────────────────────
  const handleTouchStartPinch = useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      e.stopPropagation();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartRef.current = {
        distance: Math.hypot(dx, dy),
        scale: propsRef.current.scale,
      };
    }
  }, []);

  const handleTouchMovePinch = useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      e.stopPropagation();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDistance = Math.hypot(dx, dy);
      const ratio = currentDistance / pinchStartRef.current.distance;
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, pinchStartRef.current.scale * ratio));
      const { x: cx, y: cy, rotation: cr, onUpdate: update } = propsRef.current;
      update(cx, cy, newScale, cr);
    }
  }, [MIN_SCALE, MAX_SCALE]);

  const handleTouchEndPinch = useCallback((e) => {
    if (e.touches.length < 2) {
      propsRef.current.onInteractionEnd?.();
    }
  }, []);

  // ─── KEYBOARD SHORTCUTS (only when this element is focused) ───────────
  const handleKeyDown = useCallback((e) => {
    // Escape to deselect and release focus
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsSelected(false);
      containerRef.current?.blur();
      return;
    }

    const { x: cx, y: cy, scale: cs, rotation: cr, onUpdate: update } = propsRef.current;
    const step = e.shiftKey ? 5 : 1;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        update(Math.max(-POS_MAX, cx - step), cy, cs, cr);
        break;
      case 'ArrowRight':
        e.preventDefault();
        update(Math.min(POS_MAX, cx + step), cy, cs, cr);
        break;
      case 'ArrowUp':
        e.preventDefault();
        update(cx, Math.max(-POS_MAX, cy - step), cs, cr);
        break;
      case 'ArrowDown':
        e.preventDefault();
        update(cx, Math.min(POS_MAX, cy + step), cs, cr);
        break;
      case '+':
      case '=':
        e.preventDefault();
        update(cx, cy, Math.min(MAX_SCALE, cs + 0.05), cr);
        break;
      case '-':
      case '_':
        e.preventDefault();
        update(cx, cy, Math.max(MIN_SCALE, cs - 0.05), cr);
        break;
      case '[':
        e.preventDefault();
        update(cx, cy, cs, ((cr - 15) % 360 + 360) % 360);
        break;
      case ']':
        e.preventDefault();
        update(cx, cy, cs, ((cr + 15) % 360 + 360) % 360);
        break;
      default:
        break;
    }
  }, [POS_MAX, MIN_SCALE, MAX_SCALE]);

  // ─── DRAG LOGIC ───────────────────────────────────────────────────────
  const handleDragStart = useCallback((e) => {
    if (e.target.dataset?.handle) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setIsSelected(true);
    containerRef.current?.focus();

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    const { x: cx, y: cy } = propsRef.current;
    dragStartRef.current = { clientX, clientY, x: cx, y: cy };
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      const rect = containerRef.current?.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const dx = clientX - dragStartRef.current.clientX;
      const dy = clientY - dragStartRef.current.clientY;

      const percentX = (dx / rect.width) * 100;
      const percentY = (dy / rect.height) * 100;

      const newX = Math.max(-POS_MAX, Math.min(POS_MAX, dragStartRef.current.x + percentX));
      const newY = Math.max(-POS_MAX, Math.min(POS_MAX, dragStartRef.current.y + percentY));
      const { scale: cs, rotation: cr, onUpdate: update } = propsRef.current;
      update(newX, newY, cs, cr);
    };

    const handleEnd = () => {
      setIsDragging(false);
      propsRef.current.onInteractionEnd?.();
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, POS_MAX]);

  // ─── RESIZE LOGIC ─────────────────────────────────────────────────────
  const handleResizeStart = useCallback((e, handleId) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setActiveHandle(handleId);

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    resizeStartRef.current = { clientX, clientY, scale: propsRef.current.scale };
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (e) => {
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      const dx = clientX - resizeStartRef.current.clientX;
      const dy = clientY - resizeStartRef.current.clientY;

      // Diagonal distance for proportional resize
      let distance;
      if (activeHandle === 'bottom-right' || activeHandle === 'top-left') {
        distance = (dx + dy) / 2;
      } else {
        distance = (-dx + dy) / 2;
      }

      // 200px drag = double/half scale
      const scaleDelta = distance / 200;
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, resizeStartRef.current.scale + scaleDelta));
      const { x: cx, y: cy, rotation: cr, onUpdate: update } = propsRef.current;
      update(cx, cy, newScale, cr);
    };

    const handleEnd = () => {
      setIsResizing(false);
      setActiveHandle(null);
      propsRef.current.onInteractionEnd?.();
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isResizing, activeHandle, MIN_SCALE, MAX_SCALE]);

  // ─── ROTATION LOGIC ───────────────────────────────────────────────────
  const handleRotateStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRotating(true);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const startAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);

    rotateStartRef.current = { angle: startAngle, rotation: propsRef.current.rotation };
  }, []);

  useEffect(() => {
    if (!isRotating) return;

    const handleMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
      const angleDelta = currentAngle - rotateStartRef.current.angle;

      let newRotation = (rotateStartRef.current.rotation + angleDelta) % 360;
      if (newRotation < 0) newRotation += 360;

      // Snap to cardinal angles within 5°
      const snapAngles = [0, 90, 180, 270, 360];
      for (const snap of snapAngles) {
        if (Math.abs(newRotation - snap) < 5) {
          newRotation = snap % 360;
          break;
        }
      }

      const { x: cx, y: cy, scale: cs, onUpdate: update } = propsRef.current;
      update(cx, cy, cs, newRotation);
    };

    const handleEnd = () => {
      setIsRotating(false);
      propsRef.current.onInteractionEnd?.();
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isRotating]);

  // ─── DOUBLE CLICK → CENTER ────────────────────────────────────────────
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    const { scale: cs, rotation: cr, onUpdate: update } = propsRef.current;
    update(0, 0, cs, cr);
  }, []);

  // ─── DESELECT ON OUTSIDE CLICK ────────────────────────────────────────
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsSelected(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (!logo) return null;

  const isInteracting = isDragging || isResizing || isRotating;
  const showControls = isSelected || isInteracting;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 select-none"
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStartPinch}
      onTouchMove={handleTouchMovePinch}
      onTouchEnd={handleTouchEndPinch}
      onClick={() => { setIsSelected(true); containerRef.current?.focus(); }}

      tabIndex={0}
      style={{ outline: 'none' }}
      role="group"
      aria-label={`Logo editor. Position: ${Math.round(x)}%, ${Math.round(y)}%. Scale: ${Math.round(scale * 100)}%. Rotation: ${Math.round(rotation)}°. Use arrow keys to move, +/- to scale, brackets to rotate.`}
    >
      {/* Logo element with transform */}
      <div
        className={`absolute w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          transform: `translate(${x}%, ${y}%) scale(${scale}) rotate(${rotation}deg)`,
          transition: isInteracting ? 'none' : 'transform 0.15s ease-out',
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        onDoubleClick={handleDoubleClick}
      >
        {/* Selection border */}
        <div
          data-export-ignore
          className={`absolute -inset-3 border-2 rounded-lg pointer-events-none transition-opacity duration-200 ${
            showControls
              ? 'opacity-100 border-blue-500'
              : 'opacity-0 border-transparent'
          }`}
          style={{ boxShadow: showControls ? '0 0 0 1px rgba(59,130,246,0.2)' : 'none' }}
        />

        {/* Resize Handles & Rotation Handle */}
        {showControls && (
          <div data-export-ignore>
            {[
              { id: 'top-left', pos: '-top-3 -left-3', cursor: 'nwse-resize' },
              { id: 'top-right', pos: '-top-3 -right-3', cursor: 'nesw-resize' },
              { id: 'bottom-left', pos: '-bottom-3 -left-3', cursor: 'nesw-resize' },
              { id: 'bottom-right', pos: '-bottom-3 -right-3', cursor: 'nwse-resize' },
            ].map((handle) => (
              <div
                key={handle.id}
                data-handle="true"
                onMouseDown={(e) => handleResizeStart(e, handle.id)}
                onTouchStart={(e) => handleResizeStart(e, handle.id)}
                style={{ cursor: handle.cursor }}
                className={`absolute ${handle.pos} w-11 h-11 flex items-center justify-center z-20 pointer-events-auto touch-none`}
              >
                <div className={`w-3.5 h-3.5 bg-white border-2 border-blue-500 rounded-sm shadow-md transition-transform ${
                  activeHandle === handle.id ? 'scale-150 bg-blue-100' : 'hover:scale-125 hover:bg-blue-50'
                }`} />
              </div>
            ))}

            {/* Rotation Handle - circular, above center */}
            <div
              data-handle="true"
              onMouseDown={handleRotateStart}
              onTouchStart={handleRotateStart}
              className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-auto cursor-grab flex flex-col items-center touch-none"
            >
              <div className={`w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-md transition-transform flex items-center justify-center ${
                isRotating ? 'scale-125 bg-blue-100' : 'hover:scale-125 hover:bg-blue-50'
              }`}>
                <svg viewBox="0 0 16 16" className="w-full h-full p-0.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 8a4 4 0 0 1 7.5-2" strokeLinecap="round" />
                  <path d="M11.5 3.5v3h-3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {/* Connector line from handle to logo */}
              <div className="w-px h-4 bg-blue-400/60" />
            </div>

            {/* Scale badge during resize */}
            {isResizing && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-obsidian-900 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg z-30 whitespace-nowrap">
                {Math.round(scale * 100)}%
              </div>
            )}

            {/* Rotation badge during rotate */}
            {isRotating && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-obsidian-900 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg z-30 whitespace-nowrap">
                {Math.round(rotation)}°
              </div>
            )}
          </div>
        )}

        {/* Logo Image */}
        <img
          src={logo}
          alt="Custom Design"
          crossOrigin="anonymous"
          draggable={false}
          className="w-full h-full object-contain pointer-events-none"
          style={{
            opacity: isInteracting ? 0.85 : 1,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))',
          }}
        />
      </div>

      {/* Shortcut hints when selected but idle */}
      {isSelected && !isInteracting && (
        <div data-export-ignore className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-obsidian-900/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
            <span>Drag to move</span>
            <span className="text-obsidian-500">|</span>
            <span>Corners resize</span>
            <span className="text-obsidian-500">|</span>
            <span>⟳ Rotate</span>
            <span className="text-obsidian-500">|</span>
            <span>Scroll = scale</span>
          </div>
        </div>
      )}
    </div>
  );
}
