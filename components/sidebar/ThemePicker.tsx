"use client";

import { Palette } from "lucide-react";
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

export function ThemePicker() {
  const themeId = useThemeStore((s) => s.themeId);
  const setThemeId = useThemeStore((s) => s.setThemeId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Palette className="size-4 text-sky-400" />
          Diseño visual
        </CardTitle>
        <CardDescription>
          6 estilos futuristas con efecto glass
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {CHESS_THEMES.map((theme) => {
          const isActive = theme.id === themeId;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setThemeId(theme.id)}
              className={cn(
                "w-full rounded-lg border p-2.5 text-left transition-all",
                isActive
                  ? "border-sky-400/60 bg-sky-500/10 ring-1 ring-sky-400/30"
                  : "border-border bg-background/50 hover:border-sky-400/30 hover:bg-accent/30",
              )}
            >
              <ThemePreviewSwatch {...theme.preview} />
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{theme.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {theme.description}
                  </p>
                </div>
                {isActive && (
                  <span className="shrink-0 rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-sky-300">
                    Activo
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}