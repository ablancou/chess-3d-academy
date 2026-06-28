import { Chess, type Move, type PieceSymbol, type Square } from "chess.js";
import { create } from "zustand";
import { audioManager } from "@/lib/audio/audio-manager";
import { computeGuideSuggestion } from "@/lib/chess/guide/suggest";
import { getGameStatus } from "@/lib/chess/game-status";
import { getLessonById } from "@/lib/chess/lessons";
import {
  advanceOpponentMoves,
  isStudentTurn,
} from "@/lib/chess/lessons/engine";
import type {
  AppMode,
  ChessLesson,
  GuideSuggestion,
} from "@/lib/chess/lessons/types";
import {
  buildLastMoveFromVerbose,
  isPromotionTarget,
  tryMoveWithPromotion,
} from "@/lib/chess/move-logic";
import type {
  BoardPiece,
  GameStatus,
  GuideHighlight,
  LastMove,
  PromotionPending,
} from "@/lib/chess/types";

interface GameStore {
  chess: Chess;
  selectedSquare: Square | null;
  legalTargets: Square[];
  lastMove: LastMove | null;
  moveTimestamp: number;
  moveHistory: Move[];

  board: BoardPiece[];
  turn: "w" | "b";
  status: GameStatus;
  fen: string;

  spectacularMode: boolean;
  promotionPending: PromotionPending | null;

  mode: AppMode;
  guideEnabled: boolean;
  guideSuggestion: GuideSuggestion | null;
  guideHighlight: GuideHighlight | null;

  activeLessonId: string | null;
  lessonStepIndex: number;
  lessonFeedback: string | null;
  lessonComplete: boolean;

  coachEnabled: boolean;
  coachFeedback: import("@/lib/chess/engine/coach").CoachFeedback | null;
  engineEvaluation: import("@/lib/chess/engine/stockfish").EngineEvaluation | null;
  moveQualities: { w: string[]; b: string[] };
  currentOpening: import("@/lib/chess/openings/explorer").OpeningInfo | null;
  openingAlternatives: import("@/lib/chess/openings/explorer").ExplorerMove[];
  toggleCoach: (enabled?: boolean) => void;
  setCoachFeedback: (
    feedback: import("@/lib/chess/engine/coach").CoachFeedback | null, 
    evaluation: import("@/lib/chess/engine/stockfish").EngineEvaluation | null,
    opening?: import("@/lib/chess/openings/explorer").OpeningInfo | null,
    alternatives?: import("@/lib/chess/openings/explorer").ExplorerMove[]
  ) => void;

  selectSquare: (square: Square) => void;
  applyPeerMove: (from: Square, to: Square, promotion?: PieceSymbol) => void;
  resetGame: () => void;
  setMode: (mode: AppMode) => void;
  toggleGuide: (enabled?: boolean) => void;
  toggleSpectacular: (enabled?: boolean) => void;
  completePromotion: (piece: PieceSymbol) => void;
  startLesson: (lessonId: string) => void;
  exitLesson: () => void;
  applyGuideMove: () => void;
  refreshGuide: () => void;
}

function buildBoard(chess: Chess): BoardPiece[] {
  const pieces: BoardPiece[] = [];
  for (let file = 0; file < 8; file++) {
    for (let rank = 0; rank < 8; rank++) {
      const square = `${"abcdefgh"[file]}${rank + 1}` as Square;
      const piece = chess.get(square);
      if (piece) {
        pieces.push({ square, color: piece.color, type: piece.type });
      }
    }
  }
  return pieces;
}

function syncFromChess(chess: Chess) {
  return {
    board: buildBoard(chess),
    turn: chess.turn(),
    status: getGameStatus(chess),
    fen: chess.fen(),
    moveHistory: chess.history({ verbose: true }) as Move[],
  };
}

function getLegalTargets(chess: Chess, square: Square): Square[] {
  return chess.moves({ square, verbose: true }).map((move) => move.to);
}

