import type { Color, PieceSymbol, Square } from "chess.js";
import { squareToPosition } from "./coordinates";
import type { LastMove } from "./types";

export interface PieceStartPosition {
  x: number;
  y: number;
  z: number;
  shouldAnimate: boolean;
  moveKey: string | null;
}

export type MoveKind = "slide" | "jump" | "castling";

export interface MoveAnimationProfile {
  moveKind: MoveKind;
  /** Duración total en segundos */
  duration: number;
  /** Altura máxima del arco en unidades del mundo */
  arcHeight: number;
  /** Rotación Y durante el vuelo (radianes) */
  rotationDelta: number;
}

export interface MoveSample {
  x: number;
  y: number;
  z: number;
  scaleY: number;
  rotationY: number;
}

export function easeOutCubic(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return 1 - (1 - c) ** 3;
}

export function easeInOutQuad(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c < 0.5 ? 2 * c * c : 1 - (-2 * c + 2) ** 2 / 2;
}

export function moveDistance(from: Square, to: Square): number {
  const [fx, , fz] = squareToPosition(from);
  const [tx, , tz] = squareToPosition(to);
  return Math.hypot(tx - fx, tz - fz);
}

export function resolvePieceStartPosition(
  square: Square,
  lastMove: LastMove | null,
  lift: number,
  lastProcessedMove: string | null,
): PieceStartPosition {
  const [targetX, , targetZ] = squareToPosition(square);
  const moveKey = lastMove ? `${lastMove.from}-${lastMove.to}` : null;

  if (lastMove?.to === square && moveKey && moveKey !== lastProcessedMove) {
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

/** Perfil cinemático según tipo de pieza y naturaleza del movimiento. */
export function computeMoveAnimationProfile(
  lastMove: LastMove,
  pieceType: PieceSymbol,
): MoveAnimationProfile {
  const dist = moveDistance(lastMove.from, lastMove.to);

  let moveKind: MoveKind = "slide";
  let arcHeight = 0.06 + dist * 0.035;
  let duration = 0.3 + dist * 0.07;
  let rotationDelta = 0;

  if (pieceType === "n") {
    moveKind = "jump";
    arcHeight = 0.48 + dist * 0.1;
    duration = 0.38 + dist * 0.055;
    rotationDelta = 0.22;
  } else if (lastMove.isCastling) {
    moveKind = "castling";
    arcHeight = 0.04;
    duration = 0.48;
  } else if (pieceType === "p") {
    arcHeight = 0.1 + dist * 0.02;
    duration = 0.28 + dist * 0.045;
  } else if (pieceType === "b" || pieceType === "q") {
    arcHeight = 0.12 + dist * 0.025;
    duration = 0.32 + dist * 0.065;
  } else if (pieceType === "r") {
    arcHeight = 0.08 + dist * 0.02;
    duration = 0.3 + dist * 0.06;
  } else if (pieceType === "k") {
    arcHeight = 0.07;
    duration = 0.34;
  }

  if (lastMove.captured) {
    duration *= 0.88;
    arcHeight += 0.06;
    rotationDelta += 0.06;
  }

  return {
    moveKind,
    duration: Math.min(0.72, Math.max(0.26, duration)),
    arcHeight: Math.min(0.75, arcHeight),
    rotationDelta,
  };
}

/** Posición interpolada a lo largo del arco con aterrizaje suave. */
export function sampleMovePosition(
  from: { x: number; z: number },
  to: { x: number; z: number },
  rawProgress: number,
  profile: MoveAnimationProfile,
  lift: number,
): MoveSample {
  const eased =
    profile.moveKind === "jump"
      ? easeInOutQuad(rawProgress)
      : easeOutCubic(rawProgress);

  const x = from.x + (to.x - from.x) * eased;
  const z = from.z + (to.z - from.z) * eased;

  const arcFactor =
    profile.moveKind === "jump"
      ? Math.sin(eased * Math.PI) ** 0.82
      : Math.sin(eased * Math.PI);

  const y = lift + profile.arcHeight * arcFactor;

  let scaleY = 1;
  if (eased > 0.82) {
    const land = (eased - 0.82) / 0.18;
    scaleY = 1 - 0.1 * Math.sin(land * Math.PI);
  }

  const rotationY = profile.rotationDelta * Math.sin(eased * Math.PI);

  return { x, y, z, scaleY, rotationY };
}

export interface CapturedPieceSnapshot {
  square: Square;
  color: Color;
  type: PieceSymbol;
  moveKey: string;
}

export function buildCapturedSnapshot(
  lastMove: LastMove,
): CapturedPieceSnapshot | null {
  if (!lastMove.capturedPiece) return null;
  const square = lastMove.capturedSquare ?? lastMove.to;
  return {
    square,
    color: lastMove.capturedPiece.color,
    type: lastMove.capturedPiece.type,
    moveKey: `${lastMove.from}-${lastMove.to}`,
  };
}
