import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Chess } from "chess.js";
import { getEnPassantCaptureSquare } from "../en-passant";
import { buildLastMoveFromVerbose, tryMoveWithPromotion } from "../move-logic";

describe("en-passant", () => {
  it("computes capture square for en passant", () => {
    const square = getEnPassantCaptureSquare({
      from: "e5",
      to: "f6",
      isEnPassant: true,
    });
    assert.equal(square, "f5");
  });

  it("detects en passant from chess.js move flags", () => {
    const chess = new Chess(
      "8/8/8/3pP3/8/8/8/4K2k w - d6 0 1",
    );
    const result = tryMoveWithPromotion(chess, "e5", "d6");
    assert.equal(result.ok, true);
    assert.equal(result.move?.flags.includes("e"), true);
    const built = buildLastMoveFromVerbose(result.move!);
    assert.equal(built.isEnPassant, true);
    assert.equal(getEnPassantCaptureSquare(built), "d5");
  });
});