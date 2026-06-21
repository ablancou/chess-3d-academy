import { Chess, type Color } from "chess.js";
import type { ChessLesson } from "./types";

export function getStepColor(stepIndex: number): Color {
  return stepIndex % 2 === 0 ? "w" : "b";
}

export function isStudentTurn(
  lesson: ChessLesson,
  stepIndex: number,
): boolean {
  return getStepColor(stepIndex) === lesson.studentColor;
}

export function playMove(chess: Chess, san: string): boolean {
  try {
    const move = chess.move(san, { strict: false });
    return move !== null;
  } catch {
    return false;
  }
}

export function tryMove(
  chess: Chess,
  from: string,
  to: string,
): { ok: boolean; san?: string } {
  const moves = chess.moves({ square: from as never, verbose: true });
  const target = moves.find((m) => m.to === to);
  if (!target) return { ok: false };

  const promotion = target.promotion ? "q" : undefined;
  const move = chess.move({ from, to, promotion });
  if (!move) return { ok: false };

  return { ok: true, san: move.san };
}

export function advanceOpponentMoves(
  chess: Chess,
  lesson: ChessLesson,
  startIndex: number,
): {
  newIndex: number;
  lastExplanation: string | null;
  lastMove: { from: string; to: string } | null;
} {
  let index = startIndex;
  let lastExplanation: string | null = null;
  let lastMove: { from: string; to: string } | null = null;

  while (index < lesson.steps.length && !isStudentTurn(lesson, index)) {
    const step = lesson.steps[index];
    if (!playMove(chess, step.move)) break;
    const history = chess.history({ verbose: true });
    const played = history[history.length - 1];
    if (played) {
      lastMove = { from: played.from, to: played.to };
    }
    lastExplanation = step.explanation;
    index++;
  }

  return { newIndex: index, lastExplanation, lastMove };
}