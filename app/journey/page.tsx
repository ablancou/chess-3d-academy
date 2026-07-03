import Link from "next/link";
import { Crown } from "lucide-react";
import { JourneyMap } from "@/components/journey/JourneyMap";
import { ProgressHUD } from "@/components/journey/ProgressHUD";
import { DailyMissions } from "@/components/journey/DailyMissions";
import { AchievementsPanel } from "@/components/journey/AchievementsPanel";
import { AchievementToast } from "@/components/journey/AchievementToast";

export default function JourneyPage() {
  return (
    <div className="safe-area flex h-[100dvh] w-full flex-col bg-[#030712]">
      <AchievementToast />
      <header className="flex flex-col gap-3 border-b border-white/5 bg-[#080d1a] px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 max-md:landscape:flex-row max-md:landscape:py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <Crown className="size-4 text-indigo-400" />
            <span className="text-xs uppercase tracking-wider">Inicio</span>
          </Link>
          <h1 className="truncate text-lg font-bold text-zinc-100 sm:text-xl">
            Camino de Aprendizaje
          </h1>
        </div>
        <ProgressHUD compact />
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-[1fr_20rem] max-md:landscape:grid-cols-[1fr_14rem] max-md:landscape:gap-4 max-md:landscape:py-4">
          <div className="order-2 min-w-0 lg:order-1 max-md:landscape:order-1">
            <JourneyMap />
          </div>
          <aside className="order-1 space-y-4 sm:space-y-6 lg:sticky lg:top-0 lg:order-2 lg:self-start lg:pt-8 max-md:landscape:space-y-3 max-md:landscape:pt-0">
            <DailyMissions />
            <AchievementsPanel />
          </aside>
        </div>
      </main>
    </div>
  );
}
