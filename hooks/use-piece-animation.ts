"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Vector3 } from "three";
import type { Square } from "chess.js";
import { squareToPosition } from "@/lib/chess/coordinates";
import type { LastMove } from "@/lib/chess/types";

interface UsePieceAnimationOptions {
  groupRef: React.RefObject<Group | null>;
  square: Square;
  lastMove: LastMove | null;
  lift: number;
}

export function usePieceAnimation({
  groupRef,
  square,
  lastMove,
  lift,
}: UsePieceAnimationOptions) {
  const position = useRef(new Vector3());
  const initialized = useRef(false);

  const [targetX, , targetZ] = squareToPosition(square);

  useLayoutEffect(() => {
    if (!initialized.current) {
      const [x, , z] = squareToPosition(square);
      position.current.set(x, lift, z);
      initialized.current = true;
      return;
    }

    if (lastMove?.to === square) {
      const [fromX, , fromZ] = squareToPosition(lastMove.from);
      position.current.set(fromX, lift, fromZ);
    }
  }, [square, lastMove, lift]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const target = new Vector3(targetX, lift, targetZ);
    position.current.lerp(target, 1 - Math.exp(-14 * delta));
    group.position.copy(position.current);
  });
}