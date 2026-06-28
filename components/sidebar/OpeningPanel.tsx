"use client";

import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGameStore } from "@/stores/game-store";

export function OpeningPanel() {
  const currentOpening = useGameStore((s) => s.currentOpening);
  const openingAlternatives = useGameStore((s) => s.openingAlternatives);
  const mode = useGameStore((s) => s.mode);

  if (mode !== "play" || !currentOpening) return null;

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
          <p className="font-semibold text-sky-100">{currentOpening.name}</p>
          <p className="text-xs text-sky-300">ECO: {currentOpening.eco}</p>
        </div>

        {openingAlternatives.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Mejores alternativas maestras:</p>
            <div className="flex flex-wrap gap-2">
              {openingAlternatives.slice(0, 3).map((alt) => (
                <div
                  key={alt.san}
                  className="rounded bg-accent/50 px-2 py-1 text-xs font-medium border border-white/5"
                >
                  {alt.san}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
