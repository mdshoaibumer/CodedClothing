import { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

// Trail dot component - enhanced
function TrailDot({ x, y, index, total }) {
  const springConfig = { damping: 18 + index * 3, stiffness: 220 - index * 18, mass: 0.2 + index * 0.12 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const opacity = 1 - (index / total) * 0.8;
  const size = Math.max(2, 8 - index * 1);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9997]"
      style={{ x: springX, y: springY }}
    >
      <div 
        className="rounded-full"
        style={{ 
          width: size, 
          height: size, 
          marginLeft: -size / 2, 
          marginTop: -size / 2,
          opacity,
          background: `radial-gradient(circle, rgba(201, 169, 110, ${opacity}) 0%, transparent 70%)`,
          boxShadow: `0 0 ${size * 3}px rgba(201, 169, 110, ${opacity * 0.6}), 0 0 ${size * 6}px rgba(201, 169, 110, ${opacity * 0.3})`,
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
  const prevPos = useRef({ x: -100, y: -100 });

  const springConfig = { damping: 20, stiffness: 400, mass: 0.3 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  // Outer ring with slower spring for trailing effect
  const outerSpring = { damping: 15, stiffness: 150, mass: 0.8 };
  const outerX = useSpring(cursorX, outerSpring);
  const outerY = useSpring(cursorY, outerSpring);

  // Scale based on velocity for stretch effect
  const speed = useMotionValue(0);
  const cursorScale = useTransform(speed, [0, 50], [1, 0.8]);
  const cursorStretch = useTransform(speed, [0, 50], [1, 1.3]);

  // Trail count - more for premium feel
  const trailCount = 8;

  useEffect(() => {
    let lastTime = performance.now();
    
    const moveCursor = (e) => {
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;
      
      const dx = e.clientX - prevPos.current.x;
      const dy = e.clientY - prevPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const velocity = dt > 0 ? dist / dt * 16 : 0;
      
      speed.set(Math.min(velocity, 50));
      prevPos.current = { x: e.clientX, y: e.clientY };
      
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
  }, [cursorX, cursorY, speed]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Trail dots - enhanced */}
      {Array.from({ length: trailCount }, (_, i) => (
        <TrailDot key={i} x={cursorX} y={cursorY} index={i + 1} total={trailCount} />
      ))}

      {/* Main cursor dot with velocity stretch */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x, y, scaleX: cursorStretch, scaleY: cursorScale }}
        animate={{
          scale: isClicking ? 0.2 : isHovering ? 3 : 1,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ scale: { type: 'spring', stiffness: 500, damping: 18 }, opacity: { duration: 0.15 } }}
      >
        <div className="w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-white" />
      </motion.div>

      {/* Outer morphing ring - enhanced with glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: outerX, y: outerY }}
        animate={{
          scale: isClicking ? 0.4 : isHovering ? 2.5 : 1,
          opacity: hidden ? 0 : 0.8,
          borderRadius: isHovering ? '20%' : '50%',
          rotate: isHovering ? 45 : 0,
        }}
        transition={{ 
          scale: { type: 'spring', stiffness: 200, damping: 15 }, 
          opacity: { duration: 0.15 },
          borderRadius: { duration: 0.4 },
          rotate: { duration: 0.6 },
        }}
      >
        <div className="w-14 h-14 -ml-7 -mt-7 rounded-[inherit] border-2 border-gold-400/80 backdrop-blur-[1px]" 
          style={{ boxShadow: isHovering ? '0 0 25px rgba(201, 169, 110, 0.4), inset 0 0 12px rgba(201, 169, 110, 0.15)' : '0 0 8px rgba(201, 169, 110, 0.15)' }}
        />
      </motion.div>

      {/* Secondary outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{ x: outerX, y: outerY }}
        animate={{
          scale: isClicking ? 0.2 : isHovering ? 3 : 1.3,
          opacity: hidden ? 0 : isHovering ? 0.5 : 0.2,
          rotate: isHovering ? -45 : 0,
        }}
        transition={{ 
          type: 'spring', stiffness: 100, damping: 20, mass: 1.2,
        }}
      >
        <div className="w-18 h-18 -ml-9 -mt-9 rounded-full border border-gold-400/40 border-dashed"
          style={{ width: 36, height: 36, marginLeft: -18, marginTop: -18 }}
        />
      </motion.div>

      {/* Tertiary glow ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9996]"
        style={{ x: outerX, y: outerY }}
        animate={{
          scale: isClicking ? 0.1 : isHovering ? 3.5 : 1.5,
          opacity: hidden ? 0 : isHovering ? 0.3 : 0.05,
        }}
        transition={{ 
          type: 'spring', stiffness: 60, damping: 25, mass: 1.5,
        }}
      >
        <div className="w-20 h-20 -ml-10 -mt-10 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, rgba(201, 169, 110, 0.1) 0%, transparent 70%)',
            width: 40, height: 40, marginLeft: -20, marginTop: -20,
          }}
        />
      </motion.div>

      {/* Click ripple effect */}
      <AnimatePresence>
        {isClicking && (
          <motion.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 pointer-events-none z-[9996]"
            style={{ x, y }}
          >
            <div className="w-6 h-6 -ml-3 -mt-3 rounded-full border border-gold-400/50" />
          </motion.div>
        )}
      </AnimatePresence>

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
