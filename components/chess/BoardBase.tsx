"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { AdditiveBlending } from "three";
import type { Mesh } from "three";
import { BOARD_HALF } from "@/lib/chess/coordinates";
import type { BoardThemeConfig } from "@/lib/chess/themes";
import { GlassMaterial } from "./materials/GlassMaterial";

interface BoardBaseProps {
  theme: BoardThemeConfig;
}

export function BoardBase({ theme }: BoardBaseProps) {
  const size = BOARD_HALF * 2 + 0.5;
  const half = size / 2;
  const glowRef = useRef<Mesh>(null);

  const borderPoints: [number, number, number][] = [
    [-half, 0.002, -half],
    [half, 0.002, -half],
    [half, 0.002, half],
    [-half, 0.002, half],
    [-half, 0.002, -half],
  ];

  useFrame(({ clock }) => {
    if (!glowRef.current) return;
    const mat = glowRef.current.material as { opacity: number };
    mat.opacity = 0.2 + Math.sin(clock.elapsedTime * 1.5) * 0.08;
  });

  return (
    <group>
      <mesh
        position={[0, -0.06, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[size + 1.2, size + 1.2]} />
        <meshStandardMaterial
          color="#020617"
          metalness={0.25}
          roughness={0.9}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh ref={glowRef} position={[0, -0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[half - 0.1, half + 0.5, 64]} />
        <meshBasicMaterial
          color={theme.gridGlow}
          transparent
          opacity={0.25}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, -0.045, 0]} receiveShadow castShadow>
        <boxGeometry args={[size, 0.09, size]} />
        <GlassMaterial config={theme.frameGlass} emissiveBoost={0.7} />
      </mesh>

      <Line
        points={borderPoints}
        color={theme.gridGlow}
        lineWidth={2}
        transparent
        opacity={0.65}
      />
    </group>
  );
}