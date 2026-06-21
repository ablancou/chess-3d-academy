import type { Square } from "chess.js";
import type { Camera } from "three";
import { Plane, Raycaster, Vector2, Vector3 } from "three";
import { BOARD_HALF, indexToSquare } from "./coordinates";

/** Project a screen-normalized pointer onto the board plane (y = 0). */
export function pointerToBoardSquare(
  nx: number,
  ny: number,
  camera: Camera,
): Square | null {
  const raycaster = new Raycaster();
  raycaster.setFromCamera(new Vector2(nx, ny), camera);

  const plane = new Plane(new Vector3(0, 1, 0), 0);
  const intersection = new Vector3();
  const hit = raycaster.ray.intersectPlane(plane, intersection);
  if (!hit) return null;

  const file = Math.round(intersection.x + BOARD_HALF - 0.5);
  const rank = Math.round(intersection.z + BOARD_HALF - 0.5);

  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;

  return indexToSquare(file, rank);
}

/** Get board-world XZ from pointer (for drag follow). */
export function pointerToBoardPosition(
  nx: number,
  ny: number,
  camera: Camera,
): { x: number; z: number } | null {
  const raycaster = new Raycaster();
  raycaster.setFromCamera(new Vector2(nx, ny), camera);

  const plane = new Plane(new Vector3(0, 1, 0), 0);
  const intersection = new Vector3();
  const hit = raycaster.ray.intersectPlane(plane, intersection);
  if (!hit) return null;

  return { x: intersection.x, z: intersection.z };
}