import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ACHIEVEMENTS } from "@/lib/progression/achievements";
import { getNodeById } from "@/lib/progression/journey";
import { rollDailyMissions, todayKey } from "@/lib/progression/missions";
import type { DailyMission, PlayerStats } from "@/lib/progression/types";

export const MAX_HEARTS = 5;
export const HEART_REGEN_MS = 30 * 60 * 1000; // 1 corazón cada 30 min
export const HEART_REFILL_GEM_COST = 30;

export type ProgressEventKind =
  | "game-finished"
  | "checkmate"
  | "lesson-completed"
  | "perfect-lesson"
  | "excellent-move"
  | "move"
  | "hint";

const EVENT_TO_MISSION_KIND: Partial<Record<ProgressEventKind, string>> = {
  "game-finished": "play-games",
  checkmate: "win-checkmate",
  "lesson-completed": "complete-lessons",
  "excellent-move": "excellent-moves",
  move: "play-moves",
  hint: "use-hint",
};

const INITIAL_STATS: PlayerStats = {
  gamesPlayed: 0,
  gamesCheckmate: 0,
  lessonsCompleted: 0,
  excellentMoves: 0,
  totalMoves: 0,
  hintsUsed: 0,
  bestStreak: 0,
  perfectLessons: 0,
};

interface ProgressStore {
  xp: number;
  gems: number;
  hearts: number;
  heartsUpdatedAt: number;

  streak: number;
  lastActiveDate: string | null;

  completedNodes: string[];
  completedLessons: string[];

  stats: PlayerStats;
  unlockedAchievements: string[];
  /** Logros desbloqueados aún no mostrados al usuario */
  pendingUnlocks: string[];

  missionsDate: string;
  missions: DailyMission[];

  addXP: (amount: number) => void;
  addGems: (amount: number) => void;
  loseHeart: () => void;
  refillHeartsWithGems: () => boolean;
  /** Regenera corazones según el tiempo transcurrido. Llamar al montar UI. */
  tickHearts: () => void;

  /** Registra un evento de juego: actualiza stats, misiones, racha y logros. */
  recordEvent: (kind: ProgressEventKind) => void;
  completeNode: (nodeId: string) => void;
  markLessonCompleted: (lessonId: string) => void;
  ensureDailyMissions: () => void;
  clearPendingUnlocks: () => void;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayKey(d);
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      xp: 0,
      gems: 0,
      hearts: MAX_HEARTS,
      heartsUpdatedAt: Date.now(),

      streak: 0,
      lastActiveDate: null,

      completedNodes: [],
      completedLessons: [],

      stats: { ...INITIAL_STATS },
      unlockedAchievements: [],
      pendingUnlocks: [],

      missionsDate: "",
      missions: [],

      addXP: (amount) => set((state) => ({ xp: state.xp + amount })),

      addGems: (amount) => set((state) => ({ gems: state.gems + amount })),

      loseHeart: () =>
        set((state) => ({
          hearts: Math.max(0, state.hearts - 1),
          heartsUpdatedAt:
            state.hearts === MAX_HEARTS ? Date.now() : state.heartsUpdatedAt,
        })),

      refillHeartsWithGems: () => {
        const state = get();
        if (state.hearts >= MAX_HEARTS) return false;
        if (state.gems < HEART_REFILL_GEM_COST) return false;
        set({
          gems: state.gems - HEART_REFILL_GEM_COST,
          hearts: MAX_HEARTS,
          heartsUpdatedAt: Date.now(),
        });
        return true;
      },

      tickHearts: () => {
        const state = get();
        if (state.hearts >= MAX_HEARTS) return;
        const elapsed = Date.now() - state.heartsUpdatedAt;
        const regenerated = Math.floor(elapsed / HEART_REGEN_MS);
        if (regenerated <= 0) return;
        const hearts = Math.min(MAX_HEARTS, state.hearts + regenerated);
        set({
          hearts,
          heartsUpdatedAt:
            hearts >= MAX_HEARTS
              ? Date.now()
              : state.heartsUpdatedAt + regenerated * HEART_REGEN_MS,
        });
      },

      ensureDailyMissions: () => {
        const today = todayKey();
        if (get().missionsDate === today) return;
        set({ missionsDate: today, missions: rollDailyMissions(today) });
      },

      recordEvent: (kind) => {
        get().ensureDailyMissions();

        set((state) => {
          // 1. Actualizar racha diaria
          const today = todayKey();
          let { streak } = state;
          if (state.lastActiveDate !== today) {
            streak = state.lastActiveDate === yesterdayKey() ? streak + 1 : 1;
          }

          // 2. Actualizar estadísticas
          const stats: PlayerStats = {
            ...state.stats,
            bestStreak: Math.max(state.stats.bestStreak, streak),
          };
          switch (kind) {
            case "game-finished":
              stats.gamesPlayed += 1;
              break;
            case "checkmate":
              stats.gamesCheckmate += 1;
              break;
            case "lesson-completed":
              stats.lessonsCompleted += 1;
              break;
            case "perfect-lesson":
              stats.perfectLessons += 1;
              break;
            case "excellent-move":
              stats.excellentMoves += 1;
              break;
            case "move":
              stats.totalMoves += 1;
              break;
            case "hint":
              stats.hintsUsed += 1;
              break;
          }

          // 3. Avanzar misiones diarias y cobrar recompensas
          let xpGained = 0;
          let gemsGained = 0;
          const missionKind = EVENT_TO_MISSION_KIND[kind];
          const missions = state.missions.map((m) => {
            if (m.completed || m.kind !== missionKind) return m;
            const progress = m.progress + 1;
            const completed = progress >= m.goal;
            if (completed) {
              xpGained += m.rewardXP;
              gemsGained += m.rewardGems;
            }
            return { ...m, progress, completed };
          });

          // 4. Comprobar logros nuevos
          const newUnlocks: string[] = [];
          for (const achievement of ACHIEVEMENTS) {
            if (state.unlockedAchievements.includes(achievement.id)) continue;
            if (achievement.check(stats)) {
              newUnlocks.push(achievement.id);
              gemsGained += achievement.rewardGems;
            }
          }

          return {
            streak,
            lastActiveDate: today,
            stats,
            missions,
            xp: state.xp + xpGained,
            gems: state.gems + gemsGained,
            unlockedAchievements: [...state.unlockedAchievements, ...newUnlocks],
            pendingUnlocks: [...state.pendingUnlocks, ...newUnlocks],
          };
        });
      },

      completeNode: (nodeId) => {
        const state = get();
        if (state.completedNodes.includes(nodeId)) return;
        const node = getNodeById(nodeId);
        set({
          completedNodes: [...state.completedNodes, nodeId],
          xp: state.xp + (node?.xpReward ?? 0),
        });
      },

      markLessonCompleted: (lessonId) => {
        set((state) =>
          state.completedLessons.includes(lessonId)
            ? state
            : { completedLessons: [...state.completedLessons, lessonId] },
        );
      },

      clearPendingUnlocks: () => set({ pendingUnlocks: [] }),
    }),
    {
      name: "chess-3d-progress",
      version: 2,
      migrate: (persisted, version) => {
        // v0/v1 solo tenían { xp, completedNodes, currentNodeId }: conservamos lo compatible
        if (version < 2) {
          const old = persisted as { xp?: number; completedNodes?: string[] };
          return {
            xp: old.xp ?? 0,
            completedNodes: old.completedNodes ?? [],
          };
        }
        return persisted;
      },
    },
  ),
);
