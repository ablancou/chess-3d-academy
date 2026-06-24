import type { Square } from "chess.js";
import { squareToPosition } from "./coordinates";
import type { LastMove } from "./types";

export interface PieceStartPosition {
  x: number;
  y: number;
  z: number;
  shouldAnimate: boolean;
  moveKey: string | null;
}

export function resolvePieceStartPosition(
  square: Square,
  lastMove: LastMove | null,
  lift: number,
  lastProcessedMove: string | null,
): PieceStartPosition {
  const [targetX, , targetZ] = squareToPosition(square);
  const moveKey = lastMove ? `${lastMove.from}-${lastMove.to}` : null;

  if (
    lastMove?.to === square &&
    moveKey &&
    moveKey !== lastProcessedMove
  ) {
    const [fromX, , fromZ] = squareToPosition(lastMove.from);
    return {
      x: fromX,
      y: lift,
      z: fromZ,
      shouldAnimate: true,
      moveKey,
    };
  }

  return {
    x: targetX,
    y: lift,
    z: targetZ,
    shouldAnimate: false,
    moveKey: lastProcessedMove,
  };
}