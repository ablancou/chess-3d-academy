import { type EngineEvaluation } from "./stockfish";

export type MoveQuality =
  | "brilliant"
  | "best"
  | "excellent"
  | "good"
  | "book"
  | "inaccuracy"
  | "mistake"
  | "blunder";

export interface CoachFeedback {
  quality: MoveQuality;
  message: string;
  /** Cuántos puntos (peones) se ganaron o perdieron con la jugada */
  delta: number;
  /** La mejor jugada que había en la posición anterior (SAN), si se conoce */
  betterMove?: string;
}

export const QUALITY_LABELS: Record<MoveQuality, string> = {
  brilliant: "¡¡Brillante!!",
  best: "¡La mejor!",
  excellent: "¡Excelente!",
  good: "Buena",
  book: "Teoría",
  inaccuracy: "Imprecisión",
  mistake: "Error",
  blunder: "Error grave",
};

interface CoachOptions {
  /** La jugada realizada en formato UCI (ej. "e2e4") */
  playedUci?: string;
  /** SAN de la mejor jugada según el motor en la posición anterior */
  bestMoveSan?: string | null;
  /** ¿La partida sigue dentro de una línea teórica conocida? */
  isBookMove?: boolean;
}

function pick(messages: string[], seed: number): string {
  return messages[Math.abs(seed) % messages.length];
}

export function evaluateMoveQuality(
  prevEval: EngineEvaluation | null,
  newEval: EngineEvaluation,
  turn: "w" | "b",
  options: CoachOptions = {},
): CoachFeedback {
  const { playedUci, bestMoveSan, isBookMove } = options;

  if (isBookMove) {
    return {
      quality: "book",
      message:
        "Jugada de teoría. Sigues una línea conocida por los maestros: desarrollo, centro y seguridad del rey.",
      delta: 0,
    };
  }

  if (!prevEval) {
    return {
      quality: "good",
      message: "Buen comienzo. Controla el centro y desarrolla tus piezas.",
      delta: 0,
    };
  }

  const prevScore = prevEval.mate
    ? prevEval.mate > 0
      ? 10000
      : -10000
    : prevEval.score;
  const newScore = newEval.mate
    ? newEval.mate > 0
      ? 10000
      : -10000
    : newEval.score;

  // La evaluación siempre es desde la perspectiva de las blancas.
  // Si ahora mueven las blancas (turn === "w"), la jugada evaluada fue de las negras.
  const delta = turn === "w" ? prevScore - newScore : newScore - prevScore;
  const seed = Math.round((prevScore + newScore) * 100);

  // ¿Encontró la mejor jugada del motor?
  const playedBest =
    playedUci !== undefined &&
    prevEval.bestmove !== "" &&
    playedUci === prevEval.bestmove;

  const suffix = bestMoveSan ? ` La mejor opción era ${bestMoveSan}.` : "";

  if (delta < -3.0) {
    return {
      quality: "blunder",
      message:
        pick(
          [
            "¡Cuidado! Esa jugada regala mucho material o posición.",
            "Un error grave: la evaluación cayó en picada.",
            "Esa jugada cambia el rumbo de la partida en tu contra.",
          ],
          seed,
        ) + suffix,
      delta,
      betterMove: bestMoveSan ?? undefined,
    };
  }
  if (delta < -1.5) {
    return {
      quality: "mistake",
      message:
        pick(
          [
            "Un error: había opciones claramente mejores.",
            "Esa jugada cede una ventaja importante al rival.",
            "El motor no está de acuerdo: pierdes terreno con esto.",
          ],
          seed,
        ) + suffix,
      delta,
      betterMove: bestMoveSan ?? undefined,
    };
  }
  if (delta < -0.6) {
    return {
      quality: "inaccuracy",
      message:
        pick(
          [
            "Una imprecisión. Has cedido algo de iniciativa.",
            "Jugable, pero había una continuación más precisa.",
            "Pequeño desliz: el rival puede activarse ahora.",
          ],
          seed,
        ) + suffix,
      delta,
      betterMove: bestMoveSan ?? undefined,
    };
  }

  if (playedBest && delta > 1.5) {
    return {
      quality: "brilliant",
      message: pick(
        [
          "¡¡Brillante!! Encontraste el mejor golpe de la posición.",
          "¡Espectacular! Exactamente lo que el motor quería jugar.",
          "¡Una joya táctica! La mejor jugada con gran efecto.",
        ],
        seed,
      ),
      delta,
    };
  }
  if (playedBest) {
    return {
      quality: "best",
      message: pick(
        [
          "¡La mejor jugada! Coincides con el motor.",
          "Precisión de máquina: era exactamente la mejor opción.",
          "Perfecto. No había nada mejor en esta posición.",
        ],
        seed,
      ),
      delta,
    };
  }
  if (delta > 0.5) {
    return {
      quality: "excellent",
      message: pick(
        [
          "¡Excelente jugada! Aumentas tu ventaja.",
          "¡Muy bien visto! La posición mejora claramente.",
          "¡Gran decisión! Estás dominando el tablero.",
        ],
        seed,
      ),
      delta,
    };
  }

  return {
    quality: "good",
    message: pick(
      [
        "Buena jugada. Mantienes el equilibrio.",
        "Sólido. La posición sigue bajo control.",
        "Correcto. Sigue desarrollando tu plan.",
      ],
      seed,
    ),
    delta,
  };
}
