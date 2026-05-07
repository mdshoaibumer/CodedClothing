/**
 * SmoothScroll.jsx — Lenis Smooth Scroll Provider
 * 
 * Integrates Lenis (smooth scroll library) with native requestAnimationFrame.
 * This ensures all scroll interactions have buttery-smooth behavior.
 * 
 * Performance: Lenis uses requestAnimationFrame internally for
 * optimal frame scheduling without additional animation library dependencies.
 */

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Skip smooth scroll on mobile/touch devices or when reduced motion preferred
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    /* Native RAF loop for Lenis */
    let rafId;
    const animate = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return children;
}
