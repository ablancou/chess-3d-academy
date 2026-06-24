"use client";

import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import type { Mesh } from "three";
import { squareToPosition } from "@/lib/chess/coordinates";
import type { GuideHighlight } from "@/lib/chess/types";

interface GuideArrowProps {
  highlight: GuideHighlight;
  color: string;
}

export function GuideArrow({ highlight, color }: GuideArrowProps) {
  const targetRef = useRef<Mesh>(null);

  const points = useMemo(() => {
    const [fx, , fz] = squareToPosition(highlight.from);
    const [tx, , tz] = squareToPosition(highlight.to);
    return [
      [fx, 0.2, fz],
      [tx, 0.25, tz],
    ] as [number, number, number][];
  }, [highlight.from, highlight.to]);

  useFrame(({ clock }) => {
    if (!targetRef.current) return;
    const pulse = 0.7 + Math.sin(clock.elapsedTime * 5) * 0.3;
    targetRef.current.scale.setScalar(pulse);
    const mat = targetRef.current.material as { opacity: number };
    mat.opacity = 0.6 + Math.sin(clock.elapsedTime * 5) * 0.25;
  });

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={3}
        transparent
        opacity={0.95}
      />
      <mesh ref={targetRef} position={points[1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.85}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}