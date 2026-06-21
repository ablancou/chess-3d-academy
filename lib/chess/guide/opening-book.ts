import { Chess } from "chess.js";
import { ALL_LESSONS } from "@/lib/chess/lessons";
import type { GuideSuggestion } from "@/lib/chess/lessons/types";

interface BookEntry {
  san: string;
  explanation: string;
  lessonName: string;
  lessonId: string;
}

const openingBook = new Map<string, BookEntry>();

function buildOpeningBook() {
  if (openingBook.size > 0) return;

  for (const lesson of ALL_LESSONS) {
    const chess = new Chess();

    for (const step of lesson.steps) {
      const key = chess.history().join("|");
      const existing = openingBook.get(key);

      if (!existing) {
        openingBook.set(key, {
          san: step.move,
          explanation: step.explanation,
          lessonName: lesson.name,
          lessonId: lesson.id,
        });
      }

      try {
        chess.move(step.move);
      } catch {
        break;
      }
    }
  }
}

export function lookupOpeningBook(
  history: string[],
): (BookEntry & { from: string; to: string }) | null {
  buildOpeningBook();

  const key = history.join("|");
  const entry = openingBook.get(key);
  if (!entry) return null;

  const chess = new Chess();
  for (const san of history) {
    chess.move(san);
  }

  const moves = chess.moves({ verbose: true });
  const match = moves.find((m) => m.san === entry.san);
  if (!match) return null;

  return { ...entry, from: match.from, to: match.to };
}

export function getBookSuggestion(chess: Chess): GuideSuggestion | null {
  const result = lookupOpeningBook(chess.history());
  if (!result) return null;

  return {
    san: result.san,
    from: result.from,
    to: result.to,
    explanation: result.explanation,
    source: "book",
    lessonName: result.lessonName,
  };
}