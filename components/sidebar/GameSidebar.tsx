"use client";

import Link from "next/link";
import { Clapperboard, Crown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { ProgressHUD } from "@/components/journey/ProgressHUD";
import { CoachPanel } from "./CoachPanel";
import { OpeningPanel } from "./OpeningPanel";
import { GuidePanel } from "./GuidePanel";
import { LessonCatalog } from "./LessonCatalog";
import { LessonPanel } from "./LessonPanel";
import { MoveHistory } from "./MoveHistory";
import { ThemePicker } from "./ThemePicker";
import { TurnIndicator } from "./TurnIndicator";
import { MultiplayerPanel } from "./MultiplayerPanel";

export function GameSidebar() {
  const turn = useGameStore((s) => s.turn);
  const status = useGameStore((s) => s.status);
  const moveHistory = useGameStore((s) => s.moveHistory);
  const mode = useGameStore((s) => s.mode);
  const resetGame = useGameStore((s) => s.resetGame);
  const exitLesson = useGameStore((s) => s.exitLesson);
  const spectacularMode = useGameStore((s) => s.spectacularMode);
  const toggleSpectacular = useGameStore((s) => s.toggleSpectacular);

  return (
    <aside className="order-2 flex max-h-[45dvh] w-full shrink-0 flex-col overflow-hidden border-t border-border bg-card md:order-none md:h-full md:max-h-none md:w-[24rem] md:border-t-0 md:border-l max-md:landscape:max-h-none max-md:landscape:w-[17rem]">
      <div className="border-b border-border px-6 py-5">
        <div className="flex items-center justify-between gap-2">
          <Link
            href="/"
            className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Crown className="size-3.5 text-indigo-400 transition-colors group-hover:text-indigo-300" />
            <span className="text-xs tracking-wider uppercase">Inicio</span>
          </Link>
          <Link
            href="/journey"
            className="text-xs tracking-wider uppercase text-muted-foreground transition-colors hover:text-foreground"
          >
            Mapa
          </Link>
        </div>
        <h1 className="mt-3 font-heading text-lg font-semibold tracking-tight">
          Chess 3D Academy
        </h1>
        <div className="mt-2">
          <ProgressHUD compact />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
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

            <MultiplayerPanel />
            <OpeningPanel />
            <CoachPanel />

            <ThemePicker />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clapperboard className="size-4 text-indigo-400" />
                  Modo espectacular
                </CardTitle>
                <CardDescription>
                  Cámara cinematográfica automática con órbitas y close-ups
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {spectacularMode ? "Activo" : "Manual"}
                </span>
                <Switch
                  checked={spectacularMode}
                  onCheckedChange={(v) => toggleSpectacular(v)}
                />
              </CardContent>
            </Card>

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