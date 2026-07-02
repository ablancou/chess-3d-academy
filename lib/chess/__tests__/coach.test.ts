import assert from "node:assert/strict";
import { test } from "node:test";
import { evaluateMoveQuality } from "../engine/coach";
import type { EngineEvaluation } from "../engine/stockfish";

function makeEval(score: number, bestmove = "e2e4"): EngineEvaluation {
  return { score, mate: null, bestmove };
}

test("jugada de libro se marca como teoría", () => {
  const feedback = evaluateMoveQuality(makeEval(0.3), makeEval(0.3), "b", {
    isBookMove: true,
  });
  assert.equal(feedback.quality, "book");
});

test("gran pérdida de evaluación es blunder", () => {
  // Blancas jugaron (turn ahora es "b"): de +2.0 a -3.0 → delta -5.0
  const feedback = evaluateMoveQuality(makeEval(2.0), makeEval(-3.0), "b");
  assert.equal(feedback.quality, "blunder");
  assert.ok(feedback.delta < -3);
});

test("pérdida moderada es mistake", () => {
  const feedback = evaluateMoveQuality(makeEval(1.0), makeEval(-1.0), "b");
  assert.equal(feedback.quality, "mistake");
});

test("pérdida pequeña es imprecisión", () => {
  const feedback = evaluateMoveQuality(makeEval(0.5), makeEval(-0.5), "b");
  assert.equal(feedback.quality, "inaccuracy");
});

test("jugar la mejor del motor es best", () => {
  const feedback = evaluateMoveQuality(
    makeEval(0.5, "g1f3"),
    makeEval(0.6),
    "b",
    { playedUci: "g1f3" },
  );
  assert.equal(feedback.quality, "best");
});

test("la mejor jugada con gran ganancia es brillante", () => {
  const feedback = evaluateMoveQuality(
    makeEval(0.0, "d1h5"),
    makeEval(3.0),
    "b",
    { playedUci: "d1h5" },
  );
  assert.equal(feedback.quality, "brilliant");
});

test("perspectiva de las negras: mejorar su posición es excelente", () => {
  // Negras jugaron (turn ahora es "w"): eval baja de +1.0 a 0.0 → bueno para negras
  const feedback = evaluateMoveQuality(makeEval(1.0), makeEval(0.0), "w");
  assert.equal(feedback.quality, "excellent");
});

test("el mensaje incluye la jugada mejor cuando hay error", () => {
  const feedback = evaluateMoveQuality(makeEval(2.0), makeEval(-3.0), "b", {
    bestMoveSan: "Nf3",
  });
  assert.equal(feedback.betterMove, "Nf3");
  assert.ok(feedback.message.includes("Nf3"));
});
