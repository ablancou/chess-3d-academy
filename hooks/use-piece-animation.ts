"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Vector3 } from "three";
import type { Square } from "chess.js";
import { resolvePieceStartPosition } from "@/lib/chess/piece-animation-math";
import { squareToPosition } from "@/lib/chess/coordinates";
import type { LastMove } from "@/lib/chess/types";

const TRAIL_MAX = 18;
const ARRIVE_THRESHOLD = 0.02;
const STILL_FRAMES_TO_STOP = 8;

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
  const target = useRef(new Vector3());
  const trailPoints = useRef<Vector3[]>([]);
  const isMoving = useRef(false);
  const stillFrames = useRef(0);
  const lastProcessedMove = useRef<string | null>(null);

  const [targetX, , targetZ] = squareToPosition(square);

  useLayoutEffect(() => {
    const resolved = resolvePieceStartPosition(
      square,
      lastMove,
      lift,
      lastProcessedMove.current,
    );

    target.current.set(targetX, lift, targetZ);
    position.current.set(resolved.x, resolved.y, resolved.z);

    if (resolved.shouldAnimate && resolved.moveKey) {
      trailPoints.current = [position.current.clone()];
      isMoving.current = true;
      stillFrames.current = 0;
      lastProcessedMove.current = resolved.moveKey;
    } else if (!isMoving.current) {
      trailPoints.current = [];
    }
  }, [square, lastMove, lift, targetX, targetZ]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    target.current.set(targetX, lift, targetZ);
    position.current.lerp(target.current, 1 - Math.exp(-14 * delta));
    group.position.copy(position.current);

    const dist = position.current.distanceTo(target.current);
    if (dist > ARRIVE_THRESHOLD) {
      isMoving.current = true;
      stillFrames.current = 0;
      const pts = trailPoints.current;
      const last = pts[pts.length - 1];
      if (!last || last.distanceTo(position.current) > 0.008) {
        pts.push(position.current.clone());
        if (pts.length > TRAIL_MAX) pts.shift();
      }
    } else {
      stillFrames.current++;
      if (stillFrames.current > STILL_FRAMES_TO_STOP && isMoving.current) {
        isMoving.current = false;
        trailPoints.current = [];
      }
    }
  });

  return { isMoving, trailPoints };
}