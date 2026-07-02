"use client";

import { Check, Heart, Lock, Play, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { JOURNEY_WORLDS, isNodeUnlocked } from "@/lib/progression/journey";
import type { JourneyNode } from "@/lib/progression/types";
import { useProgressStore } from "@/stores/progress-store";
import { cn } from "@/lib/utils";

const NODE_SPACING = 130;

function nodeHref(node: JourneyNode): string {
  if (node.lessonId) {
    return `/play?lesson=${node.lessonId}&node=${node.id}`;
  }
  return `/play?node=${node.id}`;
}

function WorldSection({
  world,
  completedNodes,
  hearts,
}: {
  world: (typeof JOURNEY_WORLDS)[number];
  completedNodes: string[];
  hearts: number;
}) {
  const completedInWorld = world.nodes.filter((n) =>
    completedNodes.includes(n.id),
  ).length;

  return (
    <section className="mb-10">
      <div
        className="mb-6 rounded-2xl border p-5"
        style={{
          borderColor: `${world.color}33`,
          background: `linear-gradient(135deg, ${world.color}14, transparent 70%)`,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-zinc-100">{world.title}</h2>
            <p className="text-sm text-zinc-400">{world.subtitle}</p>
          </div>
          <div
            className="shrink-0 rounded-full px-3 py-1 text-sm font-bold"
            style={{ color: world.color, background: `${world.color}1a` }}
          >
            {completedInWorld}/{world.nodes.length}
          </div>
        </div>
      </div>

      <div
        className="relative"
        style={{ height: world.nodes.length * NODE_SPACING }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          <path
            d={world.nodes
              .map((node, i) => {
                const y = i * NODE_SPACING + NODE_SPACING / 2;
                return `${i === 0 ? "M" : "L"} ${node.x}% ${y}`;
              })
              .join(" ")}
            fill="none"
            stroke={`${world.color}30`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {world.nodes.map((node, index) => {
          const completed = completedNodes.includes(node.id);
          const unlocked = isNodeUnlocked(node.id, completedNodes);
          const current = unlocked && !completed;
          const needsHearts = node.lessonId !== undefined && hearts === 0;
          const playable = unlocked && !needsHearts;

          return (
            <div
              key={node.id}
              className="absolute flex flex-col items-center gap-2"
              style={{
                left: `${node.x}%`,
                top: index * NODE_SPACING + NODE_SPACING / 2,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <Link
                href={playable ? nodeHref(node) : "#"}
                aria-disabled={!playable}
                onClick={(e) => {
                  if (!playable) e.preventDefault();
                }}
                className={cn(
                  "group relative flex size-16 items-center justify-center rounded-full border-4 shadow-xl transition-all",
                  completed
                    ? "border-emerald-500 bg-emerald-500 hover:scale-105"
                    : current && playable
                      ? "hover:scale-110"
                      : "cursor-not-allowed border-zinc-700 bg-zinc-800 opacity-60",
                )}
                style={
                  current && playable
                    ? {
                        borderColor: world.color,
                        background: world.color,
                        boxShadow: `0 10px 30px ${world.color}66`,
                      }
                    : undefined
                }
                title={
                  needsHearts && current
                    ? "Sin vidas: espera a que se regeneren o canjea gemas"
                    : node.description
                }
              >
                {current && playable && (
                  <div className="absolute -top-12 animate-bounce rounded-xl bg-white px-3 py-1 text-sm font-bold text-zinc-900 shadow-lg">
                    ¡Jugar!
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-white" />
                  </div>
                )}
                {current && needsHearts && (
                  <div className="absolute -top-12 flex items-center gap-1 rounded-xl bg-rose-950 px-3 py-1 text-sm font-bold text-rose-300 shadow-lg">
                    <Heart className="size-3.5" /> Sin vidas
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-rose-950" />
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
                  <Play className="ml-1 size-7 text-white" strokeWidth={2.5} />
                )}

                {current && playable && (
                  <div
                    className="absolute inset-0 -z-10 animate-ping rounded-full border-4 opacity-20"
                    style={{ borderColor: world.color }}
                  />
                )}
              </Link>

              <div className="max-w-44 rounded-full bg-black/60 px-3 py-1 text-center backdrop-blur-sm">
                <span
                  className={cn(
                    "text-sm font-medium",
                    completed
                      ? "text-emerald-400"
                      : current
                        ? "font-bold"
                        : "text-zinc-500",
                  )}
                  style={current && !completed ? { color: world.color } : undefined}
                >
                  {node.title}
                </span>
                <span className="block text-[10px] text-zinc-500">
                  +{node.xpReward} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function JourneyMap() {
  const completedNodes = useProgressStore((s) => s.completedNodes);
  const hearts = useProgressStore((s) => s.hearts);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {JOURNEY_WORLDS.map((world) => (
        <WorldSection
          key={world.id}
          world={world}
          completedNodes={completedNodes}
          hearts={hearts}
        />
      ))}
    </div>
  );
}
