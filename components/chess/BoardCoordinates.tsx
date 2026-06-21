"use client";

import { Text } from "@react-three/drei";
import { BOARD_HALF } from "@/lib/chess/coordinates";

const FILES = "abcdefgh";
const RANKS = "12345678";

export function BoardCoordinates({ color }: { color: string }) {
  const y = 0.07;
  const offset = BOARD_HALF - 0.12;

  return (
    <group>
      {FILES.split("").map((file, i) => (
        <Text
          key={`file-${file}`}
          position={[i - 3.5, y, -(offset + 0.3)]}
          fontSize={0.15}
          color={color}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.4}
          fontWeight={500}
        >
          {file}
        </Text>
      ))}

      {RANKS.split("").map((rank, i) => (
        <Text
          key={`rank-${rank}`}
          position={[-offset - 0.3, y, i - 3.5]}
          fontSize={0.15}
          color={color}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.4}
          fontWeight={500}
        >
          {rank}
        </Text>
      ))}
    </group>
  );
}