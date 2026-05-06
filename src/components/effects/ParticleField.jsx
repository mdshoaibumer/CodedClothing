import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 400 }) {
  const mesh = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.0002 + Math.random() / 20000;
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { time, factor, speed, x, y, z } = particle;
      time = particle.time += speed;
      
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

// Nebula cloud effect
function NebulaCloud() {
  const meshRef = useRef();
  
  const positions = useMemo(() => {
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
  }, []);

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

function FloatingOrbs() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.025;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[
          Math.cos((i / 10) * Math.PI * 2) * 12,
          Math.sin((i / 10) * Math.PI * 2) * 6,
          Math.sin((i / 10) * Math.PI) * 10
        ]}>
          <sphereGeometry args={[0.15 + i * 0.06, 32, 32]} />
          <meshStandardMaterial
            color="#c9a96e"
            emissive="#c9a96e"
            emissiveIntensity={0.5}
            transparent
            opacity={0.5}
            roughness={0.05}
            metalness={0.95}
          />
        </mesh>
      ))}
    </group>
  );
}

// Floating ring geometry
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
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, 0, 0]} rotation={[i * 0.4, i * 0.3, i * 0.2]}>
          <torusGeometry args={[4 + i * 3, 0.015, 8, 80]} />
          <meshBasicMaterial color="#c9a96e" transparent opacity={0.12 - i * 0.02} />
        </mesh>
      ))}
    </group>
  );
}

// Flowing energy lines
function EnergyStreams() {
  const groupRef = useRef();
  
  const curves = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const points = [];
      for (let j = 0; j <= 60; j++) {
        const t = j / 60;
        const angle = t * Math.PI * 4 + i * (Math.PI / 5);
        const radius = 10 + Math.sin(t * Math.PI * 3) * 5;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          (t - 0.5) * 25,
          Math.sin(angle) * radius
        ));
      }
      return new THREE.CatmullRomCurve3(points);
    });
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 80, 0.012, 5, false]} />
          <meshBasicMaterial color="#c9a96e" transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

// Crystal lattice structure
function CrystalLattice() {
  const groupRef = useRef();
  
  const points = useMemo(() => {
    const pts = [];
    for (let x = -2; x <= 2; x++) {
      for (let y = -2; y <= 2; y++) {
        for (let z = -2; z <= 2; z++) {
          pts.push([x * 5, y * 5, z * 5]);
        }
      }
    }
    return pts;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.015;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshBasicMaterial color="#c9a96e" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// Spiral galaxy effect
function SpiralGalaxy() {
  const meshRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const angle = (i / 500) * Math.PI * 8;
      const radius = (i / 500) * 18;
      const scatter = (Math.random() - 0.5) * 2;
      pos[i * 3] = Math.cos(angle) * radius + scatter;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 2] = Math.sin(angle) * radius + scatter;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={500}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffd700"
        size={0.05}
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleField() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-70">
      <Canvas
        camera={{ position: [0, 0, 22], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#c9a96e" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#e8d5a3" />
        <pointLight position={[0, 15, 0]} intensity={0.4} color="#ffd700" />
        <pointLight position={[5, -5, 15]} intensity={0.3} color="#daa520" />
        <Particles count={500} />
        <NebulaCloud />
        <FloatingOrbs />
        <FloatingRings />
        <EnergyStreams />
        <CrystalLattice />
        <SpiralGalaxy />
      </Canvas>
    </div>
  );
}
