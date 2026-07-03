"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import type { Group, Mesh } from "three";
import type { Square } from "chess.js";
import { squareToPosition } from "@/lib/chess/coordinates";
import type { LastMove } from "@/lib/chess/types";

interface MoveImpactProps {
  lastMove: LastMove | null;
  color: string;
  isCapture?: boolean;
}

const DURATION = 1.2;
const CAPTURE_DURATION = 1.45;

function ImpactBurst({
  square,
  color,
  intense,
}: {
  square: Square;
  color: string;
  intense: boolean;
}) {
  const particleCount = intense ? 36 : 24;
  const particlesRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);
  const bornAt = useRef<number | null>(null);

  const particles = useMemo(() => {
    const base = square.charCodeAt(0) * 131 + square.charCodeAt(1) * 17 + 7;
    const rand = (n: number) => {
      const s = ((base + n * 7919) * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
    return Array.from({ length: particleCount }, (_, i) => ({
      angle: rand(i * 4) * Math.PI * 2,
      speed: (intense ? 0.55 : 0.4) + rand(i * 4 + 1) * (intense ? 1.0 : 0.8),
      ySpeed: (intense ? 0.35 : 0.2) + rand(i * 4 + 2) * (intense ? 0.7 : 0.6),
      size: 0.02 + rand(i * 4 + 3) * (intense ? 0.05 : 0.04),
    }));
  }, [square, particleCount, intense]);

  const [x, , z] = squareToPosition(square);
  const duration = intense ? CAPTURE_DURATION : DURATION;
  const burstColor = intense ? "#f87171" : color;

  useFrame(({ clock }) => {
    if (bornAt.current === null) bornAt.current = clock.elapsedTime;
    const elapsed = clock.elapsedTime - bornAt.current;
    if (elapsed > duration) {
      if (particlesRef.current) particlesRef.current.visible = false;
      if (ringRef.current) ringRef.current.visible = false;
      return;
    }

    const progress = elapsed / duration;
    const fade = 1 - progress ** (intense ? 1.2 : 1);

    const group = particlesRef.current;
    if (group) {
      group.children.forEach((child, i) => {
        const p = particles[i];
        if (!p) return;
        child.position.set(
          Math.cos(p.angle) * p.speed * progress,
          0.08 + p.ySpeed * progress * (1 - progress * 0.5),
          Math.sin(p.angle) * p.speed * progress,
        );
        const scale = p.size * fade * (intense ? 2.4 : 2);
        child.scale.setScalar(scale);
        const mat = (child as Mesh).material as { opacity: number };
        if (mat) mat.opacity = fade * (intense ? 1 : 0.9);
      });
    }

    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + progress * (intense ? 0.9 : 0.6));
      const mat = ringRef.current.material as { opacity: number };
      if (mat) mat.opacity = fade * (intense ? 0.75 : 0.6);
    }
  });

  return (
    <group position={[x, 0, z]}>
      <group ref={particlesRef}>
        {particles.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, intense ? 10 : 8, intense ? 10 : 8]} />
            <meshBasicMaterial
              color={burstColor}
              transparent
              opacity={0.9}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      <mesh
        ref={ringRef}
        position={[0, 0.07, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.1, intense ? 0.42 : 0.35, 48]} />
        <meshBasicMaterial
          color={burstColor}
          transparent
          opacity={0.6}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function MoveImpact({ lastMove, color, isCapture = false }: MoveImpactProps) {
  const key = lastMove ? `${lastMove.from}-${lastMove.to}` : null;

  if (!lastMove || !key) return null;

  return (
    <group key={key}>
      <ImpactBurst square={lastMove.from} color={color} intense={isCapture} />
      <ImpactBurst square={lastMove.to} color={color} intense={isCapture} />
    </group>
  );
}
