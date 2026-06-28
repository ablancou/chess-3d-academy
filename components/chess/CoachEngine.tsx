"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/stores/game-store";
import { stockfishEngine, type EngineEvaluation } from "@/lib/chess/engine/stockfish";
import { evaluateMoveQuality } from "@/lib/chess/engine/coach";
import { fetchOpeningInfo } from "@/lib/chess/openings/explorer";

export function CoachEngine() {
  const fen = useGameStore((s) => s.fen);
  const turn = useGameStore((s) => s.turn);
  const mode = useGameStore((s) => s.mode);
  const coachEnabled = useGameStore((s) => s.coachEnabled);
  const setCoachFeedback = useGameStore((s) => s.setCoachFeedback);
  const lastMove = useGameStore((s) => s.lastMove);
  const moveHistory = useGameStore((s) => s.moveHistory);
  
  const prevEvalRef = useRef<EngineEvaluation | null>(null);
  
  // Reset previous evaluation when a new game starts or mode changes
  useEffect(() => {
    if (!lastMove) {
      prevEvalRef.current = null;
      setCoachFeedback(null, null, null, []);
    }
  }, [lastMove, setCoachFeedback]);

  useEffect(() => {
    if (!coachEnabled || mode !== "play" || !stockfishEngine) {
      return;
    }

    let isSubscribed = true;

    async function evaluate() {
      // Ensure engine is ready
      await stockfishEngine!.init();
      
      // We only fetch opening info for the first 20 moves (40 plies)
      let openingInfo = undefined;
      let openingAlternatives = undefined;
      
      if (moveHistory.length < 40) {
        const result = await fetchOpeningInfo(fen);
        if (result && isSubscribed) {
          openingInfo = result.opening;
          openingAlternatives = result.moves;
        }
      }

      // Evaluate current position.
      // We use a depth of 12 for reasonably fast but okay feedback.
      const currentEval = await stockfishEngine!.evaluatePosition(fen, 12);
      
      if (!isSubscribed) return;

      if (lastMove) {
        // Evaluate move quality
        const feedback = evaluateMoveQuality(prevEvalRef.current, currentEval, turn);
        setCoachFeedback(feedback, currentEval, openingInfo, openingAlternatives);
      } else {
        // Initial position
        setCoachFeedback(null, currentEval, openingInfo, openingAlternatives);
      }
      
      prevEvalRef.current = currentEval;
    }

    evaluate();

    return () => {
      isSubscribed = false;
    };
  }, [fen, turn, mode, coachEnabled, setCoachFeedback, lastMove, moveHistory.length]);

  return null;
}
