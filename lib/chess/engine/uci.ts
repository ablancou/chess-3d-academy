import { Chess, type PieceSymbol, type Square } from "chess.js";

export interface UciMoveInfo {
  san: string;
  from: Square;
  to: Square;
}

/**
 * Convierte una jugada UCI (ej. "e2e4", "e7e8q") a SAN en la posición dada.
 * Devuelve null si la jugada no es legal en esa posición.
 */
export function uciToMoveInfo(fen: string, uci: string): UciMoveInfo | null {
  if (!uci || uci.length < 4) return null;
  const from = uci.slice(0, 2) as Square;
  const to = uci.slice(2, 4) as Square;
  const promotion = (uci[4] as PieceSymbol | undefined) ?? undefined;

  try {
    const chess = new Chess(fen);
    const move = chess.move({ from, to, promotion });
    if (!move) return null;
    return { san: move.san, from, to };
  } catch {
    return null;
  }
}
