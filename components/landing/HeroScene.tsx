"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useThemeStore } from "@/stores/theme-store";

const ChessScene = dynamic(
  () =>
    import("@/components/chess/ChessScene").then((mod) => mod.ChessScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-2 border-sky-400/20 border-t-sky-400" />
      </div>
    ),
  },
);

export function HeroScene() {
  const setThemeId = useThemeStore((s) => s.setThemeId);

  useEffect(() => {
    setThemeId("aurora-prism");
  }, [setThemeId]);

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,#030712_75%)]" />
      <ChessScene autoRotate showEffects />
    </div>
  );
}