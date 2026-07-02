"use client";

import {
  Award,
  BookOpen,
  Crown,
  Flame,
  GraduationCap,
  Library,
  Move,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { ACHIEVEMENTS } from "@/lib/progression/achievements";
import { useProgressStore } from "@/stores/progress-store";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  swords: Swords,
  "graduation-cap": GraduationCap,
  crown: Crown,
  target: Target,
  zap: Zap,
  "book-open": BookOpen,
  library: Library,
  sparkles: Sparkles,
  flame: Flame,
  move: Move,
  shield: Shield,
  trophy: Trophy,
};

export function AchievementsPanel() {
  const unlocked = useProgressStore((s) => s.unlockedAchievements);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Award className="size-5 text-amber-400" />
        <h3 className="font-semibold text-zinc-100">
          Logros ({unlocked.length}/{ACHIEVEMENTS.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlocked.includes(achievement.id);
          const Icon = ICONS[achievement.icon] ?? Award;
          return (
            <div
              key={achievement.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 transition-colors",
                isUnlocked
                  ? "border-amber-500/30 bg-amber-500/10"
                  : "border-white/5 bg-black/20 opacity-60",
              )}
            >
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full border-2",
                  isUnlocked
                    ? "border-amber-400 bg-amber-500/20 text-amber-300"
                    : "border-zinc-700 bg-zinc-800 text-zinc-600",
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    "truncate text-sm font-semibold",
                    isUnlocked ? "text-amber-200" : "text-zinc-400",
                  )}
                >
                  {achievement.title}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {achievement.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
