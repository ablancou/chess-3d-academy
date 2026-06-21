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

/** Convert a chess square to a 3D position on the board surface. */
export function squareToPosition(square: Square): [number, number, number] {
  const file = squareToFileIndex(square);
  const rank = squareToRankIndex(square);
  const x = file - BOARD_HALF + SQUARE_SIZE / 2;
  const z = rank - BOARD_HALF + SQUARE_SIZE / 2;
  return [x, 0, z];
}

export function isLightSquare(file: number, rank: number): boolean {
  return (file + rank) % 2 === 0;
}

export function indexToSquare(file: number, rank: number): Square {
  return `${FILES[file]}${rank + 1}` as Square;
}