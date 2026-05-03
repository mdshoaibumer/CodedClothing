import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * DraggableLogo Component
 * A professional-grade interactive design element that supports:
 * - Direct manipulation dragging (Positioning)
 * - Corner handle resizing (Scaling)
 * - Scroll-wheel resizing (Power-user scaling)
 * 
 * Features: Centered resizing, aspect ratio lock, bounds checking, and high-performance event handling.
 */
export default function DraggableLogo({ logo, scale, x, y, onUpdate }) {
  const [interactionMode, setInteractionMode] = useState('none'); // 'none' | 'dragging' | 'resizing'
  const [activeHandle, setActiveHandle] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // Refs for tracking movement without triggering React re-renders for every pixel
  const dragStartRef = useRef({ clientX: 0, clientY: 0, x: 0, y: 0 });
  const resizeStartRef = useRef({ clientX: 0, clientY: 0, scale: 1 });
  const containerRef = useRef(null);

  // Constants
  const MIN_SCALE = 0.6;
  const MAX_SCALE = 1.8;

  /**
   * --- RESIZE LOGIC ---
   */
  const handleResizeStart = (e, handleId) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent drag from triggering
    
    setInteractionMode('resizing');
    setActiveHandle(handleId);
    
    resizeStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      scale: scale,
    };
  };

  /**
   * --- DRAG LOGIC ---
   */
  const handleDragStart = (e) => {
    if (interactionMode !== 'none') return;
    
    e.preventDefault();
    setInteractionMode('dragging');
    
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      x: x,
      y: y,
    };
  };

  /**
   * --- GLOBAL MOUSE HANDLERS ---
   */
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (interactionMode === 'none') return;

      if (interactionMode === 'dragging') {
        const parent = containerRef.current?.parentElement;
        if (!parent) return;

        const deltaX = ((e.clientX - dragStartRef.current.clientX) / parent.offsetWidth) * 100;
        const deltaY = ((e.clientY - dragStartRef.current.clientY) / parent.offsetHeight) * 100;
        
        onUpdate(dragStartRef.current.x + deltaX, dragStartRef.current.y + deltaY, scale);
      }

      if (interactionMode === 'resizing' && activeHandle) {
        // Calculate distance from start point
        // For centered resizing, we look at how much the mouse moved relative to its starting position
        // and project that onto the diagonal for a smooth feel.
        
        const dx = e.clientX - resizeStartRef.current.clientX;
        const dy = e.clientY - resizeStartRef.current.clientY;
        
        // Determine direction based on which handle we are pulling
        // Pulling OUT (away from center) increases scale
        let factor = 0;
        if (activeHandle === 'top-left') factor = -dx - dy;
        if (activeHandle === 'top-right') factor = dx - dy;
        if (activeHandle === 'bottom-left') factor = -dx + dy;
        if (activeHandle === 'bottom-right') factor = dx + dy;

        // Sensitivity adjustment (how many pixels for 1 unit of scale)
        const sensitivity = 200;
        const deltaScale = factor / sensitivity;
        
        const newScale = Math.min(Math.max(resizeStartRef.current.scale + deltaScale, MIN_SCALE), MAX_SCALE);
        onUpdate(x, y, newScale);
      }
    };

    const handleMouseUp = () => {
      setInteractionMode('none');
      setActiveHandle(null);
    };

    if (interactionMode !== 'none') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interactionMode, activeHandle, x, y, scale, onUpdate]);

  /**
   * --- WHEEL RESIZE (LEGACY/POWER USER) ---
   */
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newScale = Math.min(Math.max(scale + delta, MIN_SCALE), MAX_SCALE);
      onUpdate(x, y, newScale);
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, [scale, x, y, onUpdate]);

  if (!logo) return null;

  const isInteracting = interactionMode !== 'none';

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none ${
        interactionMode === 'dragging' ? 'cursor-grabbing z-50' : 'cursor-grab z-10'
      }`}
      onMouseDown={handleDragStart}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        transform: `translate(${x}%, ${y}%) scale(${scale})`,
        // Smooth transition only when NOT interacting to prevent lag
        transition: isInteracting ? 'none' : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
      }}
    >
      {/* Visual Bounding Box */}
      <div
        className={`absolute -inset-4 border-2 rounded-xl pointer-events-none transition-all duration-300 ${
          isInteracting || isHovering 
            ? 'opacity-100 scale-100 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
            : 'opacity-0 scale-95 border-transparent'
        }`}
      >
        {/* Resize Handles (Corner Hits) */}
        {[
          { id: 'top-left', cursor: 'nwse-resize', pos: '-top-2.5 -left-2.5' },
          { id: 'top-right', cursor: 'nesw-resize', pos: '-top-2.5 -right-2.5' },
          { id: 'bottom-left', cursor: 'nesw-resize', pos: '-bottom-2.5 -left-2.5' },
          { id: 'bottom-right', cursor: 'nwse-resize', pos: '-bottom-2.5 -right-2.5' },
        ].map((handle) => (
          <div
            key={handle.id}
            onMouseDown={(e) => handleResizeStart(e, handle.id)}
            style={{ cursor: handle.cursor }}
            className={`absolute w-5 h-5 flex items-center justify-center pointer-events-auto group/handle ${handle.pos}`}
          >
            {/* Visual Dot */}
            <div className={`w-3 h-3 bg-white border-2 border-blue-500 rounded-sm shadow-md transition-all duration-200 ${
              activeHandle === handle.id ? 'scale-150 bg-blue-500' : 'group-hover/handle:scale-125'
            }`} />
          </div>
        ))}

        {/* Status Indicator */}
        {isInteracting && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-3 py-2 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-200">
            <span className="text-blue-400">SCALE {Math.round(scale * 100)}%</span>
            <div className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="text-gray-400">POS {Math.round(x)},{Math.round(y)}</span>
          </div>
        )}
      </div>

      {/* Logo Image */}
      <img
        src={logo}
        alt="Custom Design"
        crossOrigin="anonymous"
        draggable={false}
        className="w-full h-full object-contain pointer-events-none transition-opacity duration-300"
        style={{
          mixBlendMode: 'multiply',
          opacity: isInteracting ? 0.8 : 0.95,
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))',
        }}
      />

      {/* Quick Tooltip */}
      {isHovering && !isInteracting && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-gray-100 text-[9px] font-black text-gray-500 px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap tracking-widest uppercase">
          Drag to Move • Pull corners to Resize
        </div>
      )}
    </div>
  );
}
