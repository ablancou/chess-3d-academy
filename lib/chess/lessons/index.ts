import { DEFENSE_LESSONS } from "./defenses";
import { OPENING_LESSONS } from "./openings";
import type { ChessLesson, LessonCategory } from "./types";

export const ALL_LESSONS: ChessLesson[] = [
  ...OPENING_LESSONS,
  ...DEFENSE_LESSONS,
];

export function getLessonById(id: string): ChessLesson | undefined {
  return ALL_LESSONS.find((lesson) => lesson.id === id);
}

export function getLessonsByCategory(
  category: LessonCategory,
): ChessLesson[] {
  return ALL_LESSONS.filter((lesson) => lesson.category === category);
}

export * from "./types";
export { OPENING_LESSONS, DEFENSE_LESSONS };