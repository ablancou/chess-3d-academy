"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGameStore } from "@/stores/game-store";
import { GuidePanel } from "./GuidePanel";
import { LessonCatalog } from "./LessonCatalog";
import { LessonPanel } from "./LessonPanel";
import { MoveHistory } from "./MoveHistory";
import { ThemePicker } from "./ThemePicker";
import { TurnIndicator } from "./TurnIndicator";

export function GameSidebar() {
  const turn = useGameStore((s) => s.turn);
  const status = useGameStore((s) => s.status);
  const moveHistory = useGameStore((s) => s.moveHistory);
  const mode = useGameStore((s) => s.mode);
  const resetGame = useGameStore((s) => s.resetGame);
  const exitLesson = useGameStore((s) => s.exitLesson);

  return (
    <aside className="flex h-full w-[24rem] shrink-0 flex-col border-l border-border bg-card">
      <div className="border-b border-border px-6 py-5">
        <h1 className="text-lg font-semibold tracking-tight">
          Chess 3D Academy
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Blancas abajo · Negras arriba · Vista estándar
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <GuidePanel />
        <LessonPanel />

        <Tabs defaultValue="play" className="flex flex-1 flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="play">Jugar</TabsTrigger>
            <TabsTrigger value="lessons">Lecciones</TabsTrigger>
          </TabsList>

          <TabsContent value="play" className="mt-4 flex flex-1 flex-col gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Partida</CardTitle>
                <CardDescription>
                  {mode === "lesson"
                    ? "Modo lección activo"
                    : "Partida libre"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TurnIndicator turn={turn} status={status} />
              </CardContent>
            </Card>

            <ThemePicker />

            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Historial</CardTitle>
                <CardDescription>
                  {moveHistory.length} jugada
                  {moveHistory.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MoveHistory moves={moveHistory} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="mt-4">
            <LessonCatalog />
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Clic pieza → clic destino · Clic derecho rota · Scroll zoom
          </p>
          <Button variant="outline" className="w-full" onClick={resetGame}>
            <RotateCcw className="size-4" />
            {mode === "lesson" ? "Reiniciar lección" : "Nueva partida"}
          </Button>
          {mode === "lesson" && (
            <Button variant="ghost" className="w-full" onClick={exitLesson}>
              Salir de lección
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}