function getActiveLesson(state: GameStore): ChessLesson | null {
  if (!state.activeLessonId) return null;
  return getLessonById(state.activeLessonId) ?? null;
}

function updateGuide(state: GameStore): Partial<GameStore> {
  if (!state.guideEnabled) {
    return { guideSuggestion: null, guideHighlight: null };
  }

  const lesson = getActiveLesson(state);
  const suggestion = computeGuideSuggestion(state.chess, {
    lesson,
    lessonStepIndex: state.lessonStepIndex,
    studentColor: lesson?.studentColor,
  });

  if (!suggestion) {
    return { guideSuggestion: null, guideHighlight: null };
  }

  return {
    guideSuggestion: suggestion,
    guideHighlight: {
      from: suggestion.from as Square,
      to: suggestion.to as Square,
    },
  };
}

function commitState(
  chess: Chess,
  partial: Partial<GameStore>,
  get: () => GameStore,
): Partial<GameStore> {
  const base = {
    ...syncFromChess(chess),
    ...partial,
  };
  const merged = { ...get(), ...base };
  const guide = updateGuide(merged as GameStore);
  return { ...base, ...guide };
}

function applyMove(
  chess: Chess,
  from: Square,
  to: Square,
  promotion?: PieceSymbol,
): { ok: boolean; lastMove?: LastMove; moveObj?: Move } {
  const result = tryMoveWithPromotion(chess, from, to, promotion);
  if (!result.ok || !result.move) return { ok: false };
  return { ok: true, lastMove: buildLastMoveFromVerbose(result.move), moveObj: result.move };
}

function playMoveSound(chess: Chess, move: Move) {
  if (chess.isGameOver()) {
    audioManager.play("gameEnd");
    return;
  }
  if (chess.inCheck()) {
    audioManager.play("check");
    return;
  }
  if (move.flags.includes("c") || move.flags.includes("e")) {
    audioManager.play("capture");
    return;
  }
  if (move.flags.includes("k") || move.flags.includes("q")) {
    audioManager.play("castle");
    return;
  }
  audioManager.play("move");
}

