export type MissionKind =
  | "play-games"
  | "complete-lessons"
  | "excellent-moves"
  | "play-moves"
  | "use-hint"
  | "win-checkmate";

export interface MissionDef {
  id: string;
  kind: MissionKind;
  title: string;
  goal: number;
  rewardXP: number;
  rewardGems: number;
}

export interface DailyMission extends MissionDef {
  progress: number;
  completed: boolean;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardGems: number;
  /** Devuelve true si el logro debe desbloquearse con las stats actuales */
  check: (stats: PlayerStats) => boolean;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesCheckmate: number;
  lessonsCompleted: number;
  excellentMoves: number;
  totalMoves: number;
  hintsUsed: number;
  bestStreak: number;
  perfectLessons: number;
}

export type JourneyNodeType = "lesson" | "practice" | "boss";

export interface JourneyNode {
  id: string;
  title: string;
  type: JourneyNodeType;
  /** Solo para nodos tipo "lesson": id de la lección en lib/chess/lessons */
  lessonId?: string;
  description: string;
  xpReward: number;
  x: number;
}

export interface JourneyWorld {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  nodes: JourneyNode[];
}
