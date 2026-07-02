"use client";

import { useEffect } from "react";
import { Award, Gem } from "lucide-react";
import { getAchievementById } from "@/lib/progression/achievements";
import { useProgressStore } from "@/stores/progress-store";

/**
 * Muestra una notificación flotante cuando se desbloquea un logro.
 * Montar una sola vez por página.
 */
export function AchievementToast() {
  const pendingUnlocks = useProgressStore((s) => s.pendingUnlocks);
  const clearPendingUnlocks = useProgressStore((s) => s.clearPendingUnlocks);

  useEffect(() => {
    if (pendingUnlocks.length === 0) return;
    const timeout = setTimeout(() => clearPendingUnlocks(), 5000);
    return () => clearTimeout(timeout);
  }, [pendingUnlocks, clearPendingUnlocks]);

  const visible = pendingUnlocks;
  if (visible.length === 0) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-50 flex -translate-x-1/2 flex-col gap-2">
      {visible.map((id) => {
        const achievement = getAchievementById(id);
        if (!achievement) return null;
        return (
          <div
            key={id}
            className="flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-[#1a1206]/95 px-5 py-3 shadow-2xl shadow-amber-500/20 backdrop-blur-md animate-in fade-in slide-in-from-top-4"
          >
            <div className="flex size-10 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-500/20">
              <Award className="size-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                ¡Logro desbloqueado!
              </p>
              <p className="text-sm font-bold text-amber-100">
                {achievement.title}
              </p>
              <p className="flex items-center gap-1 text-xs text-cyan-300">
                <Gem className="size-3" />+{achievement.rewardGems} gemas
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
