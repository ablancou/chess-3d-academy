import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { squareToPosition } from "../coordinates";
import {
  resolvePieceStartPosition,
  computeMoveAnimationProfile,
  sampleMovePosition,
  buildCapturedSnapshot,
} from "../piece-animation-math";

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

  it("knight jump has higher arc than pawn slide", () => {
    const move = { from: "b1" as const, to: "c3" as const, captured: false };
    const knight = computeMoveAnimationProfile(move, "n");
    const pawn = computeMoveAnimationProfile(
      { from: "e2", to: "e4", captured: false },
      "p",
    );
    assert.ok(knight.arcHeight > pawn.arcHeight);
    assert.equal(knight.moveKind, "jump");
  });

  it("sampleMovePosition peaks mid-flight", () => {
    const profile = computeMoveAnimationProfile(
      { from: "e2", to: "e4", captured: false },
      "p",
    );
    const mid = sampleMovePosition(
      { x: 0, z: 3 },
      { x: 0, z: 2 },
      0.5,
      profile,
      0,
    );
    const start = sampleMovePosition(
      { x: 0, z: 3 },
      { x: 0, z: 2 },
      0,
      profile,
      0,
    );
    assert.ok(mid.y > start.y);
  });

  it("buildCapturedSnapshot uses en passant square", () => {
    const snap = buildCapturedSnapshot({
      from: "e5",
      to: "d6",
      captured: true,
      isEnPassant: true,
      capturedPiece: { color: "b", type: "p" },
      capturedSquare: "d5",
    });
    assert.ok(snap);
    assert.equal(snap!.square, "d5");
    assert.equal(snap!.type, "p");
  });
});