export const useGameStore = create<GameStore>((set, get) => ({
  chess: new Chess(),
  selectedSquare: null,
  legalTargets: [],
  lastMove: null,
  moveTimestamp: 0,
  ...syncFromChess(new Chess()),

  spectacularMode: false,
  promotionPending: null,

  mode: "play",
  guideEnabled: false,
  guideSuggestion: null,
  guideHighlight: null,

  coachEnabled: true, // Default to true so users see it
  coachFeedback: null,
  engineEvaluation: null,
  moveQualities: { w: [], b: [] },
  currentOpening: null,
  openingAlternatives: [],

  activeLessonId: null,
  lessonStepIndex: 0,
  lessonFeedback: null,
  lessonComplete: false,

  toggleCoach: (enabled) => {
    set({ coachEnabled: enabled ?? !get().coachEnabled });
  },

  setCoachFeedback: (feedback, evaluation, opening, alternatives) => {
    set((state) => {
      const newQualities = { ...state.moveQualities };
      if (feedback && state.lastMove) {
        // Record quality for the player who just moved (the opposite of the current turn)
        const playerWhoMoved = state.turn === "w" ? "b" : "w";
        // Only push if we haven't already for this move index to prevent duplicates
        const moveIndex = Math.floor(state.moveHistory.length / 2);
        if (newQualities[playerWhoMoved].length <= moveIndex) {
          newQualities[playerWhoMoved].push(feedback.quality);
        }
      }
      return { 
        coachFeedback: feedback, 
        engineEvaluation: evaluation,
        moveQualities: newQualities,
        currentOpening: opening !== undefined ? opening : state.currentOpening,
        openingAlternatives: alternatives !== undefined ? alternatives : state.openingAlternatives
      };
    });
  },

  toggleSpectacular: (enabled) => {
    set({ spectacularMode: enabled ?? !get().spectacularMode });
  },

  completePromotion: (piece) => {
    const { promotionPending, chess } = get();
    if (!promotionPending) return;

    const { from, to } = promotionPending;
    const result = applyMove(chess, from, to, piece);
    if (!result.ok || !result.lastMove || !result.moveObj) return;

    playMoveSound(chess, result.moveObj);
    
    // Broadcast via WebRTC
    import("@/lib/multiplayer/peer-service").then((m) => {
      m.peerService.sendMove(from, to, piece);
    });

    set(
      commitState(
        chess,
        {
          selectedSquare: null,
          legalTargets: [],
          lastMove: result.lastMove,
          moveTimestamp: Date.now(),
          promotionPending: null,
          lessonFeedback: null,
        },
        get,
      ),
    );
  },

  refreshGuide: () => {
    const guide = updateGuide(get());
    set(guide);
  },

  toggleGuide: (enabled) => {
    const next = enabled ?? !get().guideEnabled;
    set({ guideEnabled: next });
    const guide = updateGuide({ ...get(), guideEnabled: next });
    set(guide);
  },

  setMode: (mode) => {
    if (mode === "play") {
      set({
        mode: "play",
        activeLessonId: null,
        lessonStepIndex: 0,
        lessonFeedback: null,
        lessonComplete: false,
      });
      get().resetGame();
      return;
    }
    set({ mode });
  },

  startLesson: (lessonId) => {
    const lesson = getLessonById(lessonId);
    if (!lesson) return;

    const chess = new Chess();
    let stepIndex = 0;
    let feedback: string | null = `Lección: ${lesson.name}. ${lesson.description}`;

    const advanced = advanceOpponentMoves(chess, lesson, stepIndex);
    stepIndex = advanced.newIndex;
    if (advanced.lastExplanation) {
      feedback = advanced.lastExplanation;
    }

    const isComplete = stepIndex >= lesson.steps.length;

    set(
      commitState(
        chess,
        {
          chess,
          mode: "lesson",
          activeLessonId: lessonId,
          lessonStepIndex: stepIndex,
          lessonFeedback: isComplete
            ? "¡Lección completada! Excelente trabajo."
            : feedback,
          lessonComplete: isComplete,
          selectedSquare: null,
          legalTargets: [],
          lastMove: advanced.lastMove
            ? {
                from: advanced.lastMove.from as Square,
                to: advanced.lastMove.to as Square,
              }
            : null,
          moveTimestamp: advanced.lastMove ? Date.now() : 0,
          guideEnabled: true,
          promotionPending: null,
        },
        get,
      ),
    );
  },

  exitLesson: () => {
    const chess = new Chess();
    set(
      commitState(
        chess,
        {
          chess,
          mode: "play",
          activeLessonId: null,
          lessonStepIndex: 0,
          lessonFeedback: null,
          lessonComplete: false,
          selectedSquare: null,
          legalTargets: [],
          lastMove: null,
          moveTimestamp: 0,
          promotionPending: null,
        },
        get,
      ),
    );
  },

  applyGuideMove: () => {
    const { guideHighlight, chess } = get();
    if (!guideHighlight) return;

    const from = guideHighlight.from as Square;
    const to = guideHighlight.to as Square;
    const targets = getLegalTargets(chess, from);

    if (!targets.includes(to)) return;

    set({ selectedSquare: from, legalTargets: targets });
    get().selectSquare(to);
  },

  selectSquare: (square) => {
    const state = get();
    const { chess, selectedSquare, legalTargets, mode, activeLessonId, lessonStepIndex } =
      state;

    const piece = chess.get(square);
    const isCurrentPlayerPiece =
      piece !== undefined && piece.color === chess.turn();

    if (selectedSquare === square) {
      set({ selectedSquare: null, legalTargets: [] });
      return;
    }

    if (selectedSquare && legalTargets.includes(square)) {
      if (isPromotionTarget(chess, selectedSquare, square)) {
        set({
          promotionPending: { from: selectedSquare, to: square },
          selectedSquare: null,
          legalTargets: [],
        });
        return;
      }

      if (mode === "lesson" && activeLessonId) {
        const lesson = getLessonById(activeLessonId);
        if (!lesson) return;

        if (!isStudentTurn(lesson, lessonStepIndex)) return;

        const expected = lesson.steps[lessonStepIndex];
        const result = applyMove(chess, selectedSquare, square);

        if (!result.ok) {
          set({ lessonFeedback: "Movimiento ilegal." });
          return;
        }

        if (result.lastMove?.san !== expected.move) {
          chess.undo();
          set({
            selectedSquare: null,
            legalTargets: [],
            lessonFeedback: `Incorrecto. La jugada esperada era ${expected.move}. ${expected.explanation}`,
            ...syncFromChess(chess),
          });
          get().refreshGuide();
          return;
        }

        let nextIndex = lessonStepIndex + 1;
        let feedback = expected.explanation;
        const advanced = advanceOpponentMoves(chess, lesson, nextIndex);
        nextIndex = advanced.newIndex;
        if (advanced.lastExplanation) feedback = advanced.lastExplanation;

        const isComplete = nextIndex >= lesson.steps.length;
        const animMove = advanced.lastMove ?? {
          from: selectedSquare,
          to: square,
        };

        set(
          commitState(
            chess,
            {
              selectedSquare: null,
              legalTargets: [],
              lastMove: {
                from: animMove.from as Square,
                to: animMove.to as Square,
              },
              moveTimestamp: Date.now(),
              lessonStepIndex: nextIndex,
              lessonFeedback: isComplete
                ? "¡Lección completada! Dominas esta línea."
                : feedback,
              lessonComplete: isComplete,
            },
            get,
          ),
        );
        return;
      }

      const result = applyMove(chess, selectedSquare, square);
      if (result.ok && result.lastMove && result.moveObj) {
        playMoveSound(chess, result.moveObj);
        
        // Broadcast via WebRTC
        import("@/lib/multiplayer/peer-service").then((m) => {
          m.peerService.sendMove(selectedSquare, square);
        });

        set(
          commitState(
            chess,
            {
              selectedSquare: null,
              legalTargets: [],
              lastMove: result.lastMove,
              moveTimestamp: Date.now(),
              lessonFeedback: null,
            },
            get,
          ),
        );
      }
      return;
    }

    if (mode === "lesson" && activeLessonId) {
      const lesson = getLessonById(activeLessonId);
      if (lesson && !isStudentTurn(lesson, lessonStepIndex)) return;
      if (lesson && chess.turn() !== lesson.studentColor) return;
    }

    if (isCurrentPlayerPiece) {
      set({
        selectedSquare: square,
        legalTargets: getLegalTargets(chess, square),
      });
      return;
    }

    set({ selectedSquare: null, legalTargets: [] });
  },

  applyPeerMove: (from, to, promotion) => {
    const { chess } = get();
    const result = applyMove(chess, from, to, promotion);
    if (result.ok && result.lastMove && result.moveObj) {
      playMoveSound(chess, result.moveObj);
      set(
        commitState(
          chess,
          {
            selectedSquare: null,
            legalTargets: [],
            lastMove: result.lastMove,
            moveTimestamp: Date.now(),
            lessonFeedback: null,
          },
          get,
        ),
      );
    }
  },

  resetGame: () => {
    const { mode, activeLessonId } = get();

    if (mode === "lesson" && activeLessonId) {
      get().startLesson(activeLessonId);
      return;
    }

    const chess = new Chess();
    set(
      commitState(
        chess,
        {
          chess,
          selectedSquare: null,
          legalTargets: [],
          lastMove: null,
          moveTimestamp: 0,
          promotionPending: null,
          lessonFeedback: null,
          lessonComplete: false,
        },
        get,
      ),
    );
  },
}));