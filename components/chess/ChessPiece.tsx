"use client";

import { useRef, useState } from "react";
import type { Color, PieceSymbol, Square } from "chess.js";
import type { Group } from "three";
import { usePieceAnimation } from "@/hooks/use-piece-animation";
import type { PieceThemeConfig } from "@/lib/chess/themes";
import { useGameStore } from "@/stores/game-store";
import { PieceAura } from "./effects/PieceAura";
import { SimplePieceTrail } from "./effects/SimplePieceTrail";
import { PieceHitBox } from "./InteractionPlane";
import { PieceGeometry } from "./piece-geometries";

interface ChessPieceProps {
  square: Square;
  color: Color;
  type: PieceSymbol;
  isSelected: boolean;
  isGuideFrom: boolean;
  pieceTheme: PieceThemeConfig;
}

export function ChessPiece({
  square,
  color,
  type,
  isSelected,
  isGuideFrom,
  pieceTheme,
}: ChessPieceProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const selectSquare = useGameStore((s) => s.selectSquare);
  const lastMove = useGameStore((s) => s.lastMove);

  const material = color === "w" ? pieceTheme.white : pieceTheme.black;
  const lift = isSelected ? 0.22 : hovered ? 0.12 : 0;
  const emissiveBoost = isSelected ? 1.5 : hovered ? 1.15 : 1;

  const { isMoving, trailPoints } = usePieceAnimation({
    groupRef,
    square,
    pieceType: type,
    lastMove,
    lift,
  });

  const handleSelect = () => {
    selectSquare(square);
  };

  return (
    <group ref={groupRef}>
      <PieceHitBox onSelect={handleSelect} />

      <SimplePieceTrail
        trailRef={trailPoints}
        isMovingRef={isMoving}
        color={pieceTheme.selectionRing}
      />

      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <PieceGeometry
          type={type}
          material={material}
          emissiveBoost={emissiveBoost}
          glowColor={pieceTheme.selectionRing}
        />

        <PieceAura
          color={pieceTheme.selectionRing}
          active={isSelected || hovered}
          intensity={isSelected ? "selected" : "hover"}
        />

        {isGuideFrom && !isSelected && (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.36, 0.42, 48]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.85} />
          </mesh>
        )}

        {isSelected && (
          <group position={[0, 0.02, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.36, 0.46, 48]} />
              <meshBasicMaterial
                color={pieceTheme.selectionRing}
                transparent
                opacity={0.85}
              />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.46, 0.52, 48]} />
              <meshBasicMaterial
                color={pieceTheme.selectionRing}
                transparent
                opacity={0.4}
              />
            </mesh>
          </group>
        )}

        {(isSelected || hovered) && (
          <pointLight
            position={[0, 0.6, 0]}
            color={pieceTheme.selectionRing}
            intensity={isSelected ? 1.0 : 0.4}
            distance={2.5}
          />
        )}
      </group>
    </group>
  );
}