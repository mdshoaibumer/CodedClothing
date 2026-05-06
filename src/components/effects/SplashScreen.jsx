import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Generate particles data outside component to avoid impure render
const SPLASH_PARTICLES = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 1600,
  y: (Math.random() - 0.5) * 1600,
  size: Math.random() * 6 + 1,
  delay: Math.random() * 0.8,
  duration: Math.random() * 2.5 + 1,
  opacity: 0.5 + Math.random() * 0.5,
  rotation: Math.random() * 720 - 360,
}));

// Constellation lines between particles
const CONSTELLATION_LINES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x1: (Math.random() - 0.5) * 600,
  y1: (Math.random() - 0.5) * 600,
  x2: (Math.random() - 0.5) * 600,
  y2: (Math.random() - 0.5) * 600,
  delay: Math.random() * 1.2,
}));

// DNA Helix particles for the background
const HELIX_PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  angle: (i / 40) * Math.PI * 4,
  radius: 150 + Math.sin(i * 0.5) * 50,
  y: (i - 20) * 15,
  size: 3 + Math.random() * 3,
  delay: i * 0.05,
}));

// Cinematic particle burst component
function SplashParticles({ active }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {SPLASH_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
          animate={active ? { 
            x: p.x, 
            y: p.y, 
            opacity: [0, 1, 1, 0], 
            scale: [0, 2, 1, 0],
            rotate: p.rotation,
          } : {}}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            borderRadius: p.id % 3 === 0 ? '0' : '50%',
            transform: p.id % 3 === 0 ? 'rotate(45deg)' : 'none',
            background: `radial-gradient(circle, rgba(201, 169, 110, ${p.opacity}), transparent)`,
            boxShadow: `0 0 ${p.size * 6}px rgba(201, 169, 110, 0.8)`,
          }}
        />
      ))}
    </div>
  );
}

// Constellation network lines
function ConstellationNetwork({ active }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: active ? 1 : 0, transition: 'opacity 1s ease' }}>
      <g transform="translate(50%, 50%)" style={{ transform: 'translate(50%, 50%)' }}>
        {CONSTELLATION_LINES.map((line) => (
          <motion.line
            key={line.id}
            x1="50%" y1="50%"
            x2={`${50 + line.x2 / 12}%`}
            y2={`${50 + line.y2 / 12}%`}
            stroke="rgba(201, 169, 110, 0.2)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={active ? { pathLength: 1, opacity: [0, 0.4, 0] } : {}}
            transition={{ duration: 2, delay: line.delay, ease: 'easeInOut' }}
          />
        ))}
      </g>
    </svg>
  );
}

