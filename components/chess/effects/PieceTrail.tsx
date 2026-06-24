"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { AdditiveBlending } from "three";
import type { Vector3 } from "three";

interface PieceTrailProps {
  trailRef: React.RefObject<Vector3[]>;
  color: string;
  active: boolean;
}

export function PieceTrail({ trailRef, color, active }: PieceTrailProps) {
  const opacity = useRef(1);
  const lineRef = useRef<{ material: { opacity: number } } | null>(null);

  useFrame((_, delta) => {
    const points = trailRef.current;
    if (!points || points.length < 2) return;

    if (active) {
      opacity.current = 1;
    } else {
      opacity.current = Math.max(0, opacity.current - delta * 2.5);
    }

    if (lineRef.current?.material) {
      lineRef.current.material.opacity = 0.85 * opacity.current;
    }
  });

  const points = trailRef.current;
  if (!points || points.length < 2 || opacity.current <= 0.01) return null;

  const linePoints = points.map(
    (p) => [p.x, p.y + 0.15, p.z] as [number, number, number],
  );

  return (
    <group>
      <Line
        ref={lineRef as never}
        points={linePoints}
        color={color}
        lineWidth={2.5}
        transparent
        opacity={0.85}
      />
      {points.slice(-4).map((p, i) => (
        <mesh key={i} position={[p.x, p.y + 0.18, p.z]}>
          <sphereGeometry args={[0.04 - i * 0.008, 8, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.7 - i * 0.15}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}