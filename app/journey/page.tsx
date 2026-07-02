import Link from "next/link";
import { Crown } from "lucide-react";
import { JourneyMap } from "@/components/journey/JourneyMap";
import { ProgressHUD } from "@/components/journey/ProgressHUD";
import { DailyMissions } from "@/components/journey/DailyMissions";
import { AchievementsPanel } from "@/components/journey/AchievementsPanel";
import { AchievementToast } from "@/components/journey/AchievementToast";

export default function JourneyPage() {
  return (
    <div className="flex h-[100dvh] w-full flex-col bg-[#030712]">
      <AchievementToast />
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-[#080d1a] px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <Crown className="size-4 text-indigo-400" />
            <span className="text-xs uppercase tracking-wider">Inicio</span>
          </Link>
          <h1 className="text-xl font-bold text-zinc-100">
            Camino de Aprendizaje
          </h1>
        </div>
        <ProgressHUD />
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_20rem]">
          <div className="order-2 lg:order-1">
            <JourneyMap />
          </div>
          <aside className="order-1 space-y-6 lg:order-2 lg:sticky lg:top-0 lg:self-start lg:pt-8">
            <DailyMissions />
            <AchievementsPanel />
          </aside>
        </div>
      </main>
    </div>
  );
}