// Animated rings component - HYPER version
function AnimatedRings({ phase }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((ring) => (
        <motion.div
          key={ring}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={phase >= 1 ? { 
            scale: [0, ring * 1.4, ring * 3], 
            opacity: [0.9, 0.5, 0], 
            rotate: ring % 2 === 0 ? 360 : -360
          } : {}}
          transition={{ duration: 3 + ring * 0.3, delay: ring * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="absolute rounded-full"
          style={{ 
            width: 100, 
            height: 100, 
            border: `${ring % 2 === 0 ? '1px' : '2px'} solid rgba(201, 169, 110, ${0.5 - ring * 0.05})`,
            boxShadow: `0 0 ${ring * 8}px rgba(201, 169, 110, 0.15), inset 0 0 ${ring * 4}px rgba(201, 169, 110, 0.05)`,
          }}
        />
      ))}
      {/* Hexagonal rings - more */}
      {[1, 2, 3, 4, 5].map((hex) => (
        <motion.div
          key={`hex-${hex}`}
          initial={{ scale: 0, opacity: 0, rotate: 30 }}
          animate={phase >= 1 ? { 
            scale: [0, hex * 2.2], 
            opacity: [0.7, 0], 
            rotate: [30, 30 + hex * 90]
          } : {}}
          transition={{ duration: 3.5, delay: 0.3 + hex * 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
          style={{ 
            width: 140, 
            height: 140, 
            border: '1px solid rgba(201, 169, 110, 0.35)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            boxShadow: '0 0 20px rgba(201, 169, 110, 0.1)',
          }}
        />
      ))}
      {/* Diamond shapes */}
      {[1, 2, 3].map((d) => (
        <motion.div
          key={`diamond-${d}`}
          initial={{ scale: 0, opacity: 0, rotate: 45 }}
          animate={phase >= 1 ? { 
            scale: [0, d * 2.5], 
            opacity: [0.5, 0], 
            rotate: [45, 45 + d * 120]
          } : {}}
          transition={{ duration: 4, delay: 0.6 + d * 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute"
          style={{ 
            width: 80, 
            height: 80, 
            border: '1px solid rgba(255, 215, 0, 0.25)',
            transform: 'rotate(45deg)',
          }}
        />
      ))}
    </div>
  );
}

// Helix DNA animation in background
function HelixAnimation({ phase }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {HELIX_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={phase >= 1 ? { 
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
            x: Math.cos(p.angle) * p.radius,
            y: p.y,
          } : {}}
          transition={{ duration: 3, delay: p.delay, ease: 'easeInOut' }}
          className="absolute rounded-full bg-gold-400/40"
          style={{ 
            width: p.size, 
            height: p.size,
            boxShadow: `0 0 ${p.size * 2}px rgba(201, 169, 110, 0.4)`,
          }}
        />
      ))}
    </div>
  );
}

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1000);
    const t3 = setTimeout(() => setPhase(3), 2200);
    const t4 = setTimeout(() => setPhase(4), 3000);
    const t5 = setTimeout(() => onComplete(), 3600);
    
    // Smooth progress counter
    const startTime = Date.now();
    const totalDuration = 3200;
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(elapsed / totalDuration, 1);
      setProgress(Math.floor(p * 100));
      if (p >= 1) clearInterval(progressInterval);
    }, 30);
    
    return () => { 
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 4 && (
        <motion.div
          exit={{ 
            opacity: 0, 
            scale: 1.3, 
            filter: 'blur(20px)',
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-obsidian-950 overflow-hidden"
        >
          {/* Multi-layer animated background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Rotating conic gradients */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px]"
            >
              <div className="w-full h-full bg-gradient-conic from-gold-600/20 via-transparent via-25% to-gold-400/15 rounded-full blur-3xl" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]"
            >
              <div className="w-full h-full bg-gradient-conic from-transparent via-gold-500/10 via-50% to-transparent rounded-full blur-2xl" />
            </motion.div>

            {/* Pulsing ambient light */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-gold-500/15 to-transparent rounded-full"
            />
            
            {/* Subtle noise grain */}
            <div className="absolute inset-0 opacity-[0.03]" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
            />
          </div>

          {/* Animated rings burst */}
          <AnimatedRings phase={phase} />
          
          {/* Helix DNA background animation */}
          <HelixAnimation phase={phase} />
          
          {/* Constellation network */}
          <ConstellationNetwork active={phase >= 2} />

          {/* Particle burst on phase 3 */}
          <SplashParticles active={phase >= 3} />

          {/* Center content */}
          <div className="relative flex flex-col items-center">
            {/* Logo mark with morphing effect */}
            <motion.div
              initial={{ scale: 0, rotate: -270, borderRadius: '50%' }}
              animate={{ 
                scale: phase >= 1 ? 1 : 0, 
                rotate: phase >= 1 ? 0 : -270,
                borderRadius: phase >= 2 ? '1rem' : '50%'
              }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-28 h-28 flex items-center justify-center mb-10"
            >
              {/* Multi-layer glow behind logo */}
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-gold-400/50 to-gold-600/50 rounded-[inherit] blur-2xl"
              />
              <motion.div
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [1.1, 1.5, 1.1], rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 bg-gradient-conic from-gold-400/30 via-transparent to-gold-500/30 rounded-full blur-xl"
              />
              {/* Logo container */}
              <div className="relative w-full h-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-[inherit] flex items-center justify-center shadow-2xl shadow-gold-500/50 overflow-hidden">
                <motion.span 
                  initial={{ opacity: 0, scale: 3, y: 20 }}
                  animate={phase >= 1 ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white font-black text-5xl italic relative z-10"
                >
                  C
                </motion.span>
                {/* Multi-layer shine sweep */}
                <motion.div
                  initial={{ x: '-100%', rotate: 15 }}
                  animate={phase >= 1 ? { x: '200%' } : {}}
                  transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={phase >= 2 ? { x: '200%' } : {}}
                  transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                />
                {/* Rotating highlight ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-1 rounded-[inherit] border-2 border-transparent border-t-white/30 border-r-white/10"
                />
              </div>
              {/* Orbiting particles around logo */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={`orbit-${i}`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
                  className="absolute inset-0"
                  style={{ transform: `rotate(${i * 60}deg)` }}
                >
                  <motion.div
                    animate={{ scale: [0.5, 1.5, 0.5], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="absolute -top-2 left-1/2 w-2 h-2 rounded-full bg-gold-300"
                    style={{ boxShadow: '0 0 10px rgba(201, 169, 110, 0.8)' }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Brand name - character by character reveal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : {}}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex overflow-hidden">
                {'CODED CLOTHING'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 60, opacity: 0, rotateX: 90 }}
                    animate={phase >= 2 ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                    transition={{ 
                      delay: i * 0.04, 
                      duration: 0.6, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    className="text-3xl md:text-4xl font-black text-white tracking-wide inline-block"
                    style={{ perspective: '500px' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>
              
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={phase >= 2 ? { scaleX: 1, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-[1px] w-48 bg-gradient-to-r from-transparent via-gold-500 to-transparent"
              />
              
              <div className="flex overflow-hidden">
                {'PREMIUM ATELIER'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 30, opacity: 0 }}
                    animate={phase >= 2 ? { y: 0, opacity: 1 } : {}}
                    transition={{ 
                      delay: 0.6 + i * 0.03, 
                      duration: 0.5, 
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    className="text-[11px] font-bold text-gold-400 uppercase tracking-[0.5em] inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Animated loading bar */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-14 relative"
            >
              {/* Progress percentage */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                className="text-center mb-3"
              >
                <span className="text-[10px] font-mono text-gold-400/60 tracking-[0.3em]">
                  {progress}%
                </span>
              </motion.div>
              
              {/* Main progress bar */}
              <div className="h-[2px] bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 3, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-300 origin-left relative"
                >
                  {/* Shimmer on progress bar */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                </motion.div>
                {/* Glowing dot at end of loading bar */}
                <motion.div
                  initial={{ left: '0%' }}
                  animate={{ left: '100%' }}
                  transition={{ duration: 3, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold-400"
                  style={{ boxShadow: '0 0 15px rgba(201,169,110,0.9), 0 0 30px rgba(201,169,110,0.5)' }}
                />
              </div>
              
              {/* Loading status text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                className="mt-4 text-center"
              >
                <span className="text-[9px] font-mono text-obsidian-400 tracking-[0.2em] uppercase">
                  {progress < 30 ? 'Initializing...' : progress < 60 ? 'Loading assets...' : progress < 90 ? 'Preparing experience...' : 'Ready'}
                </span>
              </motion.div>
            </motion.div>
          </div>

          {/* Corner decorations with stagger animation */}
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
              transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute w-20 h-20 ${pos} border-gold-500/30`}
            />
          ))}

          {/* Cinematic letterbox bars */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 right-0 h-[8vh] bg-obsidian-950 origin-left z-10"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 h-[8vh] bg-obsidian-950 origin-right z-10"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
