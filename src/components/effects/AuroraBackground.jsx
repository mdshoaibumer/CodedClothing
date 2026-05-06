import { motion } from 'framer-motion';
import { useMemo } from 'react';

// Floating orb component for premium ambient effect
function FloatingOrb({ size, position, color, duration, delay }) {
  return (
    <motion.div
      animate={{
        x: [0, 100, -80, 60, -40, 0],
        y: [0, -80, 60, -100, 40, 0],
        scale: [1, 1.4, 0.7, 1.2, 0.9, 1],
      }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        top: position.top,
        left: position.left,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(50px)',
      }}
    />
  );
}

// Animated light ray
function LightRay({ angle, delay, width }) {
  return (
    <motion.div
      animate={{ 
        opacity: [0, 0.08, 0.03, 0.06, 0],
        scaleY: [0.5, 1.2, 0.8, 1, 0.5],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
      className="absolute top-0 h-full origin-top"
      style={{
        left: `${angle}%`,
        width: `${width}px`,
        background: 'linear-gradient(180deg, rgba(201, 169, 110, 0.15) 0%, transparent 70%)',
        transform: `rotate(${(angle - 50) * 0.3}deg)`,
      }}
    />
  );
}

export default function AuroraBackground() {
  const orbs = useMemo(() => [
    { size: 1200, position: { top: '-25%', left: '-15%' }, color: 'rgba(201, 169, 110, 0.12)', duration: 16, delay: 0 },
    { size: 900, position: { top: '55%', left: '65%' }, color: 'rgba(201, 169, 110, 0.1)', duration: 20, delay: 2 },
    { size: 700, position: { top: '25%', left: '35%' }, color: 'rgba(201, 169, 110, 0.08)', duration: 26, delay: 4 },
    { size: 600, position: { top: '5%', left: '75%' }, color: 'rgba(232, 213, 163, 0.08)', duration: 18, delay: 3 },
    { size: 800, position: { top: '65%', left: '5%' }, color: 'rgba(139, 105, 20, 0.06)', duration: 23, delay: 6 },
    { size: 500, position: { top: '40%', left: '55%' }, color: 'rgba(201, 169, 110, 0.06)', duration: 28, delay: 8 },
    { size: 400, position: { top: '80%', left: '40%' }, color: 'rgba(232, 213, 163, 0.07)', duration: 22, delay: 5 },
    { size: 350, position: { top: '15%', left: '50%' }, color: 'rgba(255, 215, 0, 0.04)', duration: 30, delay: 7 },
    { size: 550, position: { top: '45%', left: '85%' }, color: 'rgba(218, 165, 32, 0.05)', duration: 25, delay: 9 },
  ], []);

  const lightRays = useMemo(() => [
    { angle: 15, delay: 0, width: 2 },
    { angle: 30, delay: 2, width: 1 },
    { angle: 45, delay: 4, width: 3 },
    { angle: 60, delay: 1, width: 1 },
    { angle: 75, delay: 3, width: 2 },
    { angle: 85, delay: 5, width: 1 },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Main aurora orbs - enhanced */}
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} {...orb} />
      ))}

      {/* Animated mesh gradient overlay - more complex */}
      <motion.div
        animate={{ 
          background: [
            'radial-gradient(ellipse at 20% 50%, rgba(201, 169, 110, 0.07) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(201, 169, 110, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(232, 213, 163, 0.04) 0%, transparent 40%)',
            'radial-gradient(ellipse at 60% 30%, rgba(201, 169, 110, 0.07) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(201, 169, 110, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(232, 213, 163, 0.04) 0%, transparent 40%)',
            'radial-gradient(ellipse at 40% 80%, rgba(201, 169, 110, 0.07) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(201, 169, 110, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 20% 30%, rgba(232, 213, 163, 0.04) 0%, transparent 40%)',
            'radial-gradient(ellipse at 20% 50%, rgba(201, 169, 110, 0.07) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(201, 169, 110, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(232, 213, 163, 0.04) 0%, transparent 40%)',
          ]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      />

      {/* Dynamic light rays */}
      {lightRays.map((ray, i) => (
        <LightRay key={i} {...ray} />
      ))}

      {/* Animated light beams - enhanced with more beams */}
      <motion.div
        animate={{ opacity: [0.02, 0.08, 0.02], rotate: [0, 4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-gold-400/25 to-transparent"
      />
      <motion.div
        animate={{ opacity: [0.02, 0.06, 0.02], rotate: [0, -3, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-gold-300/20 to-transparent"
      />
      <motion.div
        animate={{ opacity: [0.01, 0.05, 0.01], rotate: [0, 2, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-0 left-[60%] w-[1px] h-full bg-gradient-to-b from-transparent via-gold-400/15 to-transparent"
      />

      {/* Animated grid lines - enhanced */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201, 169, 110, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 169, 110, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Moving highlight across grid - dual */}
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 w-[30%] h-full bg-gradient-to-r from-transparent via-gold-400/[0.04] to-transparent"
      />
      <motion.div
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 3 }}
        className="absolute left-0 w-full h-[30%] bg-gradient-to-b from-transparent via-gold-400/[0.03] to-transparent"
      />

      {/* Floating diamond shapes */}
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 45, 0], opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[15%] w-20 h-20 border border-gold-400/10"
        style={{ transform: 'rotate(45deg)' }}
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [45, 90, 45], opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[30%] left-[10%] w-16 h-16 border border-gold-300/10"
      />

      {/* Radial vignette - stronger edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_40%,rgba(250,250,248,0.85)_100%)]" />
      
      {/* Top and bottom atmospheric fog - enhanced */}
      <div className="absolute top-0 left-0 right-0 h-[250px] bg-gradient-to-b from-[#fafaf8]/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[250px] bg-gradient-to-t from-[#fafaf8]/70 to-transparent" />
    </div>
  );
}
