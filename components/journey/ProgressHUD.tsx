"use client";

import { useEffect, useState } from "react";
import { Flame, Gem, Heart, Star } from "lucide-react";
import {
  HEART_REFILL_GEM_COST,
  HEART_REGEN_MS,
  MAX_HEARTS,
  useProgressStore,
} from "@/stores/progress-store";
import { cn } from "@/lib/utils";

function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

export function ProgressHUD({ compact = false }: { compact?: boolean }) {
  const xp = useProgressStore((s) => s.xp);
  const gems = useProgressStore((s) => s.gems);
  const hearts = useProgressStore((s) => s.hearts);
  const heartsUpdatedAt = useProgressStore((s) => s.heartsUpdatedAt);
  const streak = useProgressStore((s) => s.streak);
  const tickHearts = useProgressStore((s) => s.tickHearts);
  const refillHeartsWithGems = useProgressStore((s) => s.refillHeartsWithGems);

  // Regenerar corazones periódicamente mientras la UI está montada
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    tickHearts();
    const interval = setInterval(() => {
      tickHearts();
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [tickHearts]);

  const nextHeartIn =
    hearts < MAX_HEARTS ? heartsUpdatedAt + HEART_REGEN_MS - now : null;

  return (
    <div
      className={cn(
        "flex items-center",
        compact ? "gap-3 text-xs" : "gap-4 text-sm",
      )}
    >
      <div className="flex items-center gap-1.5" title="Racha de días seguidos">
        <Flame
          className={cn(
            compact ? "size-4" : "size-5",
            streak > 0 ? "text-orange-400 fill-orange-500/40" : "text-zinc-600",
          )}
        />
        <span className={cn("font-bold", streak > 0 ? "text-orange-300" : "text-zinc-500")}>
          {streak}
        </span>
      </div>

      <button
        type="button"
        className="group flex items-center gap-1.5"
        title={
          hearts >= MAX_HEARTS
            ? "Vidas completas"
            : `Siguiente vida en ${nextHeartIn ? formatCountdown(nextHeartIn) : "…"} · Toca para rellenar con ${HEART_REFILL_GEM_COST} gemas`
        }
        onClick={() => refillHeartsWithGems()}
      >
        <Heart
          className={cn(
            compact ? "size-4" : "size-5",
            hearts > 0 ? "text-rose-400 fill-rose-500/50" : "text-zinc-600",
          )}
        />
        <span className={cn("font-bold", hearts > 0 ? "text-rose-300" : "text-zinc-500")}>
          {hearts}
        </span>
        {!compact && nextHeartIn !== null && (
          <span className="font-mono text-[10px] text-zinc-500">
            {formatCountdown(nextHeartIn)}
          </span>
        )}
      </button>

      <div className="flex items-center gap-1.5" title="Gemas">
        <Gem className={cn(compact ? "size-4" : "size-5", "text-cyan-400 fill-cyan-500/40")} />
        <span className="font-bold text-cyan-300">{gems}</span>
      </div>

      <div className="flex items-center gap-1.5" title="Experiencia total">
        <Star className={cn(compact ? "size-4" : "size-5", "text-yellow-400 fill-yellow-500/40")} />
        <span className="font-bold text-yellow-300">{xp}</span>
        {!compact && <span className="text-[10px] uppercase text-zinc-500">XP</span>}
      </div>
    </div>
  );
}
