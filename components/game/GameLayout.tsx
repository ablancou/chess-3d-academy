"use client";

import dynamic from "next/dynamic";
import { ControlsOverlay } from "@/components/game/ControlsOverlay";
import { GameSidebar } from "@/components/sidebar/GameSidebar";

const ChessScene = dynamic(
  () =>
    import("@/components/chess/ChessScene").then((mod) => mod.ChessScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#0d0b09]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
          <p className="text-sm text-muted-foreground">Loading 3D board…</p>
        </div>
      </div>
    ),
  },
);

export function GameLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <main className="relative flex-1">
        <ChessScene />
        <ControlsOverlay />
      </main>
      <GameSidebar />
    </div>
  );
}