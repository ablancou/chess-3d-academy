"use client";

import type { PieceSymbol } from "chess.js";
import type { GlassMaterialConfig } from "@/lib/chess/themes";
import { GlassMaterial } from "./materials/GlassMaterial";

interface PieceGeometryProps {
  material: GlassMaterialConfig;
  emissiveBoost?: number;
  glowColor?: string;
}

function PieceCore({ color, height = 0.5 }: { color: string; height?: number }) {
  return (
    <mesh position={[0, height, 0]}>
      <sphereGeometry args={[0.04, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} />
    </mesh>
  );
}

function GlassMesh({
  material,
  variant = "base",
  emissiveBoost,
  ...meshProps
}: PieceGeometryProps & {
  variant?: "base" | "accent";
  children: React.ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
}) {
  const { children, ...rest } = meshProps;
  return (
    <mesh {...rest} castShadow>
      {children}
      <GlassMaterial
        config={material}
        variant={variant}
        emissiveBoost={emissiveBoost}
      />
    </mesh>
  );
}

function PawnGeometry({
  material,
  emissiveBoost = 1,
  glowColor = "#38bdf8",
}: PieceGeometryProps) {
  return (
    <group>
      <GlassMesh material={material} emissiveBoost={emissiveBoost} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.36, 0.2, 32]} />
      </GlassMesh>
      <GlassMesh material={material} emissiveBoost={emissiveBoost} position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.12, 0.22, 0.3, 24]} />
      </GlassMesh>
      <GlassMesh
        material={material}
        variant="accent"
        emissiveBoost={emissiveBoost * 1.4}
        position={[0, 0.56, 0]}
      >
        <sphereGeometry args={[0.17, 32, 32]} />
      </GlassMesh>
      <PieceCore color={glowColor} height={0.4} />
    </group>
  );
}

function RookGeometry({
  material,
  emissiveBoost = 1,
  glowColor = "#38bdf8",
}: PieceGeometryProps) {
  return (
    <group>
      <GlassMesh material={material} emissiveBoost={emissiveBoost} position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.32, 0.36, 0.24, 32]} />
      </GlassMesh>
      <GlassMesh material={material} emissiveBoost={emissiveBoost} position={[0, 0.4, 0]}>
        <boxGeometry args={[0.46, 0.4, 0.46]} />
      </GlassMesh>
      {[-0.19, 0.19].map((x) =>
        [-0.19, 0.19].map((z) => (
          <GlassMesh
            key={`${x}-${z}`}
            material={material}
            variant="accent"
            emissiveBoost={emissiveBoost * 1.5}
            position={[x, 0.72, z]}
          >
            <boxGeometry args={[0.13, 0.18, 0.13]} />
          </GlassMesh>
        )),
      )}
      <PieceCore color={glowColor} height={0.45} />
    </group>
  );
}

function KnightGeometry({
  material,
  emissiveBoost = 1,
  glowColor = "#38bdf8",
}: PieceGeometryProps) {
  return (
    <group rotation={[0, -Math.PI / 6, 0]}>
      <GlassMesh material={material} emissiveBoost={emissiveBoost} position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.32, 0.36, 0.24, 32]} />
      </GlassMesh>
      <GlassMesh material={material} emissiveBoost={emissiveBoost} position={[0.05, 0.4, 0.02]}>
        <boxGeometry args={[0.3, 0.34, 0.34]} />
      </GlassMesh>
      <GlassMesh
        material={material}
        variant="accent"
        emissiveBoost={emissiveBoost * 1.3}
        position={[0.16, 0.58, 0.1]}
        rotation={[0.3, 0.2, 0]}
      >
        <boxGeometry args={[0.24, 0.3, 0.2]} />
      </GlassMesh>
      <GlassMesh
        material={material}
        variant="accent"
        emissiveBoost={emissiveBoost * 1.6}
        position={[0.24, 0.74, 0.18]}
        rotation={[0.5, 0.3, 0.2]}
      >
        <boxGeometry args={[0.15, 0.22, 0.14]} />
      </GlassMesh>
      <PieceCore color={glowColor} height={0.42} />
    </group>
  );
}

