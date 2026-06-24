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
}

const PARTICLE_COUNT = 24;
const DURATION = 1.2;

function ImpactBurst({ square, color }: { square: Square; color: string }) {
  const particlesRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);
  const bornAt = useRef<number | null>(null);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.8,
      ySpeed: 0.2 + Math.random() * 0.6,
      size: 0.02 + Math.random() * 0.04,
    }));
  }, []);

  const [x, , z] = squareToPosition(square);

  useFrame(({ clock }) => {
    if (bornAt.current === null) bornAt.current = clock.elapsedTime;
    const elapsed = clock.elapsedTime - bornAt.current;
    if (elapsed > DURATION) {
      if (particlesRef.current) particlesRef.current.visible = false;
      if (ringRef.current) ringRef.current.visible = false;
      return;
    }

    const progress = elapsed / DURATION;
    const fade = 1 - progress;

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
        const scale = p.size * fade * 2;
        child.scale.setScalar(scale);
        const mat = (child as Mesh).material as { opacity: number };
        if (mat) mat.opacity = fade * 0.9;
      });
    }

    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + progress * 0.6);
      const mat = ringRef.current.material as { opacity: number };
      if (mat) mat.opacity = fade * 0.6;
    }
  });

  return (
    <group position={[x, 0, z]}>
      <group ref={particlesRef}>
        {particles.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
              color={color}
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
        <ringGeometry args={[0.1, 0.35, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function MoveImpact({ lastMove, color }: MoveImpactProps) {
  const key = lastMove ? `${lastMove.from}-${lastMove.to}` : null;

  if (!lastMove || !key) return null;

  return (
    <group key={key}>
      <ImpactBurst square={lastMove.from} color={color} />
      <ImpactBurst square={lastMove.to} color={color} />
    </group>
  );
}