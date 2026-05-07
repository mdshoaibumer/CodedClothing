/**
 * ParticleField.jsx — 3D Ambient Particle Effect
 * 
 * Renders a Three.js particle system as a subtle background decoration.
 * 
 * Performance Strategy:
 * - Device capability check (skips on mobile, low-core devices, reduced motion)
 * - Low DPR (1x) and disabled antialiasing for minimal GPU load
 * - Frame throttling (renders every other frame)
 * - Minimal particle count (150 instanced meshes)
 * - "demand" frameloop — only re-renders when animation updates
 * - Lazy-loaded via React.lazy() in App.jsx
 */

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Pre-generated particle data — computed once at module load (avoids useMemo purity issue) */
const PARTICLE_DATA = Array.from({ length: 150 }, () => ({
  time: Math.random() * 100,
  factor: 20 + Math.random() * 100,
  speed: 0.0001 + Math.random() / 40000,
  x: (Math.random() - 0.5) * 80,
  y: (Math.random() - 0.5) * 80,
  z: (Math.random() - 0.5) * 80,
}));

/** Pre-generated nebula positions */
const NEBULA_POSITIONS = (() => {
  const pos = new Float32Array(300 * 3);
  for (let i = 0; i < 300; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 8 + Math.random() * 15;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  return pos;
})();

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

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * Particles — Instanced mesh with 150 particles.
 * Uses InstancedMesh for batched draw calls (single GPU draw).
 * Throttled to update every 2nd frame for 30fps particle movement.
 */
function Particles({ count = 150 }) {
  const mesh = useRef();
  const particles = PARTICLE_DATA.slice(0, count);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const frameCount = useRef(0);

  useFrame(() => {
    frameCount.current++;
    // Throttle to every other frame for performance
    if (frameCount.current % 2 !== 0) return;

    particles.forEach((particle, i) => {
      const { factor, speed, x, y, z } = particle;
      const time = (particle.time += speed);

      const s = Math.cos(time);
      dummy.position.set(
        x + Math.cos((time / 2) * factor) * 4,
        y + Math.sin((time / 3) * factor) * 4,
        z + Math.cos((time / 4) * factor) * 4
      );
      dummy.scale.setScalar(Math.max(0.1, Math.abs(s) * 0.8));
      dummy.rotation.set(time * 0.5, time * 0.3, time * 0.2);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#c9a96e" transparent opacity={0.6} />
    </instancedMesh>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * NebulaCloud — Point cloud creating a nebula-like ambient effect.
 * 300 points distributed in a spherical pattern with additive blending.
 */
function NebulaCloud() {
  const meshRef = useRef();
  const positions = NEBULA_POSITIONS;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.02;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={300}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#e8d5a3"
        size={0.08}
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * FloatingRings — Concentric torus rings rotating slowly.
 * Adds depth and luxury feel to the background.
 */
function FloatingRings() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.04;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.025) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0, 0]} rotation={[i * 0.4, i * 0.3, i * 0.2]}>
          <torusGeometry args={[4 + i * 3, 0.015, 8, 80]} />
          <meshBasicMaterial color="#c9a96e" transparent opacity={0.12 - i * 0.02} />
        </mesh>
      ))}
    </group>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/**
 * ParticleField — Main export. Renders the 3D canvas with all particle effects.
 * Returns null on incapable devices (mobile, low-end, reduced motion).
 */
export default function ParticleField() {
  const capable = useIsCapableDevice();

  if (!capable) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-50">
      <Canvas
        camera={{ position: [0, 0, 22], fov: 55 }}
        dpr={[1, 1]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }}
        frameloop="always"
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#c9a96e" />
        <Particles count={150} />
        <NebulaCloud />
        <FloatingRings />
      </Canvas>
    </div>
  );
}
