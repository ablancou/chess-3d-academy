"use client";

import { Check, Lock, Play, Star, Trophy } from "lucide-react";
import { useProgressStore } from "@/stores/progress-store";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface JourneyNode {
  id: string;
  title: string;
  type: "lesson" | "practice" | "boss";
  x: number;
  y: number;
}

const JOURNEY_NODES: JourneyNode[] = [
  { id: "basics-1", title: "Movimiento de Piezas", type: "lesson", x: 50, y: 10 },
  { id: "basics-2", title: "Capturas", type: "practice", x: 30, y: 30 },
  { id: "basics-3", title: "Jaque y Mate", type: "lesson", x: 70, y: 50 },
  { id: "basics-4", title: "Enroque", type: "practice", x: 50, y: 70 },
  { id: "boss-1", title: "Desafío Principiante", type: "boss", x: 50, y: 100 },
  { id: "tactics-1", title: "Ataque Doble", type: "lesson", x: 30, y: 130 },
  { id: "tactics-2", title: "Clavadas", type: "practice", x: 70, y: 150 },
  { id: "openings-1", title: "Principios de Apertura", type: "lesson", x: 50, y: 180 },
];

export function JourneyMap() {
  const { completedNodes, xp } = useProgressStore();

  const isUnlocked = (node: JourneyNode, index: number) => {
    if (index === 0) return true;
    const prevNode = JOURNEY_NODES[index - 1];
    return completedNodes.includes(prevNode.id);
  };

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between rounded-2xl border border-sky-500/20 bg-sky-500/10 p-6">
        <div>
          <h2 className="text-2xl font-bold text-sky-100">Liga Bronce</h2>
          <p className="text-sky-300">Sigue completando lecciones para avanzar</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-sky-950 px-4 py-2 text-lg font-bold text-yellow-400">
          <Star className="size-5 fill-yellow-400" />
          {xp} XP
        </div>
      </div>

      <div className="relative flex min-h-[800px] flex-col py-10" style={{ height: JOURNEY_NODES.length * 120 }}>
        {/* SVG Path connecting nodes */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ zIndex: 0 }}>
          <path
            d={JOURNEY_NODES.map((node, i) => 
              i === 0 ? `M ${node.x}% ${node.y}%` : `L ${node.x}% ${node.y}%`
            ).join(" ")}
            fill="none"
            stroke="rgba(14, 165, 233, 0.2)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {JOURNEY_NODES.map((node, index) => {
          const completed = completedNodes.includes(node.id);
          const unlocked = isUnlocked(node, index);
          const current = unlocked && !completed;
          
          return (
            <div
              key={node.id}
              className="absolute flex flex-col items-center gap-2"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <Link 
                href={unlocked ? "/play" : "#"}
                className={cn(
                  "group relative flex size-16 items-center justify-center rounded-full border-4 shadow-xl transition-all",
                  completed ? "border-emerald-500 bg-emerald-500 hover:scale-105" :
                  current ? "border-sky-400 bg-sky-500 hover:scale-110 shadow-sky-500/50" :
                  "border-zinc-700 bg-zinc-800 cursor-not-allowed opacity-60"
                )}
              >
                {/* Floating highlight for current node */}
                {current && (
                  <div className="absolute -top-12 rounded-xl bg-white px-3 py-1 text-sm font-bold text-sky-900 shadow-lg animate-bounce">
                    ¡Jugar!
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white" />
                  </div>
                )}
                
                {completed ? (
                  <Check className="size-8 text-emerald-950" strokeWidth={3} />
                ) : !unlocked ? (
                  <Lock className="size-6 text-zinc-500" strokeWidth={3} />
                ) : node.type === "boss" ? (
                  <Trophy className="size-8 text-white" strokeWidth={2.5} />
                ) : node.type === "lesson" ? (
                  <Star className="size-7 text-white" strokeWidth={2.5} />
                ) : (
                  <Play className="size-7 text-white ml-1" strokeWidth={2.5} />
                )}
                
                {/* Ring effect for current node */}
                {current && (
                  <div className="absolute inset-0 -z-10 rounded-full border-4 border-sky-400 animate-ping opacity-20" />
                )}
              </Link>
              
              <div className="rounded-full bg-black/60 px-3 py-1 backdrop-blur-sm">
                <span className={cn(
                  "whitespace-nowrap text-sm font-medium",
                  completed ? "text-emerald-400" :
                  current ? "text-sky-300 font-bold" :
                  "text-zinc-500"
                )}>
                  {node.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
