import type { Square } from "chess.js";

const FILES = "abcdefgh";

/** Half-extent of the board in world units (8 squares × 1 unit each). */
export const BOARD_HALF = 4;

/** Height of a single square. */
export const SQUARE_SIZE = 1;

export function squareToFileIndex(square: Square): number {
  return FILES.indexOf(square[0]);
}

export function squareToRankIndex(square: Square): number {
  return parseInt(square[1], 10) - 1;
}

export function squareToPosition(square: Square): [number, number, number] {
  const file = squareToFileIndex(square);
  const rank = squareToRankIndex(square);
  // a=0 should be left (-X), h=7 should be right (+X)
  const x = file - BOARD_HALF + SQUARE_SIZE / 2;
  // rank 1=0 should be bottom (near, +Z), rank 8=7 should be top (far, -Z)
  const z = BOARD_HALF - SQUARE_SIZE / 2 - rank;
  return [x, 0, z];
}

export function isLightSquare(file: number, rank: number): boolean {
  return (file + rank) % 2 === 0;
}

export function indexToSquare(file: number, rank: number): Square {
  return `${FILES[file]}${rank + 1}` as Square;
}