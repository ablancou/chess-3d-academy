"use client";

import { Line } from "@react-three/drei";
import { BOARD_HALF } from "@/lib/chess/coordinates";
import type { BoardThemeConfig } from "@/lib/chess/themes";
import { GlassMaterial } from "./materials/GlassMaterial";

interface BoardBaseProps {
  theme: BoardThemeConfig;
}

export function BoardBase({ theme }: BoardBaseProps) {
  const size = BOARD_HALF * 2 + 0.5;
  const half = size / 2;

  const borderPoints: [number, number, number][] = [
    [-half, 0.002, -half],
    [half, 0.002, -half],
    [half, 0.002, half],
    [-half, 0.002, half],
    [-half, 0.002, -half],
  ];

  return (
    <group>
      {/* Shadow catcher */}
      <mesh
        position={[0, -0.06, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[size + 0.8, size + 0.8]} />
        <meshStandardMaterial
          color="#050a12"
          metalness={0.15}
          roughness={0.92}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Floating plinth */}
      <mesh position={[0, -0.045, 0]} receiveShadow>
        <boxGeometry args={[size, 0.09, size]} />
        <GlassMaterial config={theme.frameGlass} emissiveBoost={0.5} />
      </mesh>

      {/* Crisp border line */}
      <Line
        points={borderPoints}
        color={theme.gridGlow}
        lineWidth={1}
        transparent
        opacity={0.45}
      />
    </group>
  );
}