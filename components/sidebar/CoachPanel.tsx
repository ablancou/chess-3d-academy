"use client";

import { Bot, Lightbulb, Loader2, MessageSquare, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useGameStore } from "@/stores/game-store";
import { QUALITY_LABELS, type MoveQuality } from "@/lib/chess/engine/coach";
import { cn } from "@/lib/utils";

const QUALITY_STYLES: Record<MoveQuality, string> = {
  brilliant: "text-cyan-300 bg-cyan-500/10 border-cyan-400/30",
  best: "text-emerald-300 bg-emerald-500/10 border-emerald-400/30",
  excellent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  good: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  book: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  inaccuracy: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  mistake: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  blunder: "text-red-400 bg-red-500/10 border-red-500/20",
};

function EvalBar({ score, mate }: { score: number; mate: number | null }) {
  // Mapea la evaluación a un porcentaje de "ventaja blanca" (50% = igualdad)
  const clamped = Math.max(-8, Math.min(8, score));
  const whitePct =
    mate !== null
      ? mate > 0
        ? 100
        : 0
      : 50 + (clamped / 8) * 45;

  const label =
    mate !== null
      ? `M${Math.abs(mate)}`
      : (score > 0 ? "+" : "") + score.toFixed(1);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>Evaluación</span>
        <span
          className={cn(
            "font-mono font-bold",
            score > 0.3 ? "text-zinc-100" : score < -0.3 ? "text-zinc-400" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-zinc-100 transition-all duration-700"
          style={{ width: `${whitePct}%` }}
        />
        <div className="absolute inset-y-0 left-1/2 w-px bg-sky-500/50" />
      </div>
    </div>
  );
}

export function CoachPanel() {
  const coachEnabled = useGameStore((s) => s.coachEnabled);
  const toggleCoach = useGameStore((s) => s.toggleCoach);
  const coachFeedback = useGameStore((s) => s.coachFeedback);
  const engineEvaluation = useGameStore((s) => s.engineEvaluation);
  const coachHint = useGameStore((s) => s.coachHint);
  const hintLoading = useGameStore((s) => s.hintLoading);
  const requestHint = useGameStore((s) => s.requestHint);
  const status = useGameStore((s) => s.status);
  const mode = useGameStore((s) => s.mode);

  if (mode !== "play") return null;

  const gameOver =
    status === "checkmate" || status === "stalemate" || status === "draw";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="size-4 text-emerald-400" />
            Coach en Tiempo Real
          </CardTitle>
          <Switch checked={coachEnabled} onCheckedChange={(v) => toggleCoach(v)} />
        </div>
      </CardHeader>

      {coachEnabled && (
        <CardContent className="space-y-3">
          {engineEvaluation && (
            <EvalBar score={engineEvaluation.score} mate={engineEvaluation.mate} />
          )}

          {coachFeedback ? (
            <div
              className={cn(
                "flex flex-col gap-2 rounded-md border p-3 text-sm",
                QUALITY_STYLES[coachFeedback.quality],
              )}
            >
              <div className="flex items-center gap-2 font-medium uppercase tracking-wider text-[10px]">
                <MessageSquare className="size-3" />
                {QUALITY_LABELS[coachFeedback.quality]}
                {coachFeedback.delta !== 0 && (
                  <span className="ml-auto font-mono normal-case">
                    {coachFeedback.delta > 0 ? "+" : ""}
                    {coachFeedback.delta.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="leading-relaxed">{coachFeedback.message}</p>
              {coachFeedback.betterMove && (
                <Badge variant="outline" className="w-fit border-current text-xs">
                  Mejor era: {coachFeedback.betterMove}
                </Badge>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-md border border-border bg-accent/30 p-3 text-sm text-muted-foreground">
              <div className="size-2 animate-pulse rounded-full bg-emerald-500" />
              Analizando con Stockfish…
            </div>
          )}

          {coachHint && (
            <div className="flex items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-500/10 p-3 text-sm text-cyan-200">
              <Sparkles className="size-4 shrink-0" />
              <span>
                Pista: <strong>{coachHint.san}</strong>
              </span>
            </div>
          )}

          {!gameOver && (
            <Button
              variant="outline"
              className="w-full"
              disabled={hintLoading}
              onClick={() => requestHint()}
            >
              {hintLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Lightbulb className="size-4" />
              )}
              {hintLoading ? "Pensando…" : "Pedir pista"}
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
