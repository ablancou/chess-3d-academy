const QUALITY_SCORES: Record<string, number> = {
  book: 100,
  brilliant: 100,
  best: 100,
  excellent: 100,
  good: 85,
  inaccuracy: 60,
  mistake: 30,
  blunder: 0,
};

/** Precisión 0-100 a partir de la lista de calidades de jugadas de un color. */
export function calculateAccuracy(qualities: string[]): number {
  if (qualities.length === 0) return 100;
  const total = qualities.reduce(
    (acc, q) => acc + (QUALITY_SCORES[q] ?? 80),
    0,
  );
  return Math.round(total / qualities.length);
}
