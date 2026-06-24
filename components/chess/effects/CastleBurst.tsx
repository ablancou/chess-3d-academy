"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import type { Group } from "three";
import type { Square } from "chess.js";
import { squareToPosition } from "@/lib/chess/coordinates";

interface CastleBurstProps {
  from: Square;
  to: Square;
  color: string;
  moveKey: string;
}

export function CastleBurst({ from, to, color, moveKey }: CastleBurstProps) {
  const groupRef = useRef<Group>(null);
  const bornAt = useRef<number | null>(null);

  const [fx, , fz] = squareToPosition(from);
  const [tx, , tz] = squareToPosition(to);
  const mx = (fx + tx) / 2;
  const mz = (fz + tz) / 2;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    if (bornAt.current === null) bornAt.current = clock.elapsedTime;
    const elapsed = clock.elapsedTime - bornAt.current;
    if (elapsed > 1.5) {
      groupRef.current.visible = false;
      return;
    }
    groupRef.current.rotation.y = elapsed * 2;
    const scale = 1 + elapsed * 0.3;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group key={moveKey} ref={groupRef} position={[mx, 0.1, mz]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 1.2, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
    </group>
  );
}