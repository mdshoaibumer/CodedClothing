import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  clampToBounds,
  distance,
  percentToPixels,
  pixelsToPercent,
  checkAdvancedSnapping,
  applyMagneticEasing,
  smoothInterpolate,
  applyBoundaryResistance,
  calculateSmoothScale,
  generateFabricTexture,
  createFabricLighting
} from '../utils/canvas.utils';
import { SCALE_LIMITS, POSITION_LIMITS } from '../customization.types';

/**
 * DraggableLogo Component
 * Professional-grade design editor with smooth interactions, snapping, and premium UX.
 * Features: smooth drag, professional resize, alignment snapping, visual feedback.
 */
export default function DraggableLogo({ logo, scale, x, y, rotation = 0, onUpdate }) {
  const [interactionMode, setInteractionMode] = useState('none'); // 'none' | 'dragging' | 'resizing'
  const [activeHandle, setActiveHandle] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [showGuides, setShowGuides] = useState({ horizontal: false, vertical: false, edges: [] });
  const [isSnapping, setIsSnapping] = useState(false);
  const [snapStrength, setSnapStrength] = useState(0);

  // Refs for smooth animation and interpolation
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const dragStartRef = useRef({ clientX: 0, clientY: 0, x: 0, y: 0 });
  const resizeStartRef = useRef({ clientX: 0, clientY: 0, scale: 1, aspectRatio: 1 });
  const currentTransformRef = useRef({ x, y, scale, rotation });
  const targetTransformRef = useRef({ x, y, scale, rotation });
  const interpolationRef = useRef({ x: 0, y: 0, scale: 0 });

  // Snapping and interaction constants
  const SNAP_THRESHOLD = 30; // pixels
  const INTERPOLATION_FACTOR = 0.25;
  const MAGNETIC_RESISTANCE = 0.2;
  const MIN_SCALE = SCALE_LIMITS.MIN;
  const MAX_SCALE = SCALE_LIMITS.MAX;

  // Update current transform ref when props change
  useEffect(() => {
    currentTransformRef.current = { x, y, scale, rotation };
    targetTransformRef.current = { x, y, scale, rotation };
  }, [x, y, scale, rotation]);

  // Smooth interpolation animation loop with debounced updates
  useEffect(() => {
    let updateTimeout;
    const animate = () => {
      const current = currentTransformRef.current;
      const target = targetTransformRef.current;

      // Interpolate each property
      const newX = smoothInterpolate(current.x, target.x, INTERPOLATION_FACTOR, isSnapping ? 'magnetic' : 'ease-out');
      const newY = smoothInterpolate(current.y, target.y, INTERPOLATION_FACTOR, isSnapping ? 'magnetic' : 'ease-out');
      const newScale = smoothInterpolate(current.scale, target.scale, INTERPOLATION_FACTOR * 0.8, 'ease-out');

      // Update current values
      currentTransformRef.current = { ...current, x: newX, y: newY, scale: newScale };

      // Update interpolation progress
      interpolationRef.current = {
        x: Math.abs(target.x - newX) < 0.01 ? 1 : 0,
        y: Math.abs(target.y - newY) < 0.01 ? 1 : 0,
        scale: Math.abs(target.scale - newScale) < 0.001 ? 1 : 0
      };

      // Debounce onUpdate calls to improve performance (only call every 16ms during interaction)
      clearTimeout(updateTimeout);
      if (Math.abs(current.x - newX) > 0.01 || Math.abs(current.y - newY) > 0.01 || Math.abs(current.scale - newScale) > 0.001) {
        updateTimeout = setTimeout(() => {
          onUpdate(newX, newY, newScale, rotation);
        }, 0);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (interactionMode !== 'none') {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(updateTimeout);
    };
  }, [interactionMode, isSnapping, onUpdate, rotation]);

  /**
   * Advanced snapping with multi-guide support
   */
  const checkSnapping = useCallback((newX, newY, containerRect) => {
    const pixelPos = percentToPixels(newX, newY, containerRect.width, containerRect.height);
    const absoluteX = pixelPos.x + containerRect.left;
    const absoluteY = pixelPos.y + containerRect.top;

    const snapResult = checkAdvancedSnapping(absoluteX, absoluteY, containerRect, SNAP_THRESHOLD);

    setShowGuides(snapResult.showGuides);
    setIsSnapping(snapResult.isSnapping);
    setSnapStrength(snapResult.snapStrength);

    if (snapResult.isSnapping) {
      const snappedPixelX = snapResult.snappedX - containerRect.left;
      const snappedPixelY = snapResult.snappedY - containerRect.top;
      const snappedPercent = pixelsToPercent(snappedPixelX, snappedPixelY, containerRect.width, containerRect.height);

      return {
        x: applyMagneticEasing(newX, snappedPercent.x, snapResult.snapStrength, MAGNETIC_RESISTANCE),
        y: applyMagneticEasing(newY, snappedPercent.y, snapResult.snapStrength, MAGNETIC_RESISTANCE)
      };
    }

    return { x: newX, y: newY };
  }, []);

  /**
   * Set target transform values for smooth interpolation
   */
  const setTargetTransform = useCallback((newX, newY, newScale, newRotation) => {
    targetTransformRef.current = {
      x: newX,
      y: newY,
      scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale)),
      rotation: newRotation
    };
  }, []);

  /**
   * Handle drag start
   */
  const handleDragStart = useCallback((e) => {
    if (interactionMode !== 'none') return;

    e.preventDefault();
    setInteractionMode('dragging');

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      x: currentTransformRef.current.x,
      y: currentTransformRef.current.y,
      containerRect
    };
  }, [interactionMode]);

  /**
   * Handle touch start (mobile support)
   */
  const handleTouchStart = useCallback((e) => {
    if (interactionMode !== 'none') return;

    const touch = e.touches[0];
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    setInteractionMode('dragging');

    dragStartRef.current = {
      clientX: touch.clientX,
      clientY: touch.clientY,
      x: currentTransformRef.current.x,
      y: currentTransformRef.current.y,
      containerRect
    };
  }, [interactionMode]);

  /**
   * Handle resize start
   */
  const handleResizeStart = useCallback((e, handleId) => {
    e.preventDefault();
    e.stopPropagation();

    setInteractionMode('resizing');
    setActiveHandle(handleId);

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    resizeStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      scale: currentTransformRef.current.scale,
      aspectRatio: 1, // Maintain aspect ratio
      containerRect
    };
  }, [interactionMode]);

  /**
   * Handle mouse move with smooth updates and advanced interactions
   */
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (interactionMode === 'none') return;

      const containerRect = dragStartRef.current.containerRect || resizeStartRef.current.containerRect;
      if (!containerRect) return;

      if (interactionMode === 'dragging') {
        const deltaX = e.clientX - dragStartRef.current.clientX;
        const deltaY = e.clientY - dragStartRef.current.clientY;

        // Convert to percentage with smooth interpolation
        const percentDeltaX = (deltaX / containerRect.width) * 100;
        const percentDeltaY = (deltaY / containerRect.height) * 100;

        let newX = dragStartRef.current.x + percentDeltaX;
        let newY = dragStartRef.current.y + percentDeltaY;

        // Apply boundary resistance for soft stops
        newX = applyBoundaryResistance(newX, -POSITION_LIMITS.MAX, POSITION_LIMITS.MAX, 0.05);
        newY = applyBoundaryResistance(newY, -POSITION_LIMITS.MAX, POSITION_LIMITS.MAX, 0.05);

        // Check advanced snapping
        const snapped = checkSnapping(newX, newY, containerRect);

        setTargetTransform(snapped.x, snapped.y, scale, rotation);

      } else if (interactionMode === 'resizing' && activeHandle) {
        const deltaX = e.clientX - resizeStartRef.current.clientX;
        const deltaY = e.clientY - resizeStartRef.current.clientY;

        // Calculate proper scale direction and magnitude using distance
        const distanceX = Math.abs(deltaX);
        const distanceY = Math.abs(deltaY);
        const dominantDistance = Math.max(distanceX, distanceY);
        
        // Determine direction based on which corner is being dragged
        const isBottomRight = activeHandle.includes('bottom') && activeHandle.includes('right');
        const isBottomLeft = activeHandle.includes('bottom') && activeHandle.includes('left');
        const isTopRight = activeHandle.includes('top') && activeHandle.includes('right');
        const isTopLeft = activeHandle.includes('top') && activeHandle.includes('left');
        
        // Direction: outward = 1, inward = -1
        let direction = 1;
        if (isBottomRight || isTopLeft) {
          direction = (deltaX + deltaY > 0) ? 1 : -1;
        } else if (isBottomLeft || isTopRight) {
          direction = (deltaX - deltaY > 0) ? -1 : 1;
        }

        const newScale = calculateSmoothScale(
          direction * dominantDistance,
          resizeStartRef.current.scale,
          0.003 // sensitivity
        );

        // Apply boundary resistance near scale limits
        const resistedScale = applyBoundaryResistance(newScale, MIN_SCALE, MAX_SCALE, 0.1);

        setTargetTransform(x, y, resistedScale, rotation);
      }
    };

    const handleMouseUp = () => {
      setInteractionMode('none');
      setActiveHandle(null);

      // Fade out guides with delay
      setTimeout(() => {
        setShowGuides({ horizontal: false, vertical: false, edges: [] });
        setIsSnapping(false);
        setSnapStrength(0);
      }, 300);
    };

    // Touch event handlers for mobile support
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      handleDragStart(mouseEvent);
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      handleMouseMove(mouseEvent);
    };

    const handleTouchEnd = (e) => {
      const mouseEvent = new MouseEvent('mouseup');
      handleMouseUp();
    };

    if (interactionMode !== 'none') {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [interactionMode, activeHandle, x, y, scale, rotation, checkSnapping, setTargetTransform]);

  /**
   * Handle double-click to center
   */
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    setTargetTransform(0, 0, scale, rotation);
  }, [scale, rotation, setTargetTransform]);

  if (!logo) return null;

  const isInteracting = interactionMode !== 'none';

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none ${
        interactionMode === 'dragging' ? 'cursor-grabbing' :
        interactionMode === 'resizing' ? 'cursor-grabbing' :
        'cursor-grab'
      } transition-all duration-150`}
      onMouseDown={handleDragStart}
      onTouchStart={handleTouchStart}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        transform: `translate(${currentTransformRef.current.x}%, ${currentTransformRef.current.y}%) scale(${currentTransformRef.current.scale}) rotate(${rotation}deg)`,
        transition: isInteracting ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)',
      }}
    >
      {/* Advanced Alignment Guide Lines */}
      {isSnapping && (
        <>
          {/* Vertical Guides */}
          {showGuides.vertical && (
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-400 via-blue-500 to-blue-400 pointer-events-none z-10 animate-in fade-in duration-200" />
          )}

          {/* Horizontal Guides */}
          {showGuides.horizontal && (
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 pointer-events-none z-10 animate-in fade-in duration-200" />
          )}

          {/* Edge-specific guides */}
          {showGuides.edges.includes('left') && (
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-green-400 via-green-500 to-green-400 pointer-events-none z-10 animate-in fade-in duration-200" />
          )}
          {showGuides.edges.includes('right') && (
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-green-400 via-green-500 to-green-400 pointer-events-none z-10 animate-in fade-in duration-200" />
          )}
          {showGuides.edges.includes('top') && (
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-green-400 via-green-500 to-green-400 pointer-events-none z-10 animate-in fade-in duration-200" />
          )}
          {showGuides.edges.includes('bottom') && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-green-400 via-green-500 to-green-400 pointer-events-none z-10 animate-in fade-in duration-200" />
          )}
        </>
      )}

      {/* Enhanced Visual Bounding Box */}
      <div
        className={`absolute -inset-6 border-2 rounded-2xl pointer-events-none transition-all duration-300 ${
          isInteracting || isHovering
            ? 'opacity-100 scale-100 border-blue-400/80 shadow-[0_0_30px_rgba(59,130,246,0.4)] bg-blue-500/5'
            : 'opacity-0 scale-95 border-transparent'
        } ${isSnapping ? 'border-green-400/80 shadow-[0_0_30px_rgba(34,197,94,0.4)] bg-green-500/5' : ''}`}
        style={{
          boxShadow: isSnapping
            ? `0 0 30px rgba(34, 197, 94, ${snapStrength * 0.4}), inset 0 0 30px rgba(34, 197, 94, ${snapStrength * 0.1})`
            : isInteracting || isHovering
            ? '0 0 30px rgba(59, 130, 246, 0.3), inset 0 0 30px rgba(59, 130, 246, 0.1)'
            : 'none'
        }}
      >
        {/* Enhanced Resize Handles with Larger Hit Areas */}
        {[
          { id: 'top-left', cursor: 'nw-resize', pos: '-top-3 -left-3', hoverPos: '-top-4 -left-4' },
          { id: 'top-right', cursor: 'ne-resize', pos: '-top-3 -right-3', hoverPos: '-top-4 -right-4' },
          { id: 'bottom-left', cursor: 'sw-resize', pos: '-bottom-3 -left-3', hoverPos: '-bottom-4 -left-4' },
          { id: 'bottom-right', cursor: 'se-resize', pos: '-bottom-3 -right-3', hoverPos: '-bottom-4 -right-4' },
        ].map((handle) => (
          <div
            key={handle.id}
            onMouseDown={(e) => handleResizeStart(e, handle.id)}
            style={{ cursor: handle.cursor }}
            className={`absolute w-6 h-6 flex items-center justify-center pointer-events-auto group/handle transition-all duration-200 ${
              isHovering || isInteracting ? 'opacity-100' : 'opacity-0'
            } ${handle.pos} group-hover/handle:${handle.hoverPos}`}
          >
            {/* Invisible larger hit area */}
            <div className="absolute inset-0 scale-150 opacity-0" />

            {/* Visual handle with enhanced states */}
            <div className={`relative w-4 h-4 bg-white border-2 rounded-lg shadow-lg transition-all duration-200 transform ${
              activeHandle === handle.id
                ? 'scale-125 bg-blue-500 border-blue-600 shadow-blue-500/50'
                : 'group-hover/handle:scale-110 border-blue-500 group-hover/handle:border-blue-600'
            } ${isSnapping ? 'border-green-500 group-hover/handle:border-green-600' : ''}`}>
              {/* Inner accent */}
              <div className={`absolute inset-0.5 rounded-md transition-all duration-200 ${
                activeHandle === handle.id
                  ? 'bg-blue-400'
                  : 'bg-blue-50 group-hover/handle:bg-blue-100'
              } ${isSnapping ? 'bg-green-100 group-hover/handle:bg-green-200' : ''}`} />
            </div>
          </div>
        ))}

        {/* Enhanced Scale Indicator */}
        {isInteracting && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl text-gray-800 text-[11px] font-bold px-3 py-2 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            {Math.round(currentTransformRef.current.scale * 100)}%
          </div>
        )}

        {/* Enhanced Snap Indicator */}
        {isSnapping && (
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl animate-in fade-in zoom-in-95 duration-300 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            SNAPPED
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-100" />
          </div>
        )}
      </div>

      {/* Logo Image with Premium Print Realism */}
      <div className="relative w-full h-full">
        {/* Fabric texture overlay */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none opacity-30"
          style={{
            background: createFabricLighting(135, 0.15),
            mixBlendMode: 'overlay'
          }}
        />

        <img
          src={logo}
          alt="Custom Design"
          crossOrigin="anonymous"
          draggable={false}
          className="relative w-full h-full object-contain pointer-events-none transition-all duration-300"
          style={{
            mixBlendMode: 'normal',
            opacity: isInteracting ? 0.9 : 0.95,
            filter: `
              ${generateFabricTexture('#ffffff', 0.2)}
              drop-shadow(0 3px 12px rgba(0,0,0,0.2))
              drop-shadow(0 1px 3px rgba(0,0,0,0.1))
              blur(${isInteracting ? '0.3px' : '0px'})
            `,
            transform: `scale(${isInteracting ? 1.02 : 1})`,
            transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)'
          }}
        />

        {/* Subtle lighting effect */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)',
            mixBlendMode: 'soft-light'
          }}
        />
      </div>

      {/* Enhanced Interactive Tooltip */}
      {isHovering && !isInteracting && (
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl text-gray-700 text-[10px] font-medium px-4 py-2.5 rounded-xl animate-in fade-in slide-in-from-bottom-3 duration-300 whitespace-nowrap max-w-xs text-center leading-relaxed">
          <div className="font-bold text-gray-800 mb-1">Design Controls</div>
          <div className="flex items-center justify-center gap-3 text-[9px]">
            <span>✋ Drag to move</span>
            <span>•</span>
            <span>🔄 Double-click to center</span>
            <span>•</span>
            <span>↗️ Pull corners to resize</span>
          </div>
        </div>
      )}
    </div>
  );
}