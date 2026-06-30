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
          position={[i - 3.5, y, offset + 0.3]} // +Z (near camera)
          rotation={[-Math.PI / 2, 0, 0]}
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
          position={[-offset - 0.3, y, 3.5 - i]} // z matched to new rank mapping
          rotation={[-Math.PI / 2, 0, 0]}
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