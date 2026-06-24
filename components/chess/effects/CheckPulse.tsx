"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, DoubleSide } from "three";
import type { Mesh } from "three";
import type { Square } from "chess.js";
import { squareToPosition } from "@/lib/chess/coordinates";

interface CheckPulseProps {
  square: Square;
  active: boolean;
}

export function CheckPulse({ square, active }: CheckPulseProps) {
  const ringRef = useRef<Mesh>(null);
  const beamRef = useRef<Mesh>(null);
  const [x, , z] = squareToPosition(square);

  useFrame(({ clock }) => {
    if (!active) return;
    const t = clock.elapsedTime;
    const pulse = 0.5 + Math.sin(t * 6) * 0.5;

    if (ringRef.current) {
      ringRef.current.scale.setScalar(0.9 + pulse * 0.2);
      const mat = ringRef.current.material as { opacity: number };
      mat.opacity = 0.5 + pulse * 0.4;
    }
    if (beamRef.current) {
      const mat = beamRef.current.material as { opacity: number };
      mat.opacity = 0.12 + pulse * 0.1;
    }
  });

  if (!active) return null;

  return (
    <group position={[x, 0, z]}>
      <mesh ref={beamRef} position={[0, 2, 0]}>
        <cylinderGeometry args={[0.04, 0.2, 4, 16, 1, true]} />
        <meshBasicMaterial
          color="#ef4444"
          transparent
          opacity={0.15}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.48, 64]} />
        <meshBasicMaterial
          color="#ef4444"
          transparent
          opacity={0.7}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}