"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

interface PulsingRingProps {
  color: string;
  innerRadius?: number;
  outerRadius?: number;
  speed?: number;
  y?: number;
}

export function PulsingRing({
  color,
  innerRadius = 0.14,
  outerRadius = 0.22,
  speed = 2.5,
  y = 0.07,
}: PulsingRingProps) {
  const ringRef = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    const pulse = 0.5 + Math.sin(t) * 0.35;
    const pulse2 = 0.5 + Math.sin(t + Math.PI) * 0.35;

    if (ringRef.current) {
      const mat = ringRef.current.material as { opacity: number };
      mat.opacity = 0.5 + pulse * 0.45;
      ringRef.current.scale.setScalar(0.95 + pulse * 0.12);
    }
    if (ring2Ref.current) {
      const mat = ring2Ref.current.material as { opacity: number };
      mat.opacity = 0.2 + pulse2 * 0.25;
      ring2Ref.current.scale.setScalar(1.1 + pulse2 * 0.2);
    }
  });

  return (
    <group position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={ringRef}>
        <ringGeometry args={[innerRadius, outerRadius, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref}>
        <ringGeometry args={[outerRadius, outerRadius + 0.06, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.05, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} depthWrite={false} />
      </mesh>
    </group>
  );
}