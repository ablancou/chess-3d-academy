export interface EngineEvaluation {
  score: number; // positive = white is winning, negative = black is winning. If mate, it's 10000 or -10000
  mate: number | null; // number of moves to mate, positive for white, negative for black
  bestmove: string;
}

export class StockfishEngine {
  private worker: Worker | null = null;
  private isReady = false;
  private onReady?: () => void;
  private currentEvaluationCallback?: (evalResult: EngineEvaluation) => void;
  private currentScore = 0;
  private currentMate: number | null = null;
  private currentBestMove = "";

  constructor() {
    if (typeof window === "undefined") return;

    // Use the WASM version if available, otherwise fallback to standard stockfish.js
    // We copied these to the public folder
    try {
      this.worker = new Worker("/stockfish.js");
      
      this.worker.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.worker.postMessage("uci");
    } catch (e) {
      console.error("Failed to initialize Stockfish worker:", e);
    }
  }

  private handleMessage(msg: string) {
    if (msg === "uciok") {
      this.isReady = true;
      this.onReady?.();
    }

    // Parse evaluation info (e.g. "info depth 15 seldepth 22 multipv 1 score cp 25 nodes 182772 nps 913860 time 200 pv e2e4 ...")
    if (msg.startsWith("info") && msg.includes("score")) {
      const matchCp = msg.match(/score cp (-?\d+)/);
      if (matchCp) {
        this.currentScore = parseInt(matchCp[1], 10) / 100.0; // convert centipawns to pawns
        this.currentMate = null;
      }

      const matchMate = msg.match(/score mate (-?\d+)/);
      if (matchMate) {
        this.currentMate = parseInt(matchMate[1], 10);
        this.currentScore = this.currentMate > 0 ? 10000 : -10000;
      }
    }

    if (msg.startsWith("bestmove")) {
      const match = msg.match(/bestmove\s(\S+)/);
      if (match) {
        this.currentBestMove = match[1];
        if (this.currentEvaluationCallback) {
          this.currentEvaluationCallback({
            score: this.currentScore,
            mate: this.currentMate,
            bestmove: this.currentBestMove,
          });
          this.currentEvaluationCallback = undefined;
        }
      }
    }
  }

  public async init(): Promise<void> {
    if (this.isReady) return Promise.resolve();
    return new Promise((resolve) => {
      this.onReady = resolve;
    });
  }

  public async evaluatePosition(fen: string, depth = 12): Promise<EngineEvaluation> {
    if (!this.worker) throw new Error("Stockfish worker not initialized");
    
    return new Promise((resolve) => {
      this.currentEvaluationCallback = resolve;
      this.worker!.postMessage(`position fen ${fen}`);
      this.worker!.postMessage(`go depth ${depth}`);
    });
  }

  public destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Singleton instance for the client
export const stockfishEngine = typeof window !== "undefined" ? new StockfishEngine() : null;
