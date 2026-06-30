"use client";

import * as THREE from "three";
import { useMemo } from "react";
import type { PieceSymbol } from "chess.js";
import type { GlassMaterialConfig } from "@/lib/chess/themes";
import { GlassMaterial } from "./materials/GlassMaterial";

interface PieceGeometryProps {
  material: GlassMaterialConfig;
  emissiveBoost?: number;
  glowColor?: string;
}

// Helper to create Vector2 array for Lathe profiles
const pts = (points: [number, number][]) =>
  points.map((p) => new THREE.Vector2(p[0], p[1]));

// --- PROFILES ---
const baseProfile = [
  [0, 0], [0.36, 0], [0.36, 0.05], [0.32, 0.1], [0.28, 0.15],
] as [number, number][];

const pawnProfile = pts([
  ...baseProfile,
  [0.2, 0.25], [0.16, 0.4], [0.14, 0.5],
  [0.22, 0.52], [0.22, 0.56], [0.12, 0.58],
  [0.22, 0.68], [0.2, 0.8], [0.1, 0.88], [0, 0.9],
]);

const rookProfile = pts([
  ...baseProfile,
  [0.26, 0.2], [0.24, 0.4], [0.22, 0.6], [0.24, 0.7],
  [0.32, 0.72], [0.32, 0.76], [0.28, 0.78],
  [0.28, 1.0], [0.2, 1.0], [0.2, 0.9], [0, 0.9],
]);

const bishopProfile = pts([
  ...baseProfile,
  [0.22, 0.25], [0.16, 0.5], [0.12, 0.7],
  [0.22, 0.72], [0.22, 0.76], [0.14, 0.78],
  [0.2, 0.9], [0.16, 1.05], [0.08, 1.15], [0, 1.2],
]);

const queenProfile = pts([
  ...baseProfile,
  [0.25, 0.2], [0.18, 0.5], [0.15, 0.8],
  [0.28, 0.82], [0.28, 0.86], [0.18, 0.88],
  [0.25, 1.0], [0.35, 1.2], [0.3, 1.25], [0, 1.05],
]);

const kingProfile = pts([
  ...baseProfile,
  [0.26, 0.2], [0.2, 0.5], [0.16, 0.8],
  [0.3, 0.82], [0.3, 0.86], [0.2, 0.88],
  [0.28, 1.0], [0.25, 1.15], [0.15, 1.25], [0, 1.3],
]);

// Knight uses a custom shape for the head
const knightBaseProfile = pts([
  ...baseProfile,
  [0.25, 0.25], [0.22, 0.4], [0.2, 0.5], [0, 0.5]
]);

function createKnightHeadShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0.1, 0.4);
  shape.lineTo(0.3, 0.6); // chest
  shape.lineTo(0.35, 0.8);
  shape.lineTo(0.25, 1.0); // nose
  shape.lineTo(0.15, 1.05);
  shape.lineTo(0.05, 0.95);
  shape.lineTo(-0.05, 1.15); // ears
  shape.lineTo(-0.15, 1.1);
  shape.lineTo(-0.15, 0.9);
  shape.lineTo(-0.3, 0.7); // back of head
  shape.lineTo(-0.25, 0.4);
  shape.lineTo(0.1, 0.4);
  return shape;
}

// --- COMPONENTS ---

