"use client";

import { Lightbulb, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useGameStore } from "@/stores/game-store";

const SOURCE_LABELS = {
  lesson: "Lección",
  book: "Teoría",
  engine: "Análisis",
} as const;

export function GuidePanel() {
  const guideEnabled = useGameStore((s) => s.guideEnabled);
  const guideSuggestion = useGameStore((s) => s.guideSuggestion);
  const toggleGuide = useGameStore((s) => s.toggleGuide);
  const applyGuideMove = useGameStore((s) => s.applyGuideMove);
  const turn = useGameStore((s) => s.turn);

  return (
    <Card className="border-sky-500/20 bg-sky-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="size-4 text-amber-400" />
            Guía
          </CardTitle>
          <Switch checked={guideEnabled} onCheckedChange={toggleGuide} />
        </div>
        <CardDescription>
          Sugiere la mejor jugada según teoría y principios
        </CardDescription>
      </CardHeader>

      {guideEnabled && (
        <CardContent className="space-y-3">
          {guideSuggestion ? (
            <>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-amber-400/40 text-amber-200">
                  {guideSuggestion.san}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {SOURCE_LABELS[guideSuggestion.source]}
                </Badge>
              </div>

              {guideSuggestion.lessonName && (
                <p className="text-xs text-sky-300/80">
                  {guideSuggestion.lessonName}
                </p>
              )}

              <p className="text-sm leading-relaxed text-muted-foreground">
                {guideSuggestion.explanation}
              </p>

              <p className="text-xs text-muted-foreground">
                Resaltado en amarillo en el tablero 3D
                {turn === "w" ? " (juegan blancas)" : " (juegan negras)"}
              </p>

              <Button
                className="w-full"
                onClick={applyGuideMove}
              >
                <Sparkles className="size-4" />
                Aplicar jugada sugerida
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No hay sugerencia para esta posición.
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}