import type { Color, PieceSymbol, Square } from "chess.js";

export type { Color, PieceSymbol, Square };

export interface BoardPiece {
  square: Square;
  color: Color;
  type: PieceSymbol;
}

export interface LastMove {
  from: Square;
  to: Square;
  san?: string;
  flags?: string;
  isCastling?: boolean;
  isEnPassant?: boolean;
  isPromotion?: boolean;
  captured?: boolean;
}

export interface PromotionPending {
  from: Square;
  to: Square;
}

export type GameStatus =
  | "playing"
  | "check"
  | "checkmate"
  | "stalemate"
  | "draw";

export interface GuideHighlight {
  from: Square;
  to: Square;
}