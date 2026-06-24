import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { squareToPosition } from "../coordinates";
import { resolvePieceStartPosition } from "../piece-animation-math";

describe("piece-animation-math", () => {
  it("starts from origin square when piece arrives via lastMove", () => {
    const [fromX, , fromZ] = squareToPosition("e2");
    const result = resolvePieceStartPosition(
      "e4",
      { from: "e2", to: "e4" },
      0,
      null,
    );
    assert.equal(result.shouldAnimate, true);
    assert.equal(result.x, fromX);
    assert.equal(result.z, fromZ);
    assert.equal(result.moveKey, "e2-e4");
  });

  it("does not re-animate the same move key", () => {
    const [targetX, , targetZ] = squareToPosition("e4");
    const result = resolvePieceStartPosition(
      "e4",
      { from: "e2", to: "e4" },
      0,
      "e2-e4",
    );
    assert.equal(result.shouldAnimate, false);
    assert.equal(result.x, targetX);
    assert.equal(result.z, targetZ);
  });

  it("places piece at target when not the arriving piece", () => {
    const [, , targetZ] = squareToPosition("d7");
    const result = resolvePieceStartPosition(
      "d7",
      { from: "e2", to: "e4" },
      0,
      null,
    );
    assert.equal(result.shouldAnimate, false);
    assert.equal(result.z, targetZ);
  });
});