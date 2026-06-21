"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { squareToPosition } from "@/lib/chess/coordinates";
import type { GuideHighlight } from "@/lib/chess/types";

interface GuideArrowProps {
  highlight: GuideHighlight;
  color: string;
}

export function GuideArrow({ highlight, color }: GuideArrowProps) {
  const points = useMemo(() => {
    const [fx, , fz] = squareToPosition(highlight.from);
    const [tx, , tz] = squareToPosition(highlight.to);
    return [
      [fx, 0.2, fz],
      [tx, 0.25, tz],
    ] as [number, number, number][];
  }, [highlight.from, highlight.to]);

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={2.5}
        transparent
        opacity={0.9}
      />
      <mesh position={points[1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}