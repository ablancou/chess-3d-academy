import type { DailyMission, MissionDef } from "./types";

export const MISSION_POOL: MissionDef[] = [
  { id: "play-1-game", kind: "play-games", title: "Juega 1 partida completa", goal: 1, rewardXP: 40, rewardGems: 5 },
  { id: "play-2-games", kind: "play-games", title: "Juega 2 partidas completas", goal: 2, rewardXP: 80, rewardGems: 10 },
  { id: "complete-1-lesson", kind: "complete-lessons", title: "Completa 1 lección", goal: 1, rewardXP: 50, rewardGems: 8 },
  { id: "complete-2-lessons", kind: "complete-lessons", title: "Completa 2 lecciones", goal: 2, rewardXP: 100, rewardGems: 15 },
  { id: "excellent-3", kind: "excellent-moves", title: "Haz 3 jugadas excelentes", goal: 3, rewardXP: 60, rewardGems: 8 },
  { id: "excellent-5", kind: "excellent-moves", title: "Haz 5 jugadas excelentes", goal: 5, rewardXP: 90, rewardGems: 12 },
  { id: "moves-20", kind: "play-moves", title: "Realiza 20 movimientos", goal: 20, rewardXP: 30, rewardGems: 5 },
  { id: "moves-40", kind: "play-moves", title: "Realiza 40 movimientos", goal: 40, rewardXP: 55, rewardGems: 8 },
  { id: "hint-1", kind: "use-hint", title: "Pide una pista al coach", goal: 1, rewardXP: 20, rewardGems: 3 },
  { id: "checkmate-1", kind: "win-checkmate", title: "Termina una partida en jaque mate", goal: 1, rewardXP: 70, rewardGems: 10 },
];

const MISSIONS_PER_DAY = 3;

/** Fecha local YYYY-MM-DD */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Selección determinista de misiones para un día dado (misma para todo el día). */
export function rollDailyMissions(dateKey: string): DailyMission[] {
  const seed = hashString(dateKey);
  const pool = [...MISSION_POOL];
  const picked: DailyMission[] = [];
  const usedKinds = new Set<string>();

  let cursor = seed;
  while (picked.length < MISSIONS_PER_DAY && pool.length > 0) {
    cursor = (cursor * 1103515245 + 12345) & 0x7fffffff;
    const idx = cursor % pool.length;
    const def = pool.splice(idx, 1)[0];
    // Evitar dos misiones del mismo tipo el mismo día
    if (usedKinds.has(def.kind)) continue;
    usedKinds.add(def.kind);
    picked.push({ ...def, progress: 0, completed: false });
  }

  return picked;
}
