import assert from "node:assert/strict";
import { test } from "node:test";
import { Chess } from "chess.js";
import {
  ECO_OPENINGS,
  detectOpening,
  getTheoryMoves,
  isBookLine,
} from "../openings/eco-book";

test("todas las líneas ECO son legales", () => {
  for (const opening of ECO_OPENINGS) {
    const chess = new Chess();
    for (const san of opening.moves.split(" ")) {
      assert.doesNotThrow(
        () => chess.move(san),
        `Jugada ilegal "${san}" en ${opening.name} (${opening.moves})`,
      );
    }
  }
});

test("detecta la Apertura Italiana", () => {
  const match = detectOpening(["e4", "e5", "Nf3", "Nc6", "Bc4"]);
  assert.ok(match);
  assert.equal(match.eco, "C50");
  assert.equal(match.name, "Apertura Italiana");
});

test("detecta la línea más profunda coincidente", () => {
  const match = detectOpening(["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"]);
  assert.ok(match);
  assert.equal(match.eco, "B90"); // Najdorf, no B20 Siciliana genérica
});

test("no detecta apertura en historial vacío o desconocido", () => {
  assert.equal(detectOpening([]), null);
  assert.equal(detectOpening(["a4", "h5", "a5"])?.plyCount ?? null, null);
});

test("getTheoryMoves sugiere continuaciones desde la posición inicial", () => {
  const moves = getTheoryMoves([]);
  assert.ok(moves.length > 0);
  const sans = moves.map((m) => m.san);
  assert.ok(sans.includes("e4"));
  assert.ok(sans.includes("d4"));
});

test("getTheoryMoves tras 1.e4 incluye respuestas principales", () => {
  const moves = getTheoryMoves(["e4"], 10);
  const sans = moves.map((m) => m.san);
  assert.ok(sans.includes("e5"));
  assert.ok(sans.includes("c5"));
});

test("isBookLine reconoce jugadas de teoría", () => {
  assert.equal(isBookLine(["e4"]), true);
  assert.equal(isBookLine(["e4", "e5"]), true);
  assert.equal(isBookLine(["a4"]), false);
});
