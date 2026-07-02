"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/stores/game-store";
import { useProgressStore } from "@/stores/progress-store";
import { stockfishEngine, type EngineEvaluation } from "@/lib/chess/engine/stockfish";
import { evaluateMoveQuality } from "@/lib/chess/engine/coach";
import { uciToMoveInfo } from "@/lib/chess/engine/uci";
import { fetchOpeningInfo, type ExplorerMove, type OpeningInfo } from "@/lib/chess/openings/explorer";
import { detectOpening, isBookLine } from "@/lib/chess/openings/eco-book";

export function CoachEngine() {
  const fen = useGameStore((s) => s.fen);
  const turn = useGameStore((s) => s.turn);
  const mode = useGameStore((s) => s.mode);
  const coachEnabled = useGameStore((s) => s.coachEnabled);
  const setCoachFeedback = useGameStore((s) => s.setCoachFeedback);
  const lastMove = useGameStore((s) => s.lastMove);
  const moveHistory = useGameStore((s) => s.moveHistory);

  // Evaluación y FEN de la posición ANTERIOR a la última jugada
  const prevEvalRef = useRef<EngineEvaluation | null>(null);
  const prevFenRef = useRef<string | null>(null);
  const generationRef = useRef(0);
  const lastRewardedPlyRef = useRef(0);

  // Reiniciar al empezar partida nueva
  useEffect(() => {
    if (!lastMove) {
      prevEvalRef.current = null;
      prevFenRef.current = null;
      setCoachFeedback(null, null, null, []);
    }
  }, [lastMove, setCoachFeedback]);

  useEffect(() => {
    if (!coachEnabled || mode !== "play" || !stockfishEngine) {
      return;
    }

    const generation = ++generationRef.current;
    const isCurrent = () => generationRef.current === generation;

    async function evaluate() {
      await stockfishEngine!.init();

      const history = useGameStore.getState().chess.history();
      const bookMove = lastMove !== null && isBookLine(history);

      // Detección de apertura: primero libro local (offline), luego Lichess
      let openingInfo: OpeningInfo | null | undefined = undefined;
      let openingAlternatives: ExplorerMove[] | undefined = undefined;

      if (moveHistory.length > 0 && moveHistory.length < 40) {
        const local = detectOpening(history);
        if (local) {
          openingInfo = { eco: local.eco, name: local.name };
        }

        const result = await fetchOpeningInfo(fen);
        if (result && isCurrent()) {
          if (result.opening) openingInfo = result.opening;
          openingAlternatives = result.moves;
        }
      }

      if (!isCurrent()) return;

      const currentEval = await stockfishEngine!.evaluatePosition(fen, 12);
      if (!isCurrent()) return;

      if (lastMove) {
        // SAN de la mejor jugada que había en la posición anterior
        const prevBest =
          prevEvalRef.current && prevFenRef.current
            ? uciToMoveInfo(prevFenRef.current, prevEvalRef.current.bestmove)
            : null;

        // UCI de la jugada realmente jugada
        const played = moveHistory[moveHistory.length - 1];
        const playedUci = played
          ? `${played.from}${played.to}${played.promotion ?? ""}`
          : undefined;

        const feedback = evaluateMoveQuality(prevEvalRef.current, currentEval, turn, {
          playedUci,
          bestMoveSan: prevBest?.san ?? null,
          isBookMove: bookMove,
        });

        setCoachFeedback(feedback, currentEval, openingInfo, openingAlternatives);

        const isExcellent =
          feedback.quality === "excellent" ||
          feedback.quality === "best" ||
          feedback.quality === "brilliant";
        if (isExcellent && lastRewardedPlyRef.current !== moveHistory.length) {
          lastRewardedPlyRef.current = moveHistory.length;
          useProgressStore.getState().recordEvent("excellent-move");
        }
      } else {
        setCoachFeedback(null, currentEval, openingInfo, openingAlternatives);
      }

      prevEvalRef.current = currentEval;
      prevFenRef.current = fen;
    }

    evaluate();

    return () => {
      // La siguiente ejecución incrementa generationRef e invalida esta
    };
  }, [fen, turn, mode, coachEnabled, setCoachFeedback, lastMove, moveHistory]);

  return null;
}
