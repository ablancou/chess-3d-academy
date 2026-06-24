import type { Square } from "chess.js";
import { useGameStore } from "@/stores/game-store";

export interface ChessTestBridge {
  selectAndMove: (from: Square, to: Square) => void;
  getMoveTimestamp: () => number;
  getLastMove: () => ReturnType<typeof useGameStore.getState>["lastMove"];
  getMoveCount: () => number;
  toggleSpectacular: (enabled: boolean) => void;
}

export function createChessTestBridge(): ChessTestBridge {
  return {
    selectAndMove(from, to) {
      const store = useGameStore.getState();
      store.selectSquare(from);
      store.selectSquare(to);
    },
    getMoveTimestamp() {
      return useGameStore.getState().moveTimestamp;
    },
    getLastMove() {
      return useGameStore.getState().lastMove;
    },
    getMoveCount() {
      return useGameStore.getState().moveHistory.length;
    },
    toggleSpectacular(enabled) {
      useGameStore.getState().toggleSpectacular(enabled);
    },
  };
}

declare global {
  interface Window {
    __CHESS_TEST__?: ChessTestBridge;
  }
}

export function installChessTestBridge() {
  if (typeof window !== "undefined") {
    window.__CHESS_TEST__ = createChessTestBridge();
  }
}