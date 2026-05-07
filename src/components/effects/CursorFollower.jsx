/**
 * CursorFollower.jsx — Lightweight Custom Cursor
 * 
 * Simplified for performance:
 * - No trail dots (removed spring calculations per mouse move)
 * - Uses CSS transforms with will-change for GPU compositing
 * - Single RAF loop instead of multiple Framer Motion springs
 * - Returns null on touch devices and when user prefers reduced motion.
 */

import { useState, useEffect, useRef } from 'react';

export default function CursorFollower() {
  /* Skip rendering on touch devices or when user prefers reduced motion */
  const [shouldRender] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !isTouch && !reducedMotion;
  });

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);
  const isHovering = useRef(false);
  const isHidden = useRef(false);

  const animateRef = useRef(null);

  useEffect(() => {
    if (!shouldRender) return;

    const animateCursor = () => {
      // Lerp dot (fast follow)
      dotPos.current.x += (pos.current.x - dotPos.current.x) * 0.25;
      dotPos.current.y += (pos.current.y - dotPos.current.y) * 0.25;
      // Lerp ring (slower follow)
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x - 8}px, ${dotPos.current.y - 8}px, 0) scale(${isHovering.current ? 2 : 1})`;
        dotRef.current.style.opacity = isHidden.current ? '0' : '1';
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px, 0) scale(${isHovering.current ? 1.5 : 1})`;
        ringRef.current.style.opacity = isHidden.current ? '0' : '0.7';
      }

      rafRef.current = requestAnimationFrame(animateCursor);
    };

    animateRef.current = animateCursor;

    const moveCursor = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const handleMouseLeave = () => { isHidden.current = true; };
    const handleMouseEnter = () => { isHidden.current = false; };

    const handleHoverStart = (e) => {
      if (e.target.closest('a, button, [role="button"], input, .cursor-hover, .cursor-view')) {
        isHovering.current = true;
      }
    };
    const handleHoverEnd = (e) => {
      if (e.target.closest('a, button, [role="button"], input, .cursor-hover, .cursor-view')) {
        isHovering.current = false;
      }
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleHoverStart, { passive: true });
    document.addEventListener('mouseout', handleHoverEnd, { passive: true });

    rafRef.current = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
      cancelAnimationFrame(rafRef.current);
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Decorative cursor dot — purely cosmetic, native cursor remains visible */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference opacity-60"
        style={{ willChange: 'transform', transition: 'opacity 0.15s' }}
      >
        <div className="w-3 h-3 rounded-full bg-white" />
      </div>

      {/* Outer ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ willChange: 'transform', transition: 'opacity 0.15s, transform 0.2s ease-out' }}
      >
        <div className="w-8 h-8 rounded-full border border-gold-400/40" />
      </div>
    </>
  );
}
