import assert from "node:assert/strict";
import { test } from "node:test";
import { Chess } from "chess.js";
import { getLessonById } from "../lessons";
import { ACHIEVEMENTS } from "../../progression/achievements";
import {
  ALL_JOURNEY_NODES,
  JOURNEY_WORLDS,
  getCurrentNode,
  isNodeUnlocked,
} from "../../progression/journey";
import { MISSION_POOL, rollDailyMissions, todayKey } from "../../progression/missions";

test("todos los nodos de lección del journey apuntan a lecciones existentes", () => {
  for (const node of ALL_JOURNEY_NODES) {
    if (node.type === "lesson") {
      assert.ok(node.lessonId, `Nodo ${node.id} sin lessonId`);
      assert.ok(
        getLessonById(node.lessonId!),
        `Nodo ${node.id} apunta a lección inexistente: ${node.lessonId}`,
      );
    }
  }
});

test("los ids de nodos del journey son únicos", () => {
  const ids = ALL_JOURNEY_NODES.map((n) => n.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("cada mundo tiene al menos 3 nodos", () => {
  for (const world of JOURNEY_WORLDS) {
    assert.ok(world.nodes.length >= 3, `Mundo ${world.id} muy pequeño`);
  }
});

test("desbloqueo secuencial de nodos", () => {
  const first = ALL_JOURNEY_NODES[0];
  const second = ALL_JOURNEY_NODES[1];
  assert.equal(isNodeUnlocked(first.id, []), true);
  assert.equal(isNodeUnlocked(second.id, []), false);
  assert.equal(isNodeUnlocked(second.id, [first.id]), true);
});

test("getCurrentNode devuelve el primer nodo pendiente", () => {
  const first = ALL_JOURNEY_NODES[0];
  const second = ALL_JOURNEY_NODES[1];
  assert.equal(getCurrentNode([]).id, first.id);
  assert.equal(getCurrentNode([first.id]).id, second.id);
});

test("rollDailyMissions es determinista y sin tipos repetidos", () => {
  const a = rollDailyMissions("2026-07-02");
  const b = rollDailyMissions("2026-07-02");
  assert.deepEqual(
    a.map((m) => m.id),
    b.map((m) => m.id),
  );
  assert.equal(a.length, 3);
  const kinds = a.map((m) => m.kind);
  assert.equal(new Set(kinds).size, kinds.length);
});

test("misiones distintas en días distintos (al menos a veces)", () => {
  const days = ["2026-07-01", "2026-07-02", "2026-07-03", "2026-07-04"];
  const signatures = new Set(
    days.map((d) => rollDailyMissions(d).map((m) => m.id).join(",")),
  );
  assert.ok(signatures.size > 1);
});

test("todayKey tiene formato YYYY-MM-DD", () => {
  assert.match(todayKey(new Date("2026-07-02T12:00:00")), /^2026-07-02$/);
});

test("ids de misiones y logros son únicos", () => {
  const missionIds = MISSION_POOL.map((m) => m.id);
  assert.equal(new Set(missionIds).size, missionIds.length);
  const achievementIds = ACHIEVEMENTS.map((a) => a.id);
  assert.equal(new Set(achievementIds).size, achievementIds.length);
});

test("los checks de logros funcionan con stats sintéticas", () => {
  const stats = {
    gamesPlayed: 1,
    gamesCheckmate: 0,
    lessonsCompleted: 0,
    excellentMoves: 0,
    totalMoves: 0,
    hintsUsed: 0,
    bestStreak: 0,
    perfectLessons: 0,
  };
  const firstGame = ACHIEVEMENTS.find((a) => a.id === "first-game")!;
  const firstMate = ACHIEVEMENTS.find((a) => a.id === "first-checkmate")!;
  assert.equal(firstGame.check(stats), true);
  assert.equal(firstMate.check(stats), false);
});

test("las lecciones del journey son jugables de inicio a fin", () => {
  for (const node of ALL_JOURNEY_NODES) {
    if (!node.lessonId) continue;
    const lesson = getLessonById(node.lessonId)!;
    const chess = new Chess();
    for (const step of lesson.steps) {
      assert.doesNotThrow(
        () => chess.move(step.move),
        `Jugada ilegal ${step.move} en lección ${lesson.id}`,
      );
    }
  }
});
