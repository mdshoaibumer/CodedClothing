/**
 * CursorFollower.jsx — Custom Cursor with Physics-Based Following
 * 
 * Renders a custom cursor that replaces the default system cursor:
 * - Main dot (inner circle) with spring physics
 * - Outer ring with slower spring for trailing effect
 * - Trail dots for motion blur illusion
 * - Context-aware states: hover (expand), click (shrink), hidden
 * - "View" label on special elements
 * 
 * Accessibility: Returns null on touch devices and when user prefers reduced motion.
 */

import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

/** Trail dot — follows cursor with increasing delay per index */
function TrailDot({ x, y, index, total }) {
  const springConfig = { damping: 20 + index * 4, stiffness: 200 - index * 25, mass: 0.3 + index * 0.15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const opacity = 1 - (index / total) * 0.85;
  const size = Math.max(2, 6 - index * 1.5);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9997]"
      style={{ x: springX, y: springY }}
    >
      <div 
        className="rounded-full bg-gold-400"
        style={{ 
          width: size, 
          height: size, 
          marginLeft: -size / 2, 
          marginTop: -size / 2,
          opacity,
        }} 
      />
    </motion.div>
  );
}

export default function CursorFollower() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400, mass: 0.3 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  // Single outer ring with slower spring
  const outerSpring = { damping: 18, stiffness: 150, mass: 0.6 };
  const outerX = useSpring(cursorX, outerSpring);
  const outerY = useSpring(cursorY, outerSpring);

  // Reduced trail count
  const trailCount = 3;

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    const handleHoverStart = (e) => {
      const target = e.target.closest('a, button, [role="button"], input, .cursor-hover, .cursor-view');
      if (target) {
        setIsHovering(true);
        if (target.classList.contains('cursor-view')) {
          setHoverText('View');
        }
      }
    };

    const handleHoverEnd = (e) => {
      const target = e.target.closest('a, button, [role="button"], input, .cursor-hover, .cursor-view');
      if (target) {
        setIsHovering(false);
        setHoverText('');
      }
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
    };
  }, [cursorX, cursorY]);

  /* Skip rendering on touch devices or when user prefers reduced motion.
   * Computed once during initial render (safe — matchMedia is synchronous). */
  const [shouldRender] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !isTouch && !reducedMotion;
  });

  if (!shouldRender) return null;

  return (
    <>
      {/* Trail dots - reduced */}
      {Array.from({ length: trailCount }, (_, i) => (
        <TrailDot key={i} x={cursorX} y={cursorY} index={i + 1} total={trailCount} />
      ))}

      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x, y }}
        animate={{
          scale: isClicking ? 0.2 : isHovering ? 2.5 : 1,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ scale: { type: 'spring', stiffness: 500, damping: 20 }, opacity: { duration: 0.15 } }}
      >
        <div className="w-4 h-4 -ml-2 -mt-2 rounded-full bg-white" />
      </motion.div>

      {/* Single outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: outerX, y: outerY }}
        animate={{
          scale: isClicking ? 0.4 : isHovering ? 2 : 1,
          opacity: hidden ? 0 : 0.7,
        }}
        transition={{ 
          scale: { type: 'spring', stiffness: 200, damping: 18 }, 
          opacity: { duration: 0.15 },
        }}
      >
        <div className="w-10 h-10 -ml-5 -mt-5 rounded-full border border-gold-400/60" />
      </motion.div>

      {/* Hover text label */}
      <AnimatePresence>
        {hoverText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed top-0 left-0 pointer-events-none z-[9999]"
            style={{ x: outerX, y: outerY }}
          >
            <span className="absolute -translate-x-1/2 -translate-y-1/2 text-[8px] font-black uppercase tracking-widest text-white mix-blend-difference">
              {hoverText}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