function PieceCore({ color, height = 0.5 }: { color: string; height?: number }) {
  return (
    <mesh position={[0, height, 0]}>
      <sphereGeometry args={[0.04, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

function GlassMesh({
  material,
  variant = "base",
  emissiveBoost,
  children,
  ...meshProps
}: PieceGeometryProps & {
  variant?: "base" | "accent";
  children: React.ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
}) {
  return (
    <mesh {...meshProps} castShadow>
      {children}
      <GlassMaterial
        config={material}
        variant={variant}
        emissiveBoost={emissiveBoost}
      />
    </mesh>
  );
}

function PawnGeometry({ material, emissiveBoost = 1, glowColor = "#38bdf8" }: PieceGeometryProps) {
  return (
    <group>
      <GlassMesh material={material} emissiveBoost={emissiveBoost}>
        <latheGeometry args={[pawnProfile, 32]} />
      </GlassMesh>
      <PieceCore color={glowColor} height={0.5} />
    </group>
  );
}

function RookGeometry({ material, emissiveBoost = 1, glowColor = "#38bdf8" }: PieceGeometryProps) {
  return (
    <group>
      <GlassMesh material={material} emissiveBoost={emissiveBoost}>
        <latheGeometry args={[rookProfile, 32]} />
      </GlassMesh>
      {/* Crenellations */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <GlassMesh
          key={i}
          material={material}
          variant="accent"
          emissiveBoost={emissiveBoost * 1.5}
          position={[Math.cos(angle) * 0.22, 1.05, Math.sin(angle) * 0.22]}
          rotation={[0, -angle, 0]}
        >
          <boxGeometry args={[0.15, 0.1, 0.1]} />
        </GlassMesh>
      ))}
      <PieceCore color={glowColor} height={0.6} />
    </group>
  );
}

function KnightGeometry({ material, emissiveBoost = 1, glowColor = "#38bdf8" }: PieceGeometryProps) {
  const headShape = useMemo(() => createKnightHeadShape(), []);
  const extrudeSettings = { depth: 0.16, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.04, bevelThickness: 0.04 };

  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      <GlassMesh material={material} emissiveBoost={emissiveBoost}>
        <latheGeometry args={[knightBaseProfile, 32]} />
      </GlassMesh>
      <GlassMesh material={material} variant="accent" emissiveBoost={emissiveBoost * 1.2} position={[0, 0, -0.08]}>
        <extrudeGeometry args={[headShape, extrudeSettings]} />
      </GlassMesh>
      <PieceCore color={glowColor} height={0.7} />
    </group>
  );
}

function BishopGeometry({ material, emissiveBoost = 1, glowColor = "#38bdf8" }: PieceGeometryProps) {
  return (
    <group>
      <GlassMesh material={material} emissiveBoost={emissiveBoost}>
        <latheGeometry args={[bishopProfile, 32]} />
      </GlassMesh>
      {/* Bishop's miter cut */}
      <GlassMesh
        material={material}
        variant="accent"
        emissiveBoost={emissiveBoost * 1.2}
        position={[0.1, 1.0, 0]}
        rotation={[0, 0, Math.PI / 4]}
      >
        <boxGeometry args={[0.04, 0.3, 0.2]} />
      </GlassMesh>
      <GlassMesh material={material} variant="accent" emissiveBoost={emissiveBoost * 1.5} position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
      </GlassMesh>
      <PieceCore color={glowColor} height={0.7} />
    </group>
  );
}

function QueenGeometry({ material, emissiveBoost = 1, glowColor = "#38bdf8" }: PieceGeometryProps) {
  return (
    <group>
      <GlassMesh material={material} emissiveBoost={emissiveBoost}>
        <latheGeometry args={[queenProfile, 32]} />
      </GlassMesh>
      {/* Crown tips */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <GlassMesh
            key={i}
            material={material}
            variant="accent"
            emissiveBoost={emissiveBoost * 1.8}
            position={[Math.cos(angle) * 0.28, 1.25, Math.sin(angle) * 0.28]}
          >
            <sphereGeometry args={[0.04, 12, 12]} />
          </GlassMesh>
        );
      })}
      <PieceCore color={glowColor} height={0.8} />
    </group>
  );
}

function KingGeometry({ material, emissiveBoost = 1, glowColor = "#38bdf8" }: PieceGeometryProps) {
  return (
    <group>
      <GlassMesh material={material} emissiveBoost={emissiveBoost}>
        <latheGeometry args={[kingProfile, 32]} />
      </GlassMesh>
      {/* Cross */}
      <GlassMesh material={material} variant="accent" emissiveBoost={emissiveBoost * 1.8} position={[0, 1.4, 0]}>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
      </GlassMesh>
      <GlassMesh material={material} variant="accent" emissiveBoost={emissiveBoost * 1.8} position={[0, 1.42, 0]}>
        <boxGeometry args={[0.2, 0.08, 0.08]} />
      </GlassMesh>
      <PieceCore color={glowColor} height={0.85} />
    </group>
  );
}

const GEOMETRIES: Record<PieceSymbol, React.ComponentType<PieceGeometryProps>> = {
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