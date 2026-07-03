"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { Vector3 } from "three";
import type { PieceSymbol, Square } from "chess.js";
import {
  computeMoveAnimationProfile,
  resolvePieceStartPosition,
  sampleMovePosition,
} from "@/lib/chess/piece-animation-math";
import { squareToPosition } from "@/lib/chess/coordinates";
import type { LastMove } from "@/lib/chess/types";

const TRAIL_MAX = 22;
const ARRIVE_THRESHOLD = 0.015;

interface UsePieceAnimationOptions {
  groupRef: React.RefObject<Group | null>;
  square: Square;
  pieceType: PieceSymbol;
  lastMove: LastMove | null;
  lift: number;
}

export function usePieceAnimation({
  groupRef,
  square,
  pieceType,
  lastMove,
  lift,
}: UsePieceAnimationOptions) {
  const trailPoints = useRef<Vector3[]>([]);
  const isMoving = useRef(false);
  const lastProcessedMove = useRef<string | null>(null);

  const animFrom = useRef({ x: 0, z: 0 });
  const animTo = useRef({ x: 0, z: 0 });
  const animStartTime = useRef<number | null>(null);
  const animDuration = useRef(0.4);
  const animProfile = useRef(
    computeMoveAnimationProfile(
      { from: "a1", to: "a2", captured: false } as LastMove,
      pieceType,
    ),
  );
  const activeAnim = useRef(false);

  const [targetX, , targetZ] = squareToPosition(square);

  useLayoutEffect(() => {
    const resolved = resolvePieceStartPosition(
      square,
      lastMove,
      lift,
      lastProcessedMove.current,
    );

    if (resolved.shouldAnimate && lastMove && resolved.moveKey) {
      animFrom.current = { x: resolved.x, z: resolved.z };
      animTo.current = { x: targetX, z: targetZ };
      animProfile.current = computeMoveAnimationProfile(lastMove, pieceType);
      animDuration.current = animProfile.current.duration;
      animStartTime.current = null;
      activeAnim.current = true;
      isMoving.current = true;
      trailPoints.current = [
        new Vector3(resolved.x, lift, resolved.z),
      ];
      lastProcessedMove.current = resolved.moveKey;
    } else if (!activeAnim.current) {
      trailPoints.current = [];
    }
  }, [square, lastMove, lift, targetX, targetZ, pieceType]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    if (activeAnim.current && lastMove) {
      if (animStartTime.current === null) {
        animStartTime.current = state.clock.elapsedTime;
      }

      const elapsed = state.clock.elapsedTime - animStartTime.current;
      const rawProgress = Math.min(1, elapsed / animDuration.current);

      const sample = sampleMovePosition(
        animFrom.current,
        animTo.current,
        rawProgress,
        animProfile.current,
        lift,
      );

      group.position.set(sample.x, sample.y, sample.z);
      group.rotation.y = sample.rotationY;
      group.scale.set(1, sample.scaleY, 1);

      isMoving.current = true;
      const pts = trailPoints.current;
      const last = pts[pts.length - 1];
      const pos = group.position;
      if (!last || last.distanceTo(pos) > 0.012) {
        pts.push(pos.clone());
        if (pts.length > TRAIL_MAX) pts.shift();
      }

      if (rawProgress >= 1) {
        activeAnim.current = false;
        animStartTime.current = null;
        group.position.set(targetX, lift, targetZ);
        group.rotation.y = 0;
        group.scale.set(1, 1, 1);
      }
      return;
    }

    const targetY = lift;
    group.position.x += (targetX - group.position.x) * 0.22;
    group.position.y += (targetY - group.position.y) * 0.22;
    group.position.z += (targetZ - group.position.z) * 0.22;
    group.rotation.y *= 0.82;
    group.scale.y += (1 - group.scale.y) * 0.18;

    const dist = group.position.distanceTo(
      new Vector3(targetX, targetY, targetZ),
    );
    if (dist < ARRIVE_THRESHOLD) {
      group.position.set(targetX, targetY, targetZ);
      if (!isMoving.current) trailPoints.current = [];
      else {
        isMoving.current = false;
        trailPoints.current = [];
      }
    }
  });

  return { isMoving, trailPoints };
}
