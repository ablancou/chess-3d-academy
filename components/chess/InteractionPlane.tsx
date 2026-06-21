"use client";

import type { ThreeEvent } from "@react-three/fiber";

interface InteractionPlaneProps {
  onInteract: (e: ThreeEvent<MouseEvent>) => void;
  onHover?: (hovered: boolean) => void;
  size?: number;
  height?: number;
}

/** Invisible mesh that reliably receives pointer events (glass materials often don't). */
export function InteractionPlane({
  onInteract,
  onHover,
  size = 0.88,
  height = 0.15,
}: InteractionPlaneProps) {
  return (
    <mesh
      position={[0, height, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onInteract(e);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover?.(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover?.(false);
      }}
    >
      <boxGeometry args={[size, 0.01, size]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

export function PieceHitBox({
  onSelect,
}: {
  onSelect: (e: ThreeEvent<MouseEvent>) => void;
}) {
  return (
    <mesh
      onClick={(e) => {
        e.stopPropagation();
        onSelect(e);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "auto";
      }}
    >
      <cylinderGeometry args={[0.42, 0.44, 1.15, 16]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}