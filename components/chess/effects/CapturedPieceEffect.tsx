"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { PieceSymbol, Square } from "chess.js";
import type { Group } from "three";
import { squareToPosition } from "@/lib/chess/coordinates";
import { buildCapturedSnapshot } from "@/lib/chess/piece-animation-math";
import type { GlassMaterialConfig } from "@/lib/chess/themes";
import { getThemeById } from "@/lib/chess/themes";
import { useThemeStore } from "@/stores/theme-store";
import type { LastMove } from "@/lib/chess/types";
import { PieceGeometry } from "../piece-geometries";

const CAPTURE_DURATION = 0.55;

interface CapturedPieceEffectProps {
  lastMove: LastMove | null;
  moveTimestamp: number;
}

export function CapturedPieceEffect({
  lastMove,
  moveTimestamp,
}: CapturedPieceEffectProps) {
  const themeId = useThemeStore((s) => s.themeId);
  const theme = getThemeById(themeId);

  const snapshot =
    lastMove && moveTimestamp > 0
      ? buildCapturedSnapshot(lastMove)
      : null;

  if (!snapshot) return null;

  const material =
    snapshot.color === "w" ? theme.pieces.white : theme.pieces.black;

  return (
    <CapturedPieceBurst
      key={`${snapshot.moveKey}-${moveTimestamp}`}
      square={snapshot.square}
      type={snapshot.type}
      material={material}
    />
  );
}

function CapturedPieceBurst({
  square,
  type,
  material,
}: {
  square: Square;
  type: PieceSymbol;
  material: GlassMaterialConfig;
}) {
  const groupRef = useRef<Group>(null);
  const bornAt = useRef<number | null>(null);
  const [x, , z] = squareToPosition(square);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    if (bornAt.current === null) bornAt.current = clock.elapsedTime;

    const elapsed = clock.elapsedTime - bornAt.current;
    const progress = Math.min(1, elapsed / CAPTURE_DURATION);
    const fade = 1 - progress ** 1.4;

    group.position.set(x, 0.05 + progress * 0.35, z);
    group.rotation.y = progress * Math.PI * 0.5;
    group.scale.setScalar(1 - progress * 0.35);
    group.visible = progress < 1;

    group.traverse((child) => {
      const mesh = child as { material?: { opacity?: number; transparent?: boolean } };
      if (mesh.material && "opacity" in mesh.material) {
        mesh.material.transparent = true;
        mesh.material.opacity = fade * 0.85;
      }
    });
  });

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      <PieceGeometry
        type={type}
        material={material}
        emissiveBoost={0.6}
        glowColor="#ef4444"
      />
    </group>
  );
}
