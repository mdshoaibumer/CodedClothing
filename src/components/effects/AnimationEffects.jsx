import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Text scramble effect hook
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';

function useTextScramble(text, isActive) {
  const [displayText, setDisplayText] = useState(text);
  const activeRef = useRef(isActive);
  activeRef.current = isActive;

  useEffect(() => {
    if (!activeRef.current) return;

    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) return char;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text, isActive]);

  return displayText;
}

// Magnetic button effect
export function MagneticButton({ children, className = '', ...props }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) * 0.3;
    const y = (clientY - top - height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Animated counter
export function AnimatedCounter({ target, duration = 2, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

// Text scramble component
export function ScrambleText({ text, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const displayText = useTextScramble(text, isInView);

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {displayText || text}
    </span>
  );
}

// Staggered text reveal
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
            ease: [0.16, 1, 0.3, 1],
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

// Parallax scroll component
export function ParallaxSection({ children, speed = 0.5, className = '' }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      setOffset(scrolled * speed * 0.1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: offset }}>
        {children}
      </motion.div>
    </div>
  );
}

// Reveal on scroll
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
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Infinite marquee
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

// Tilt card effect
export function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shine, setShine] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setRotateX((y - 0.5) * -15);
    setRotateY((x - 0.5) * 15);
    setShine({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setShine({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative ${className}`}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      {children}
      {/* Shine overlay */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(201,169,110,0.15) 0%, transparent 60%)`,
        }}
      />
    </motion.div>
  );
}

// Glitch text effect
export function GlitchText({ text, className = '' }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -translate-x-[2px] translate-y-[2px] text-gold-500/30 z-0 animate-pulse" aria-hidden="true">
        {text}
      </span>
      <span className="absolute top-0 left-0 translate-x-[2px] -translate-y-[1px] text-obsidian-300/20 z-0" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// GSAP-powered horizontal scroll section
export function HorizontalScrollSection({ children, className = '' }) {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContent = scrollRef.current;
    if (!container || !scrollContent) return;

    const totalWidth = scrollContent.scrollWidth - container.offsetWidth;

    const tween = gsap.to(scrollContent, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={scrollRef} className="flex gap-8 will-change-transform">
        {children}
      </div>
    </div>
  );
}

// GSAP-powered text line reveal (splits into lines and reveals on scroll)
export function TextLineReveal({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(el, 
      { y: 80, opacity: 0, rotateX: 40 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <div ref={ref} className={className} style={{ perspective: '1000px' }}>
      {children}
    </div>
  );
}

// Premium number ticker that counts up with smooth easing
export function NumberTicker({ value, duration = 2.5, prefix = '', suffix = '', className = '' }) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration,
      ease: 'power2.out',
      onUpdate: () => setDisplayValue(Math.floor(obj.val)),
    });
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

// Morphing blob background
export function MorphingBlob({ className = '', color = 'rgba(201, 169, 110, 0.1)' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(el, {
      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
      duration: 4,
      ease: 'sine.inOut',
    })
    .to(el, {
      borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
      duration: 4,
      ease: 'sine.inOut',
    })
    .to(el, {
      borderRadius: '50% 50% 30% 70% / 60% 40% 60% 40%',
      duration: 4,
      ease: 'sine.inOut',
    });

    return () => tl.kill();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`absolute ${className}`}
      style={{ background: color, borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
    />
  );
}

// Scroll-triggered scale reveal
export function ScaleReveal({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
      animate={isInView ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Smooth parallax with framer-motion useScroll
export function SmoothParallax({ children, offset = 100, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: smoothY }}>
        {children}
      </motion.div>
    </div>
  );
}

// Infinite rotating text ring
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
          className="absolute left-1/2 top-0 origin-[0_100px] text-[10px] font-bold uppercase tracking-wider text-gold-500/60"
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

// Spotlight hover card effect
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
      {/* Edge glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-[inherit]"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(201, 169, 110, 0.15) 0%, transparent 40%)`,
        }}
      />
    </div>
  );
}

// Liquid text distortion - characters wave on scroll
export function LiquidText({ text, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const chars = text.split('');

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90, scale: 0.5 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : {}}
          transition={{
            duration: 0.8,
            delay: i * 0.03,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
          style={{ perspective: '800px' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// Magnetic container - elements inside get attracted to cursor
export function MagneticContainer({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * strength;
    const y = (e.clientY - top - height / 2) * strength;
    setPosition({ x, y });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Infinite orbital animation for decorative elements
export function OrbitalRing({ children, radius = 100, duration = 20, className = '' }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
      className={`relative ${className}`}
      style={{ width: radius * 2, height: radius * 2 }}
    >
      {children}
    </motion.div>
  );
}

// Breathing glow component
export function BreathingGlow({ color = 'rgba(201, 169, 110, 0.3)', size = 200, className = '' }) {
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(30px)',
      }}
    />
  );
}

// Split reveal - text splits and reveals from center
export function SplitReveal({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ clipPath: 'inset(0 50% 0 50%)' }}
        animate={isInView ? { clipPath: 'inset(0 0% 0 0%)' } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
