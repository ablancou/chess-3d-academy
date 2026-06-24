"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Vector3 } from "three";
import type { Square } from "chess.js";
import { squareToPosition } from "@/lib/chess/coordinates";
import type { LastMove } from "@/lib/chess/types";

const TRAIL_MAX = 18;

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
  const trailPoints = useRef<Vector3[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const stillFrames = useRef(0);

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
      trailPoints.current = [position.current.clone()];
      setIsMoving(true);
      stillFrames.current = 0;
    }
  }, [square, lastMove, lift]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const target = new Vector3(targetX, lift, targetZ);
    position.current.lerp(target, 1 - Math.exp(-14 * delta));
    group.position.copy(position.current);

    const dist = position.current.distanceTo(target);
    if (dist > 0.02) {
      setIsMoving(true);
      stillFrames.current = 0;
      trailPoints.current.push(position.current.clone());
      if (trailPoints.current.length > TRAIL_MAX) {
        trailPoints.current.shift();
      }
    } else {
      stillFrames.current++;
      if (stillFrames.current > 8 && isMoving) {
        setIsMoving(false);
      }
    }
  });

  return { isMoving, trailPoints };
}