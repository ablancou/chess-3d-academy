import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import {
  buildLastMoveFromVerbose,
  findKingSquare,
  isCastlingMove,
  isPromotionTarget,
  tryMoveWithPromotion,
} from "../move-logic";

describe("move-logic", () => {
  it("detects promotion target without auto-queening", () => {
    const chess = new Chess("8/P7/8/8/8/8/8/4K2k w - - 0 1");
    assert.equal(isPromotionTarget(chess, "a7", "a8"), true);
    const pending = tryMoveWithPromotion(chess, "a7", "a8");
    assert.equal(pending.ok, false);
    assert.equal(pending.needsPromotion, true);
  });

  it("completes promotion with chosen piece", () => {
    const chess = new Chess("8/P7/8/8/8/8/8/4K2k w - - 0 1");
    const result = tryMoveWithPromotion(chess, "a7", "a8", "n");
    assert.equal(result.ok, true);
    assert.equal(chess.get("a8")?.type, "n");
    assert.equal(result.move?.flags.includes("p"), true);
  });

  it("executes kingside castling", () => {
    const chess = new Chess();
    chess.move("e4");
    chess.move("a6");
    chess.move("Nf3");
    chess.move("a5");
    chess.move("Bc4");
    chess.move("a4");
    chess.move("O-O");
    const last = chess.history({ verbose: true }).at(-1)!;
    assert.equal(isCastlingMove(last), true);
    const built = buildLastMoveFromVerbose(last);
    assert.equal(built.isCastling, true);
  });

  it("finds king square in check position", () => {
    const chess = new Chess("rnb1kbnr/pppp1ppp/8/4p3/6Pq/8/PPPPP1PP/RNBQKBNR w KQkq - 1 3");
    assert.equal(findKingSquare(chess, "w"), "e1");
    assert.equal(chess.isCheck(), true);
  });

  it("rejects illegal moves", () => {
    const chess = new Chess();
    const result = tryMoveWithPromotion(chess, "e2", "e5");
    assert.equal(result.ok, false);
  });
});