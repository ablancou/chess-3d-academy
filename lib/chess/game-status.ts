import type { Chess } from "chess.js";
import type { GameStatus } from "./types";

export function getGameStatus(chess: Chess): GameStatus {
  if (chess.isCheckmate()) return "checkmate";
  if (chess.isStalemate()) return "stalemate";
  if (chess.isDraw()) return "draw";
  if (chess.isCheck()) return "check";
  return "playing";
}

export function getStatusLabel(status: GameStatus): string {
  switch (status) {
    case "checkmate":
      return "Checkmate";
    case "stalemate":
      return "Stalemate";
    case "draw":
      return "Draw";
    case "check":
      return "Check";
    default:
      return "In progress";
  }
}