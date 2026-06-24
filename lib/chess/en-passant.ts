import type { Square } from "chess.js";
import type { LastMove } from "./types";

/** Square where the captured pawn sits during an en passant take. */
export function getEnPassantCaptureSquare(lastMove: LastMove): Square | null {
  if (!lastMove.isEnPassant) return null;
  const toFile = lastMove.to[0];
  const fromRank = lastMove.from[1];
  return `${toFile}${fromRank}` as Square;
}