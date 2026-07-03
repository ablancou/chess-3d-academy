"use client";

import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { installChessTestBridge } from "@/lib/chess/test-bridge";
import { ControlsOverlay } from "@/components/game/ControlsOverlay";
import { JourneyLauncher } from "@/components/game/JourneyLauncher";
import { PromotionPicker } from "@/components/game/PromotionPicker";
import { GameSidebar } from "@/components/sidebar/GameSidebar";
import { AchievementToast } from "@/components/journey/AchievementToast";
import { CoachEngine } from "@/components/chess/CoachEngine";
import { GameReviewModal } from "@/components/game/GameReviewModal";

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
  useEffect(() => {
    installChessTestBridge();
  }, []);

  return (
    <div className="safe-area flex h-[100dvh] w-full flex-col overflow-hidden bg-[#030712] md:flex-row max-md:landscape:flex-row">
      {/* Tablero: arriba en portrait; izquierda en desktop/landscape */}
      <main className="relative order-1 min-h-[52dvh] min-w-0 flex-1 md:min-h-0 max-md:landscape:min-h-0 max-md:landscape:flex-[1.2]">
        <Suspense fallback={null}>
          <JourneyLauncher />
        </Suspense>
        <AchievementToast />
        <CoachEngine />
        <ChessScene />
        <ControlsOverlay />
        <PromotionPicker />
        <GameReviewModal />
      </main>
      <GameSidebar />
    </div>
  );
}
