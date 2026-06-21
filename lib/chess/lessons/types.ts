import type { Color } from "chess.js";

export type LessonCategory = "opening" | "defense";

export interface LessonStep {
  move: string;
  explanation: string;
}

export interface ChessLesson {
  id: string;
  name: string;
  eco: string;
  category: LessonCategory;
  studentColor: Color;
  description: string;
  keyIdeas: string[];
  steps: LessonStep[];
}

export type AppMode = "play" | "lesson";

export interface GuideSuggestion {
  san: string;
  from: string;
  to: string;
  explanation: string;
  source: "lesson" | "book" | "engine";
  lessonName?: string;
  score?: number;
}