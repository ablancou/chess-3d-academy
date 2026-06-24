"use client";

import dynamic from "next/dynamic";
import { ControlsOverlay } from "@/components/game/ControlsOverlay";
import { PromotionPicker } from "@/components/game/PromotionPicker";
import { GameSidebar } from "@/components/sidebar/GameSidebar";

const ChessScene = dynamic(
  () =>
    import("@/components/chess/ChessScene").then((mod) => mod.ChessScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-12 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-400" />
            <div className="absolute inset-0 size-12 animate-ping rounded-full border border-sky-400/20" />
          </div>
          <p className="text-sm tracking-wide text-indigo-300/60">
            Cargando tablero 3D…
          </p>
        </div>
      </div>
    ),
  },
);

export function GameLayout() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#030712] md:flex-row">
      <main className="relative min-h-0 flex-1">
        <ChessScene />
        <ControlsOverlay />
        <PromotionPicker />
      </main>
      <GameSidebar />
    </div>
  );
}