import { Chess, type Square } from "chess.js";
import type { ChessLesson, GuideSuggestion } from "@/lib/chess/lessons/types";
import { getBookSuggestion } from "./opening-book";

const CENTER_SQUARES: Square[] = ["d4", "d5", "e4", "e5", "c4", "c5"];

function scoreMove(chess: Chess, san: string): number {
  const clone = new Chess(chess.fen());
  const move = clone.move(san);
  if (!move) return -Infinity;

  let score = 0;

  if (move.captured) score += 100;
  if (clone.inCheck()) score += 50;

  if (CENTER_SQUARES.includes(move.to)) score += 20;
  if (move.piece === "n" || move.piece === "b") score += 15;
  if (move.piece === "p" && (move.to[1] === "4" || move.to[1] === "5")) {
    score += 10;
  }

  if (clone.isCheckmate()) score += 10000;
  if (clone.isDraw()) score -= 30;

  return score;
}

function getHeuristicSuggestion(chess: Chess): GuideSuggestion | null {
  const moves = chess.moves();
  if (moves.length === 0) return null;

  const ranked = moves
    .map((san) => ({ san, score: scoreMove(chess, san) }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const verbose = chess.moves({ verbose: true }).find((m) => m.san === best.san);
  if (!verbose) return null;

  let explanation = "Jugada sólida según principios generales.";
  if (best.score >= 100) explanation = "Captura material favorable.";
  else if (best.score >= 50) explanation = "Jaque: prioriza la seguridad del rey rival.";
  else if (best.score >= 20) explanation = "Mejora el control del centro.";
  else explanation = "Desarrollo natural y activación de piezas.";

  return {
    san: best.san,
    from: verbose.from,
    to: verbose.to,
    explanation,
    source: "engine",
    score: best.score,
  };
}

export function getLessonSuggestion(
  chess: Chess,
  lesson: ChessLesson,
  stepIndex: number,
): GuideSuggestion | null {
  if (stepIndex >= lesson.steps.length) return null;

  const expectedStep = lesson.steps[stepIndex];
  const chessClone = new Chess(chess.fen());
  const moves = chessClone.moves({ verbose: true });
  const match = moves.find((m) => m.san === expectedStep.move);

  if (!match) return null;

  return {
    san: expectedStep.move,
    from: match.from,
    to: match.to,
    explanation: expectedStep.explanation,
    source: "lesson",
    lessonName: lesson.name,
  };
}

export function computeGuideSuggestion(
  chess: Chess,
  options: {
    lesson?: ChessLesson | null;
    lessonStepIndex?: number;
    studentColor?: "w" | "b";
  } = {},
): GuideSuggestion | null {
  const { lesson, lessonStepIndex = 0, studentColor } = options;

  if (lesson && studentColor && chess.turn() === studentColor) {
    const lessonSuggestion = getLessonSuggestion(chess, lesson, lessonStepIndex);
    if (lessonSuggestion) return lessonSuggestion;
  }

  const bookSuggestion = getBookSuggestion(chess);
  if (bookSuggestion) return bookSuggestion;

  return getHeuristicSuggestion(chess);
}