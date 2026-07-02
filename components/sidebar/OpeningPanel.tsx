"use client";

import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGameStore } from "@/stores/game-store";
import { detectOpening, getTheoryMoves } from "@/lib/chess/openings/eco-book";

function WinRateBar({ white, draws, black }: { white: number; draws: number; black: number }) {
  const total = white + draws + black;
  if (total === 0) return null;
  const w = (white / total) * 100;
  const d = (draws / total) * 100;
  const b = (black / total) * 100;

  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full">
      <div className="bg-zinc-100" style={{ width: `${w}%` }} title={`Blancas ${w.toFixed(0)}%`} />
      <div className="bg-zinc-500" style={{ width: `${d}%` }} title={`Tablas ${d.toFixed(0)}%`} />
      <div className="bg-zinc-900" style={{ width: `${b}%` }} title={`Negras ${b.toFixed(0)}%`} />
    </div>
  );
}

export function OpeningPanel() {
  const currentOpening = useGameStore((s) => s.currentOpening);
  const openingAlternatives = useGameStore((s) => s.openingAlternatives);
  const moveHistory = useGameStore((s) => s.moveHistory);
  const applySanMove = useGameStore((s) => s.applySanMove);
  const mode = useGameStore((s) => s.mode);

  if (mode !== "play") return null;

  const history = moveHistory.map((m) => m.san);
  const localMatch = detectOpening(history);
  const theoryMoves = getTheoryMoves(history);

  const opening =
    currentOpening ??
    (localMatch ? { eco: localMatch.eco, name: localMatch.name } : null);

  if (!opening) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="size-4 text-sky-400" />
          Apertura Detectada
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-md border border-sky-500/20 bg-sky-500/10 p-3">
          <p className="font-semibold text-sky-100">{opening.name}</p>
          <p className="text-xs text-sky-300">ECO: {opening.eco}</p>
          {localMatch?.description && (
            <p className="mt-2 text-xs leading-relaxed text-sky-200/80">
              {localMatch.description}
            </p>
          )}
        </div>

        {theoryMoves.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Continuaciones teóricas (toca para jugar):
            </p>
            <div className="flex flex-col gap-1.5">
              {theoryMoves.map((tm) => (
                <button
                  key={tm.san}
                  type="button"
                  onClick={() => applySanMove(tm.san)}
                  className="flex items-center justify-between rounded border border-white/5 bg-accent/50 px-2 py-1.5 text-left text-xs transition-colors hover:border-sky-400/40 hover:bg-sky-500/10"
                >
                  <span className="font-semibold text-sky-100">{tm.san}</span>
                  <span className="ml-2 truncate text-muted-foreground">
                    {tm.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {openingAlternatives.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Jugadas de los maestros:
            </p>
            <div className="flex flex-col gap-1.5">
              {openingAlternatives.slice(0, 3).map((alt) => {
                const total = alt.white + alt.draws + alt.black;
                return (
                  <button
                    key={alt.san}
                    type="button"
                    onClick={() => applySanMove(alt.san)}
                    className="rounded border border-white/5 bg-accent/50 px-2 py-1.5 text-left transition-colors hover:border-sky-400/40 hover:bg-sky-500/10"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">{alt.san}</span>
                      <span className="text-muted-foreground">
                        {total.toLocaleString()} partidas
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <WinRateBar white={alt.white} draws={alt.draws} black={alt.black} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
