/**
 * ParticleField.jsx — Lightweight Canvas2D Ambient Particle Effect
 * 
 * Replaces the previous Three.js implementation (~500KB bundle savings).
 * Renders subtle floating particles using native Canvas 2D API.
 * 
 * Performance Strategy:
 * - Device capability check (skips on mobile, low-core devices, reduced motion)
 * - requestAnimationFrame with frame throttling (~30fps)
 * - Minimal particle count (40 particles)
 * - Canvas resolution capped at 1x DPR
 * - Pauses when tab is hidden (Page Visibility API)
 * - No external dependencies
 */

import { useRef, useEffect, useState, memo } from 'react';

const PARTICLE_COUNT = 40;

/**
 * Device capability check — prevents rendering on:
 * - Mobile devices (< 4 CPU cores)
 * - Touch-primary devices
 * - Users who prefer reduced motion
 */
function useIsCapableDevice() {
  const [capable] = useState(() => {
    if (typeof window === 'undefined') return false;
    const cores = navigator.hardwareConcurrency || 2;
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return cores >= 4 && !isMobile && !prefersReduced;
  });
  return capable;
}

/**
 * Creates initial particle data with random positions and velocities
 */
function createParticles(width, height) {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    radius: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.4 + 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.01 + 0.005,
  }));
}

const ParticleField = memo(function ParticleField() {
  const capable = useIsCapableDevice();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    if (!capable) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas size at 1x DPR for performance
    canvas.width = width;
    canvas.height = height;

    particlesRef.current = createParticles(width, height);

    let lastFrame = 0;
    const FRAME_INTERVAL = 1000 / 30; // Cap at 30fps

    function animate(timestamp) {
      if (!visibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Frame throttle
      if (timestamp - lastFrame < FRAME_INTERVAL) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrame = timestamp;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Pulsing opacity
        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${currentOpacity})`;
        ctx.fill();
      }

      // Draw subtle connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = dx * dx + dy * dy;

          if (dist < 15000) {
            const opacity = (1 - dist / 15000) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 169, 110, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    // Handle resize (debounced)
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      }, 200);
    };

    // Handle visibility
    const handleVisibility = () => {
      visibleRef.current = !document.hidden;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animationRef.current);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [capable]);

  if (!capable) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-50"
      aria-hidden="true"
    />
  );
});

export default ParticleField;
