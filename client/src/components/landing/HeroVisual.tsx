/**
 * HeroVisual – lightweight orbital network scene.
 *
 * Uses @react-three/fiber + drei.
 * Respects prefers-reduced-motion: shows a static SVG fallback instead.
 * Lazy-loaded by the parent so it never blocks LCP.
 */

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── helpers ──────────────────────────────────────────────────────────────────

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

// ── Node count tuned for mobile performance ───────────────────────────────────
const NODE_COUNT = 80;
const LENS_BLUE  = new THREE.Color('rgb(31, 98, 142)');
const PALE_BLUE  = new THREE.Color('rgb(120, 170, 210)');

// ── Points scattered on sphere surface ───────────────────────────────────────
function generateSpherePoints(count: number, radius: number) {
  const positions: number[] = [];
  for (let i = 0; i < count; i++) {
    const phi   = Math.acos(1 - 2 * Math.random());
    const theta = 2 * Math.PI * Math.random();
    positions.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
    );
  }
  return new Float32Array(positions);
}

// ── Arcs connecting nearby nodes ─────────────────────────────────────────────
function generateArcLines(positions: Float32Array, maxDist: number): Float32Array {
  const lines: number[] = [];
  const count = positions.length / 3;
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const ax = positions[i * 3],     ay = positions[i * 3 + 1], az = positions[i * 3 + 2];
      const bx = positions[j * 3],     by = positions[j * 3 + 1], bz = positions[j * 3 + 2];
      const dx = ax - bx, dy = ay - by, dz = az - bz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < maxDist) {
        lines.push(ax, ay, az, bx, by, bz);
      }
    }
  }
  return new Float32Array(lines);
}

// ── Three.js scene ─────────────────────────────────────────────────────────
function OrbitalNetwork({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  const { nodePositions, linePositions } = useMemo(() => {
    const nodePositions = generateSpherePoints(NODE_COUNT, 2.2);
    const linePositions = generateArcLines(nodePositions, 1.6);
    return { nodePositions, linePositions };
  }, []);

  useFrame((_, delta) => {
    if (reduced) return;
    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.x += delta * 0.025;
  });

  return (
    <group ref={groupRef}>
      {/* nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={LENS_BLUE}
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.85}
        />
      </points>

      {/* arcs */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={PALE_BLUE}
          transparent
          opacity={0.22}
        />
      </lineSegments>
    </group>
  );
}

// ── Static SVG fallback ──────────────────────────────────────────────────────
function StaticFallback() {
  return (
    <figure aria-label="Global distribution network illustration" className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        width="320"
        height="320"
        aria-hidden="true"
        className="opacity-60"
      >
        <circle cx="200" cy="200" r="160" fill="none" stroke="rgb(31,98,142)" strokeWidth="0.8" strokeDasharray="4 6" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="rgb(31,98,142)" strokeWidth="0.6" strokeDasharray="3 8" />
        <circle cx="200" cy="200" r="50"  fill="none" stroke="rgb(31,98,142)" strokeWidth="0.5" />

        {[
          [200, 40], [340, 120], [360, 270], [260, 370], [140, 370],
          [40, 270], [60, 120], [200, 200], [290, 195], [110, 200],
          [200, 120], [200, 290],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4" fill="rgb(31,98,142)" opacity="0.75" />
        ))}

        {[
          [200,40,  340,120], [340,120,360,270], [360,270,260,370],
          [260,370, 140,370], [140,370,40, 270], [40, 270,60, 120],
          [60, 120,200,40],   [200,200,290,195], [200,200,110,200],
          [200,200,200,120],  [200,200,200,290],
        ].map(([x1,y1,x2,y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgb(31,98,142)" strokeWidth="0.8" opacity="0.3" />
        ))}
      </svg>
    </figure>
  );
}

// ── Public component ─────────────────────────────────────────────────────────
export default function HeroVisual() {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <StaticFallback />;
  }

  return (
    <figure
      aria-label="Animated global distribution network"
      className="w-full h-full"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.4} />
        <OrbitalNetwork reduced={reduced} />
      </Canvas>
    </figure>
  );
}
