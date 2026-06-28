import { JourneyMap } from "@/components/journey/JourneyMap";

export default function JourneyPage() {
  return (
    <div className="flex h-[100dvh] w-full flex-col bg-[#030712]">
      <header className="flex items-center justify-between border-b border-white/5 bg-[#080d1a] px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-zinc-100">Camino de Aprendizaje</h1>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <JourneyMap />
      </main>
    </div>
  );
}
