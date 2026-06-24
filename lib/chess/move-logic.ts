import { Chess, type Color, type Move, type PieceSymbol, type Square } from "chess.js";
import type { GameStatus } from "./types";

export interface MoveAttempt {
  ok: boolean;
  san?: string;
  move?: Move;
  needsPromotion?: boolean;
}

export function findVerboseMove(chess: Chess, from: Square, to: Square) {
  return chess
    .moves({ square: from, verbose: true })
    .find((m) => m.to === to);
}

export function isPromotionTarget(chess: Chess, from: Square, to: Square): boolean {
  const target = findVerboseMove(chess, from, to);
  return Boolean(target?.promotion);
}

export function tryMoveWithPromotion(
  chess: Chess,
  from: Square,
  to: Square,
  promotion?: PieceSymbol,
): MoveAttempt {
  const target = findVerboseMove(chess, from, to);
  if (!target) return { ok: false };

  if (target.promotion && !promotion) {
    return { ok: false, needsPromotion: true };
  }

  const move = chess.move({
    from,
    to,
    promotion: target.promotion ? promotion ?? "q" : undefined,
  });

  if (!move) return { ok: false };
  return { ok: true, san: move.san, move };
}

export function isCastlingMove(move: Move): boolean {
  return move.flags.includes("k") || move.flags.includes("q");
}

export function isEnPassantMove(move: Move): boolean {
  return move.flags.includes("e");
}

export function findKingSquare(chess: Chess, color: Color): Square | null {
  const board = chess.board();
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (piece?.type === "k" && piece.color === color) {
        return `${"abcdefgh"[file]}${8 - rank}` as Square;
      }
    }
  }
  return null;
}

export function buildLastMoveFromVerbose(move: Move) {
  return {
    from: move.from as Square,
    to: move.to as Square,
    san: move.san,
    flags: move.flags,
    isCastling: isCastlingMove(move),
    isEnPassant: isEnPassantMove(move),
    isPromotion: move.flags.includes("p"),
    captured: Boolean(move.captured),
  };
}

export function getGameStatusFromChess(chess: Chess): GameStatus {
  if (chess.isCheckmate()) return "checkmate";
  if (chess.isStalemate()) return "stalemate";
  if (chess.isDraw()) return "draw";
  if (chess.isCheck()) return "check";
  return "playing";
}