function BishopGeometry({
  material,
  emissiveBoost = 1,
  glowColor = "#38bdf8",
}: PieceGeometryProps) {
  return (
    <group>
      <GlassMesh material={material} emissiveBoost={emissiveBoost} position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.32, 0.36, 0.24, 32]} />
      </GlassMesh>
      <GlassMesh material={material} emissiveBoost={emissiveBoost} position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.06, 0.28, 0.5, 32]} />
      </GlassMesh>
      <GlassMesh
        material={material}
        variant="accent"
        emissiveBoost={emissiveBoost * 1.4}
        position={[0, 0.8, 0]}
      >
        <sphereGeometry args={[0.15, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </GlassMesh>
      <GlassMesh
        material={material}
        variant="accent"
        emissiveBoost={emissiveBoost * 1.8}
        position={[0, 0.92, 0]}
      >
        <sphereGeometry args={[0.07, 16, 16]} />
      </GlassMesh>
      <PieceCore color={glowColor} height={0.5} />
    </group>
  );
}

function QueenGeometry({
  material,
  emissiveBoost = 1,
  glowColor = "#38bdf8",
}: PieceGeometryProps) {
  return (
    <group>
      <GlassMesh material={material} emissiveBoost={emissiveBoost} position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.32, 0.36, 0.24, 32]} />
      </GlassMesh>
      <GlassMesh material={material} emissiveBoost={emissiveBoost} position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.1, 0.3, 0.52, 32]} />
      </GlassMesh>
      <GlassMesh
        material={material}
        variant="accent"
        emissiveBoost={emissiveBoost * 1.4}
        position={[0, 0.84, 0]}
      >
        <sphereGeometry args={[0.19, 32, 32]} />
      </GlassMesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <GlassMesh
            key={i}
            material={material}
            variant="accent"
            emissiveBoost={emissiveBoost * 1.8}
            position={[Math.cos(angle) * 0.15, 1.02, Math.sin(angle) * 0.15]}
          >
            <sphereGeometry args={[0.055, 12, 12]} />
          </GlassMesh>
        );
      })}
      <PieceCore color={glowColor} height={0.55} />
    </group>
  );
}

function KingGeometry({
  material,
  emissiveBoost = 1,
  glowColor = "#38bdf8",
}: PieceGeometryProps) {
  return (
    <group>
      <GlassMesh material={material} emissiveBoost={emissiveBoost} position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.32, 0.36, 0.24, 32]} />
      </GlassMesh>
      <GlassMesh material={material} emissiveBoost={emissiveBoost} position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.15, 0.3, 0.54, 32]} />
      </GlassMesh>
      <GlassMesh
        material={material}
        variant="accent"
        emissiveBoost={emissiveBoost * 1.4}
        position={[0, 0.86, 0]}
      >
        <boxGeometry args={[0.3, 0.16, 0.3]} />
      </GlassMesh>
      <GlassMesh
        material={material}
        variant="accent"
        emissiveBoost={emissiveBoost * 1.8}
        position={[0, 1.04, 0]}
      >
        <boxGeometry args={[0.09, 0.22, 0.09]} />
      </GlassMesh>
      <GlassMesh
        material={material}
        variant="accent"
        emissiveBoost={emissiveBoost * 1.8}
        position={[0, 0.99, 0]}
      >
        <boxGeometry args={[0.22, 0.09, 0.09]} />
      </GlassMesh>
      <PieceCore color={glowColor} height={0.58} />
    </group>
  );
}

const GEOMETRIES: Record<
  PieceSymbol,
  React.ComponentType<PieceGeometryProps>
> = {
  p: PawnGeometry,
  r: RookGeometry,
  n: KnightGeometry,
  b: BishopGeometry,
  q: QueenGeometry,
  k: KingGeometry,
};

export function PieceGeometry({
  type,
  material,
  emissiveBoost = 1,
  glowColor,
}: PieceGeometryProps & { type: PieceSymbol }) {
  const Component = GEOMETRIES[type];
  return (
    <Component
      material={material}
      emissiveBoost={emissiveBoost}
      glowColor={glowColor}
    />
  );
}