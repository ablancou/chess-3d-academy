"use client";

import { useState } from "react";
import type { Square } from "chess.js";
import { Edges } from "@react-three/drei";
import { squareToPosition } from "@/lib/chess/coordinates";
import type { BoardThemeConfig } from "@/lib/chess/themes";
import { useGameStore } from "@/stores/game-store";
import { PulsingRing } from "./effects/PulsingRing";
import { InteractionPlane } from "./InteractionPlane";
import { GlassMaterial } from "./materials/GlassMaterial";

interface BoardSquareProps {
  square: Square;
  isLight: boolean;
  isSelected: boolean;
  isLegalTarget: boolean;
  isLastMove: boolean;
  isGuideTarget: boolean;
  theme: BoardThemeConfig;
}

export function BoardSquare({
  square,
  isLight,
  isSelected,
  isLegalTarget,
  isLastMove,
  isGuideTarget,
  theme,
}: BoardSquareProps) {
  const [hovered, setHovered] = useState(false);
  const selectSquare = useGameStore((s) => s.selectSquare);
  const [x, , z] = squareToPosition(square);

  const baseGlass = isLight ? theme.lightGlass : theme.darkGlass;
  const emissiveBoost =
    isSelected ? 1.8 : isLastMove ? 1.4 : hovered && isLegalTarget ? 1.5 : 1;

  let overlayColor: string | null = null;
  let overlayOpacity = 0.28;
  if (isLastMove) overlayColor = theme.lastMove;
  if (isSelected) {
    overlayColor = theme.selected;
    overlayOpacity = 0.42;
  }
  if (isGuideTarget) overlayColor = "#fbbf24";
  if (hovered && isLegalTarget) overlayColor = theme.legalMove;

  return (
    <group position={[x, 0, z]}>
      <mesh receiveShadow castShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[0.9, 0.06, 0.9]} />
        <GlassMaterial config={baseGlass} emissiveBoost={emissiveBoost} />
        <Edges
          color={theme.gridGlow}
          threshold={12}
        />
      </mesh>

      {/* Specular cap */}
      <mesh position={[0, 0.062, 0]}>
        <boxGeometry args={[0.86, 0.004, 0.86]} />
        <meshPhysicalMaterial
          color={isLight ? "#f8fafc" : theme.gridGlow}
          metalness={0.35}
          roughness={0.01}
          transparent
          opacity={isLight ? 0.2 : 0.12}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>

      {overlayColor && (
        <mesh position={[0, 0.064, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.82, 0.82]} />
          <meshBasicMaterial
            color={overlayColor}
            transparent
            opacity={overlayOpacity}
          />
        </mesh>
      )}

      {isGuideTarget && (
        <mesh position={[0, 0.068, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.28, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
        </mesh>
      )}

      {isLegalTarget && <PulsingRing color={theme.legalMove} />}

      {isLastMove && (
        <mesh position={[0, 0.069, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.42, 48]} />
          <meshBasicMaterial
            color={theme.lastMove}
            transparent
            opacity={0.5}
            depthWrite={false}
          />
        </mesh>
      )}

      <InteractionPlane
        size={0.9}
        height={0.08}
        onInteract={() => selectSquare(square)}
        onHover={(h) => {
          setHovered(h);
          if (h && isLegalTarget) document.body.style.cursor = "pointer";
          else if (!h) document.body.style.cursor = "auto";
        }}
      />
    </group>
  );
}