"use client";

import { useEffect } from "react";
import { CheckCircle2, Gem, Star, Target } from "lucide-react";
import { useProgressStore } from "@/stores/progress-store";
import { cn } from "@/lib/utils";

export function DailyMissions() {
  const missions = useProgressStore((s) => s.missions);
  const ensureDailyMissions = useProgressStore((s) => s.ensureDailyMissions);

  useEffect(() => {
    ensureDailyMissions();
  }, [ensureDailyMissions]);

  if (missions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Target className="size-5 text-sky-400" />
        <h3 className="font-semibold text-zinc-100">Misiones del día</h3>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => {
          const pct = Math.min(100, (mission.progress / mission.goal) * 100);
          return (
            <div
              key={mission.id}
              className={cn(
                "rounded-xl border p-3 transition-colors",
                mission.completed
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-white/5 bg-black/20",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p
                  className={cn(
                    "text-sm font-medium",
                    mission.completed ? "text-emerald-300" : "text-zinc-200",
                  )}
                >
                  {mission.title}
                </p>
                {mission.completed ? (
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
                ) : (
                  <span className="shrink-0 text-xs font-mono text-zinc-400">
                    {mission.progress}/{mission.goal}
                  </span>
                )}
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    mission.completed ? "bg-emerald-500" : "bg-sky-500",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Star className="size-3 text-yellow-400" />
                  {mission.rewardXP} XP
                </span>
                <span className="flex items-center gap-1">
                  <Gem className="size-3 text-cyan-400" />
                  {mission.rewardGems}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
