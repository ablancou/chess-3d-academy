"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, DoubleSide } from "three";
import type { Group, Mesh } from "three";

interface PieceAuraProps {
  color: string;
  active: boolean;
  intensity?: "hover" | "selected";
}

export function PieceAura({
  color,
  active,
  intensity = "selected",
}: PieceAuraProps) {
  const groupRef = useRef<Group>(null);
  const beamRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!active) return;
    const t = clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * (intensity === "selected" ? 1.8 : 1.2);
    }
    if (beamRef.current) {
      const mat = beamRef.current.material as { opacity: number };
      mat.opacity =
        intensity === "selected"
          ? 0.15 + Math.sin(t * 3) * 0.06
          : 0.06 + Math.sin(t * 2) * 0.03;
    }
    if (ringRef.current) {
      const scale =
        intensity === "selected"
          ? 1 + Math.sin(t * 4) * 0.08
          : 1 + Math.sin(t * 3) * 0.04;
      ringRef.current.scale.setScalar(scale);
    }
  });

  if (!active) return null;

  const beamHeight = intensity === "selected" ? 3.5 : 2;
  const beamOpacity = intensity === "selected" ? 0.18 : 0.08;

  return (
    <group>
      <mesh ref={beamRef} position={[0, beamHeight / 2 + 0.1, 0]}>
        <cylinderGeometry args={[0.02, 0.12, beamHeight, 16, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={beamOpacity}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>

      <group ref={groupRef} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh ref={ringRef}>
          <ringGeometry args={[0.38, 0.44, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={intensity === "selected" ? 0.9 : 0.5}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[0.48, 0.5, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.25}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={intensity === "selected" ? 0.6 : 0.25}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}