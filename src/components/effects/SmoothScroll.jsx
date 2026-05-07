/**
 * SmoothScroll.jsx — Lenis Smooth Scroll Provider
 * 
 * Integrates Lenis (smooth scroll library) with GSAP's ScrollTrigger.
 * This ensures all scroll-triggered animations have buttery-smooth behavior.
 * 
 * Performance: Lenis uses requestAnimationFrame internally and syncs with
 * GSAP's ticker for optimal frame scheduling.
 */

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    /* Sync Lenis scroll position with GSAP ScrollTrigger */
    lenis.on('scroll', ScrollTrigger.update);

    /* Stable RAF callback for GSAP ticker — stored for proper cleanup */
    const rafCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
    };
  }, []);

  return children;
}
