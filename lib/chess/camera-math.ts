import type { Square } from "chess.js";
import { squareToPosition } from "./coordinates";

export type Vec3 = [number, number, number];

export interface CameraPose {
  position: Vec3;
  target: Vec3;
}

export function squareFocusTarget(square: Square): Vec3 {
  const [x, , z] = squareToPosition(square);
  return [x, 0, z];
}

/** Dramatic close-up pose framing a square after a move. */
export function dramaticMovePose(square: Square, distance = 9): CameraPose {
  const [tx, , tz] = squareToPosition(square);
  const angle = Math.atan2(tz, tx) + Math.PI / 5;
  return {
    position: [
      tx + Math.sin(angle) * distance * 0.35,
      7.5,
      tz - Math.cos(angle) * distance * 0.55,
    ],
    target: [tx, 0.2, tz],
  };
}

/** Wide orbit pose for spectacular idle / board showcase. */
export function spectacularOrbitPose(elapsed: number, radius = 14): CameraPose {
  const a = elapsed * 0.12;
  return {
    position: [Math.sin(a) * radius * 0.55, 12, -Math.cos(a) * radius * 0.65],
    target: [0, 0, 0],
  };
}

/** Tight pose on the checked king's square. */
export function checkCloseUpPose(kingSquare: Square): CameraPose {
  const [tx, , tz] = squareToPosition(kingSquare);
  return {
    position: [tx + 2.5, 6, tz - 5],
    target: [tx, 0.5, tz],
  };
}

export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  const s = Math.max(0, Math.min(1, t));
  return [
    a[0] + (b[0] - a[0]) * s,
    a[1] + (b[1] - a[1]) * s,
    a[2] + (b[2] - a[2]) * s,
  ];
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}