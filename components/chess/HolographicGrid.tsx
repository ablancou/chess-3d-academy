"use client";

import { useRef } from "react";
import { Grid } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

interface HolographicGridProps {
  color: string;
}

export function HolographicGrid({ color }: HolographicGridProps) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y =
      -0.48 + Math.sin(clock.elapsedTime * 0.6) * 0.025;
  });

  return (
    <group ref={groupRef} position={[0, -0.48, 0]}>
      <Grid
        args={[40, 40]}
        cellSize={0.45}
        cellThickness={0.6}
        cellColor={color}
        sectionSize={2.25}
        sectionThickness={1.2}
        sectionColor={color}
        fadeDistance={28}
        fadeStrength={1.4}
        followCamera={false}
        infiniteGrid
      />
    </group>
  );
}