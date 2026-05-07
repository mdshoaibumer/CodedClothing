/**
 * SplashScreen.jsx — Cinematic Loading Intro
 *
 * Full-screen animated splash displayed on initial page load.
 * Features a refined logo animation, ring burst, and elegant reveal.
 * Auto-dismisses after animation completes (~2.8s).
 *
 * Performance:
 * - Reduced particle count (20 vs previous 60) for faster composite
 * - Fewer animated DOM nodes (removed helix, constellation, hexagons)
 * - Uses will-change hints for GPU layer promotion
 * - Exit animation uses scale + blur for cinematic feel
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Static Data (computed once outside component) ─── */

/** Burst particles — 20 lightweight nodes for visual impact without jank */
const SPLASH_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 800,
  y: (Math.random() - 0.5) * 800,
  size: Math.random() * 4 + 1,
  delay: Math.random() * 0.4,
  duration: Math.random() * 1.5 + 1,
  opacity: 0.5 + Math.random() * 0.5,
}));

/* ─── Sub-components ─── */

/** Particle burst — fires outward from center on activation */
function SplashParticles({ active }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {SPLASH_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={active ? {
            x: p.x,
            y: p.y,
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 1, 0],
          } : {}}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(201, 169, 110, ${p.opacity}), transparent)`,
            boxShadow: `0 0 ${p.size * 4}px rgba(201, 169, 110, 0.6)`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

/** Expanding ring burst — 5 concentric rings for depth effect */
function AnimatedRings({ phase }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[1, 2, 3, 4, 5].map((ring) => (
        <motion.div
          key={ring}
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 1 ? {
            scale: [0, ring * 2, ring * 3.5],
            opacity: [0.8, 0.4, 0],
          } : {}}
          transition={{ duration: 2.5 + ring * 0.2, delay: ring * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute rounded-full"
          style={{
            width: 100,
            height: 100,
            border: `${ring % 2 === 0 ? '1px' : '2px'} solid rgba(201, 169, 110, ${0.5 - ring * 0.08})`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    /* Phase timeline — controls the animation sequence */
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 800);
    const t3 = setTimeout(() => setPhase(3), 1800);
    const t4 = setTimeout(() => setPhase(4), 2500);
    const t5 = setTimeout(() => onComplete(), 2800);

    /* Progress counter — smoothly drives the loading bar */
    const startTime = Date.now();
    const totalDuration = 2400;
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / totalDuration, 1);
      setProgress(Math.floor(p * 100));
      if (p >= 1) clearInterval(progressInterval);
    }, 40);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 4 && (
        <motion.div
          exit={{
            opacity: 0,
            scale: 1.2,
            filter: 'blur(20px)',
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-obsidian-950 overflow-hidden"
        >
          {/* Rotating conic gradient — ambient background glow */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]"
          >
            <div className="w-full h-full bg-gradient-conic from-gold-600/20 via-transparent via-25% to-gold-400/15 rounded-full blur-3xl" />
          </motion.div>

          {/* Pulsing center light */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-gold-500/15 to-transparent rounded-full"
          />

          {/* Ring burst effect */}
          <AnimatedRings phase={phase} />

          {/* Particle burst on phase 3 */}
          <SplashParticles active={phase >= 3} />

          {/* ─── Center Content ─── */}
          <div className="relative flex flex-col items-center">
            {/* Logo mark with entrance animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: phase >= 1 ? 1 : 0,
                rotate: phase >= 1 ? 0 : -180,
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-24 h-24 flex items-center justify-center mb-10"
            >
              {/* Glow behind logo */}
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-br from-gold-400/50 to-gold-600/50 rounded-2xl blur-2xl"
              />
              {/* Logo container */}
              <div className="relative w-full h-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-gold-500/50 overflow-hidden">
                <motion.span
                  initial={{ opacity: 0, scale: 3 }}
                  animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white font-black text-5xl italic relative z-10"
                >
                  C
                </motion.span>
                {/* Shine sweep across logo */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={phase >= 1 ? { x: '200%' } : {}}
                  transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                />
              </div>
            </motion.div>

            {/* Brand name — per-character stagger reveal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : {}}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex overflow-hidden">
                {'CODED CLOTHING'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 50, opacity: 0 }}
                    animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl md:text-4xl font-black text-white tracking-wide inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={phase >= 2 ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-[1px] w-48 bg-gradient-to-r from-transparent via-gold-500 to-transparent"
              />

              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-[11px] font-bold text-gold-400 uppercase tracking-[0.5em]"
              >
                Premium Atelier
              </motion.span>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              className="mt-12 w-64"
            >
              <div className="text-center mb-2">
                <span className="text-[10px] font-mono text-gold-400/60 tracking-[0.3em]">
                  {progress}%
                </span>
              </div>
              <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2.4, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 origin-left"
                />
              </div>
            </motion.div>
          </div>

          {/* Corner bracket decorations */}
          {[
            'top-8 left-8 border-l border-t',
            'top-8 right-8 border-r border-t',
            'bottom-8 left-8 border-l border-b',
            'bottom-8 right-8 border-r border-b',
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              className={`absolute w-16 h-16 ${pos} border-gold-500/30`}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
