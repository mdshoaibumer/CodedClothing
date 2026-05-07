/**
 * AuroraBackground.jsx — Ambient Background Layer
 * 
 * Creates a subtle, animated background with:
 * - Large floating color orbs (CSS animated — GPU composited)
 * - Grid texture overlay
 * - Moving highlight sweep
 * - Radial vignette edges
 * 
 * Performance: All animations use CSS transforms/opacity
 * which are handled by the compositor thread (no main-thread JS).
 */

import { useMemo } from 'react';

/** Individual floating orb — uses CSS animation for GPU compositing */
function FloatingOrb({ size, position, color, duration, delay }) {
  return (
    <div
      className="absolute rounded-full aurora-float"
      style={{
        width: size,
        height: size,
        top: position.top,
        left: position.left,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(50px)',
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        willChange: 'transform',
      }}
    />
  );
}

export default function AuroraBackground() {
  const orbs = useMemo(() => [
    { size: 1000, position: { top: '-20%', left: '-10%' }, color: 'rgba(201, 169, 110, 0.1)', duration: 20, delay: 0 },
    { size: 800, position: { top: '50%', left: '60%' }, color: 'rgba(201, 169, 110, 0.08)', duration: 25, delay: 2 },
    { size: 600, position: { top: '20%', left: '40%' }, color: 'rgba(201, 169, 110, 0.06)', duration: 30, delay: 4 },
    { size: 700, position: { top: '60%', left: '10%' }, color: 'rgba(139, 105, 20, 0.05)', duration: 28, delay: 6 },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Ambient orbs — CSS animated */}
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} {...orb} />
      ))}

      {/* Static grid texture */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201, 169, 110, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 169, 110, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Moving highlight — CSS animated */}
      <div
        className="absolute top-0 w-[30%] h-full bg-gradient-to-r from-transparent via-gold-400/[0.03] to-transparent aurora-sweep"
        style={{ animationDuration: '12s' }}
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(250,250,248,0.85)_100%)]" />
      
      {/* Atmospheric fog edges */}
      <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#fafaf8]/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#fafaf8]/60 to-transparent" />
    </div>
  );
}
