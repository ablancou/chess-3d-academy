"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import type { Group, Mesh } from "three";
import type { Square } from "chess.js";
import { squareToPosition } from "@/lib/chess/coordinates";

interface EnPassantBurstProps {
  captureSquare: Square;
  color: string;
  moveKey: string;
}

export function EnPassantBurst({
  captureSquare,
  color,
  moveKey,
}: EnPassantBurstProps) {
  const groupRef = useRef<Group>(null);
  const flashRef = useRef<Mesh>(null);
  const bornAt = useRef<number | null>(null);
  const [x, , z] = squareToPosition(captureSquare);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    if (bornAt.current === null) bornAt.current = clock.elapsedTime;
    const elapsed = clock.elapsedTime - bornAt.current;
    if (elapsed > 1.4) {
      groupRef.current.visible = false;
      return;
    }

    const fade = 1 - elapsed / 1.4;
    if (flashRef.current) {
      flashRef.current.scale.setScalar(0.5 + elapsed * 0.8);
      const mat = flashRef.current.material as { opacity: number };
      mat.opacity = fade * 0.7;
    }
  });

  return (
    <group key={moveKey} ref={groupRef} position={[x, 0.12, z]}>
      <mesh ref={flashRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.55, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.7}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.5}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}