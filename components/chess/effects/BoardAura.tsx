"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, DoubleSide } from "three";
import type { Mesh } from "three";
import { BOARD_HALF } from "@/lib/chess/coordinates";

interface BoardAuraProps {
  color: string;
}

export function BoardAura({ color }: BoardAuraProps) {
  const beamRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const half = BOARD_HALF + 0.25;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (beamRef.current) {
      const mat = beamRef.current.material as { opacity: number };
      mat.opacity = 0.06 + Math.sin(t * 1.5) * 0.025;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 0.8) * 0.05;
      glowRef.current.scale.setScalar(scale);
      const mat = glowRef.current.material as { opacity: number };
      mat.opacity = 0.12 + Math.sin(t * 1.2) * 0.04;
    }
  });

  const corners: [number, number, number][] = [
    [-half, 0, -half],
    [half, 0, -half],
    [half, 0, half],
    [-half, 0, half],
  ];

  return (
    <group>
      <mesh ref={beamRef} position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.3, 1.8, 5, 32, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>

      <mesh
        ref={glowRef}
        position={[0, -0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[half + 0.6, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {corners.map((pos, i) => (
        <CornerPillar key={i} position={pos} color={color} delay={i * 0.5} />
      ))}
    </group>
  );
}

function CornerPillar({
  position,
  color,
  delay,
}: {
  position: [number, number, number];
  color: string;
  delay: number;
}) {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as { opacity: number };
    mat.opacity = 0.3 + Math.sin(clock.elapsedTime * 2 + delay) * 0.2;
  });

  return (
    <mesh ref={ref} position={[position[0], 0.5, position[2]]}>
      <cylinderGeometry args={[0.015, 0.015, 1, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.4}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}