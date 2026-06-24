import { Chess } from "chess.js";
import {
  buildLastMoveFromVerbose,
  findKingSquare,
  isPromotionTarget,
  tryMoveWithPromotion,
} from "../lib/chess/move-logic";
import { dramaticMovePose, spectacularOrbitPose } from "../lib/chess/camera-math";

let passed = 0;
let failed = 0;

function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (e) {
    console.error(`✗ ${name}:`, e);
    failed++;
  }
}

check("reset game starts at playing", () => {
  const chess = new Chess();
  if (chess.isCheck()) throw new Error("should not start in check");
});

check("legal move e2-e4", () => {
  const chess = new Chess();
  const r = tryMoveWithPromotion(chess, "e2", "e4");
  if (!r.ok) throw new Error("e2-e4 failed");
});

check("promotion requires piece choice", () => {
  const chess = new Chess("8/P7/8/8/8/8/8/4K2k w - - 0 1");
  if (!isPromotionTarget(chess, "a7", "a8")) throw new Error("should need promotion");
  const r = tryMoveWithPromotion(chess, "a7", "a8");
  if (r.ok || !r.needsPromotion) throw new Error("should defer promotion");
});

check("promotion with knight", () => {
  const chess = new Chess("8/P7/8/8/8/8/8/4K2k w - - 0 1");
  const r = tryMoveWithPromotion(chess, "a7", "a8", "n");
  if (!r.ok || chess.get("a8")?.type !== "n") throw new Error("knight promotion failed");
});

check("castling move flags", () => {
  const chess = new Chess();
  chess.move("e4");
  chess.move("a6");
  chess.move("Nf3");
  chess.move("a5");
  chess.move("Bc4");
  chess.move("a4");
  chess.move("O-O");
  const last = chess.history({ verbose: true }).at(-1)!;
  const built = buildLastMoveFromVerbose(last);
  if (!built.isCastling) throw new Error("castling not detected");
});

check("check detection finds white king", () => {
  const chess = new Chess("rnb1kbnr/pppp1ppp/8/4p3/6Pq/8/PPPPP1PP/RNBQKBNR w KQkq - 1 3");
  if (!chess.isCheck()) throw new Error("should be check");
  if (findKingSquare(chess, "w") !== "e1") throw new Error("wrong king square");
});

check("camera poses are finite", () => {
  const pose = dramaticMovePose("e4");
  if (!Number.isFinite(pose.position[0])) throw new Error("invalid dramatic pose");
  const orbit = spectacularOrbitPose(12);
  if (!Number.isFinite(orbit.position[1])) throw new Error("invalid orbit pose");
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);