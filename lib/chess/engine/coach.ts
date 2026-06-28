import { type EngineEvaluation } from "./stockfish";

export type MoveQuality = "excellent" | "good" | "inaccuracy" | "mistake" | "blunder" | "book";

export interface CoachFeedback {
  quality: MoveQuality;
  message: string;
}

export function evaluateMoveQuality(
  prevEval: EngineEvaluation | null,
  newEval: EngineEvaluation,
  turn: "w" | "b"
): CoachFeedback {
  if (!prevEval) {
    return { quality: "book", message: "¡Buena apertura! Mantén el control del centro." };
  }

  // Calculate eval diff from the perspective of the player who just moved
  // If turn is 'w', it means black just moved, so we evaluate black's move (new - prev for black)
  // Wait, if it's white's turn to move now, the move we are evaluating was made by Black.
  // Eval is always from white's perspective.
  const prevScore = prevEval.mate ? (prevEval.mate > 0 ? 10000 : -10000) : prevEval.score;
  const newScore = newEval.mate ? (newEval.mate > 0 ? 10000 : -10000) : newEval.score;

  // The diff for the player who just moved (if white is to move, black just played)
  let diff = 0;
  if (turn === "w") {
    // Black just played. If newScore is lower than prevScore, it's good for black.
    diff = prevScore - newScore;
  } else {
    // White just played. If newScore is higher than prevScore, it's good for white.
    diff = newScore - prevScore;
  }

  // diff > 0 means the move improved the position (or opponent blundered previously).
  // diff < 0 means the move worsened the position.

  if (diff < -3.0) {
    return { quality: "blunder", message: "¡Un error grave! Acabas de perder mucha ventaja." };
  }
  if (diff < -1.5) {
    return { quality: "mistake", message: "Esa jugada es un error. Hay opciones mucho mejores." };
  }
  if (diff < -0.8) {
    return { quality: "inaccuracy", message: "Una imprecisión. Has cedido algo de iniciativa." };
  }
  if (diff > 0.5) {
    return { quality: "excellent", message: "¡Excelente jugada! Estás dominando la posición." };
  }
  
  return { quality: "good", message: "Buena jugada. Mantienes el equilibrio." };
}
