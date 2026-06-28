"use client";

import { Palette, Lock, Image as ImageIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CHESS_THEMES } from "@/lib/chess/themes";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/theme-store";
import { useProgressStore } from "@/stores/progress-store";
import type { EnvironmentId } from "@/stores/theme-store";

function ThemePreviewSwatch({
  light,
  dark,
  white,
  black,
}: {
  light: string;
  dark: string;
  white: string;
  black: string;
}) {
  return (
    <div className="grid h-10 w-full grid-cols-4 overflow-hidden rounded-md border border-white/10">
      <div style={{ background: light }} className="relative">
        <div
          className="absolute bottom-0.5 left-0.5 size-2.5 rounded-full border border-white/20"
          style={{ background: white }}
        />
      </div>
      <div style={{ background: dark }} className="relative">
        <div
          className="absolute bottom-0.5 right-0.5 size-2.5 rounded-full border border-white/20"
          style={{ background: black }}
        />
      </div>
      <div
        className="col-span-2"
        style={{
          background: `linear-gradient(135deg, ${light}40, ${dark} 60%, ${white}30)`,
        }}
      />
    </div>
  );
}

const ENVIRONMENTS: { id: EnvironmentId; name: string; description: string; xp: number }[] = [
  { id: "cyber", name: "Academia Cyber", description: "Entorno 3D abstracto", xp: 0 },
  { id: "mexico-beach", name: "Playa Cancún", description: "Caribe Mexicano (HDRI)", xp: 500 },
  { id: "italy-beach", name: "Costa Amalfitana", description: "Italia al atardecer (HDRI)", xp: 1000 },
];

const THEME_XP_REQUIREMENTS: Record<string, number> = {
  "arctic-glass": 0,
  "neon-hologram": 0,
  "sapphire-matrix": 200,
  "cyber-frost": 400,
  "aurora-prism": 800,
  "deep-ocean": 1500
};

export function ThemePicker() {
  const themeId = useThemeStore((s) => s.themeId);
  const setThemeId = useThemeStore((s) => s.setThemeId);
  const environmentId = useThemeStore((s) => s.environmentId);
  const setEnvironmentId = useThemeStore((s) => s.setEnvironmentId);
  const currentXP = useProgressStore((s) => s.xp);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="size-4 text-emerald-400" />
            Entorno 3D
          </CardTitle>
          <CardDescription>Fondos inmersivos desbloqueables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {ENVIRONMENTS.map((env) => {
            const isActive = env.id === environmentId;
            const isLocked = currentXP < env.xp;
            return (
              <button
                key={env.id}
                type="button"
                onClick={() => {
                  if (!isLocked) setEnvironmentId(env.id);
                }}
                disabled={isLocked}
                className={cn(
                  "w-full rounded-lg border p-2.5 text-left transition-all",
                  isActive
                    ? "border-emerald-400/60 bg-emerald-500/10 ring-1 ring-emerald-400/30"
                    : isLocked
                    ? "border-white/5 bg-black/40 opacity-50 cursor-not-allowed"
                    : "border-border bg-background/50 hover:border-emerald-400/30 hover:bg-accent/30",
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium flex items-center gap-2">
                      {env.name}
                      {isLocked && <Lock className="size-3 text-red-400" />}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {env.description}
                    </p>
                  </div>
                  {isActive ? (
                    <span className="shrink-0 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-300">
                      Activo
                    </span>
                  ) : isLocked ? (
                    <span className="shrink-0 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wider text-red-400 flex items-center gap-1">
                      {env.xp} XP
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="size-4 text-sky-400" />
            Diseño visual
          </CardTitle>
          <CardDescription>
            Estilos futuristas desbloqueables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {CHESS_THEMES.map((theme) => {
            const isActive = theme.id === themeId;
            const requiredXP = THEME_XP_REQUIREMENTS[theme.id] || 0;
            const isLocked = currentXP < requiredXP;
            
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  if (!isLocked) setThemeId(theme.id);
                }}
                disabled={isLocked}
                className={cn(
                  "w-full rounded-lg border p-2.5 text-left transition-all",
                  isActive
                    ? "border-sky-400/60 bg-sky-500/10 ring-1 ring-sky-400/30"
                    : isLocked
                    ? "border-white/5 bg-black/40 opacity-50 cursor-not-allowed"
                    : "border-border bg-background/50 hover:border-sky-400/30 hover:bg-accent/30",
                )}
              >
                <div className={isLocked ? "grayscale opacity-50" : ""}>
                  <ThemePreviewSwatch {...theme.preview} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium flex items-center gap-2">
                      {theme.name}
                      {isLocked && <Lock className="size-3 text-red-400" />}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {theme.description}
                    </p>
                  </div>
                  {isActive ? (
                    <span className="shrink-0 rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-sky-300">
                      Activo
                    </span>
                  ) : isLocked ? (
                    <span className="shrink-0 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium tracking-wider text-red-400 flex items-center gap-1">
                      {requiredXP} XP
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}