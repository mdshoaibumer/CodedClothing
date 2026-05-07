/**
 * AnimationEffects.jsx — Shared Animation Components
 * 
 * A collection of reusable, performance-optimized animation primitives
 * used throughout the Coded Clothing website.
 * 
 * All components use `viewport: { once: true }` to avoid re-triggering,
 * and leverage GPU-composited properties (transform, opacity) for 60fps.
 * 
 * Now uses only Framer Motion (no GSAP dependency) for smaller bundle.
 * 
 * Exports:
 * - AnimatedCounter — Counts up to a target number on viewport entry
 * - StaggerText — Reveals text word-by-word with 3D rotation
 * - RevealOnScroll — Fades in children when scrolled into view
 * - Marquee — Infinite horizontal scroll ticker
 * - MorphingBlob — CSS-powered organic shape animation
 * - ScaleReveal — Scale + blur reveal on scroll
 * - SpotlightCard — Card with mouse-following radial highlight
 * - NumberTicker — Framer Motion-powered smooth number counter
 * - TextLineReveal — Scroll-triggered text reveal
 * - RotatingTextRing — Circular text that rotates infinitely
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

/* ─── Shared Constants ─── */
const EASE_LUXURY = [0.16, 1, 0.3, 1];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * AnimatedCounter — Counts from 0 to `target` using requestAnimationFrame.
 * Only triggers when the element enters the viewport.
 * 
 * @param {number} target - The number to count to
 * @param {number} duration - Animation duration in seconds
 * @param {string} prefix - Text before the number
 * @param {string} suffix - Text after the number
 */
export function AnimatedCounter({ target, duration = 2, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let raf;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Quartic ease-out for satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * StaggerText — Reveals text word-by-word with a 3D rotation effect.
 * Each word animates in sequence with a slight delay.
 */
export function StaggerText({ text, className = '', delay = 0 }) {
  const words = text.split(' ');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, rotateX: 90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.08,
            ease: EASE_LUXURY,
          }}
          className="inline-block mr-[0.25em]"
          style={{ perspective: '500px' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * RevealOnScroll — Wraps children and reveals them when scrolled into view.
 * Supports multiple reveal directions.
 * 
 * @param {'up'|'down'|'left'|'right'|'scale'} direction - Animation direction
 */
export function RevealOnScroll({ children, direction = 'up', delay = 0, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const variants = {
    up: { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -60 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.8, delay, ease: EASE_LUXURY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * Marquee — Infinite horizontal scrolling ticker.
 * Duplicates children to create seamless loop.
 * 
 * @param {number} speed - Duration of one full loop in seconds
 */
export function Marquee({ children, speed = 30, className = '' }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        className="inline-flex gap-8"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * MorphingBlob — Organic shape that animates border-radius via CSS keyframes.
 * Used as decorative background elements. Pure CSS — no JS animation overhead.
 */
export function MorphingBlob({ className = '', color = 'rgba(201, 169, 110, 0.1)' }) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        background: color,
        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        animation: 'morph-blob 12s ease-in-out infinite',
      }}
    />
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * ScaleReveal — Reveals children with scale + blur animation on scroll.
 */
export function ScaleReveal({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
      animate={isInView ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1, ease: EASE_LUXURY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * SpotlightCard — Card with a radial highlight that follows the mouse.
 * The effect is purely visual and doesn't cause layout shifts.
 */
export function SpotlightCard({ children, className = '' }) {
  const ref = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(201, 169, 110, 0.08) 0%, transparent 50%)`,
      }}
    >
      {children}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * NumberTicker — Smooth number counter using requestAnimationFrame.
 * More performant than AnimatedCounter for large numbers.
 */
export function NumberTicker({ value, duration = 2.5, prefix = '', suffix = '', className = '' }) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let raf;
    const durationMs = duration * 1000;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Power2 ease-out
      const eased = 1 - Math.pow(1 - progress, 2);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * TextLineReveal — Scroll-triggered text reveal with 3D perspective.
 * Uses Framer Motion's useInView for viewport detection.
 */
export function TextLineReveal({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 80, opacity: 0, rotateX: 40 }}
      animate={isInView ? { y: 0, opacity: 1, rotateX: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{ perspective: '1000px' }}
    >
      {children}
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * RotatingTextRing — Characters arranged in a circle, rotating infinitely.
 * Used as decorative elements in dark sections.
 */
export function RotatingTextRing({ text, radius = 100, className = '' }) {
  const characters = text.split('');
  const anglePerChar = 360 / characters.length;

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className={`relative ${className}`}
      style={{ width: radius * 2, height: radius * 2 }}
    >
      {characters.map((char, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-0 origin-[0_100px] text-xs font-bold uppercase tracking-wider text-gold-500/60"
          style={{
            transform: `rotate(${anglePerChar * i}deg)`,
            transformOrigin: `0 ${radius}px`,
          }}
        >
          {char}
        </span>
      ))}
    </motion.div>
  );
}
