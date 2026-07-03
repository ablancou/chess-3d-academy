"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BookOpen,
  Crown,
  Flame,
  Gem,
  Layers3,
  Map,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroScene } from "./HeroScene";

const FEATURES = [
  {
    icon: Bot,
    title: "Coach Stockfish en vivo",
    description:
      "Evaluación de jugadas al estilo chess.com: brillante, error, imprecisión — con barra de evaluación y pistas del motor.",
  },
  {
    icon: Map,
    title: "Camino Duolingo",
    description:
      "6 mundos, 30 nodos, vidas, rachas, gemas, misiones diarias y 13 logros desbloqueables.",
  },
  {
    icon: BookOpen,
    title: "30 lecciones + ECO offline",
    description:
      "Aperturas y defensas interactivas con detección automática, descripción teórica y jugadas maestras clicables.",
  },
  {
    icon: Gem,
    title: "Cristal 3D cinematográfico",
    description:
      "Piezas de vidrio iridiscente con arcos de movimiento realistas, capturas espectaculares y bloom adaptativo.",
  },
];

const SHOWCASE = [
  { icon: Target, label: "Precisión post-partida" },
  { icon: Flame, label: "Rachas diarias" },
  { icon: Layers3, label: "6 temas futuristas" },
  { icon: Zap, label: "Efectos por jugada" },
];

export function LandingPage() {
  return (
    <div className="landing-scroll relative min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-[#010409] text-white">
      <div className="landing-noise pointer-events-none fixed inset-0 z-50 opacity-[0.04]" />
      <div className="landing-orb landing-orb-1 pointer-events-none fixed z-0" />
      <div className="landing-orb landing-orb-2 pointer-events-none fixed z-0" />
      <div className="landing-orb landing-orb-3 pointer-events-none fixed z-0" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.22),transparent_55%)]" />
      <div className="landing-scanlines pointer-events-none fixed inset-0 z-[1] opacity-[0.03]" />

      {/* Nav — compact on portrait mobile */}
      <nav className="relative z-20 flex items-center justify-between gap-2 px-4 py-4 sm:px-6 md:px-12 max-md:landscape:py-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="landing-glow-box flex size-8 shrink-0 items-center justify-center rounded-lg border border-indigo-500/40 bg-indigo-500/10 sm:size-9">
            <Crown className="size-3.5 text-indigo-300 sm:size-4" />
          </div>
          <span className="truncate font-heading text-xs font-semibold tracking-[0.15em] text-white/90 uppercase sm:text-sm sm:tracking-[0.2em]">
            Chess 3D Academy
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 px-2 text-slate-300 hover:bg-white/5 hover:text-white sm:px-3"
          >
            <Link href="/journey">
              <Trophy className="size-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Aprender</span>
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="landing-cta-glow h-9 border-0 bg-gradient-to-r from-indigo-500 to-sky-500 px-3 text-white hover:from-indigo-400 hover:to-sky-400 sm:h-10 sm:px-5"
          >
            <Link href="/play">
              <span className="sm:mr-1.5">Jugar</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero — portrait: scene arriba; desktop: dos columnas */}
      <section className="relative z-10 grid min-h-[calc(100dvh-4rem)] grid-cols-1 items-center gap-6 px-4 pb-12 sm:px-6 md:min-h-[calc(100vh-5rem)] md:grid-cols-2 md:gap-4 md:px-12 md:pb-16 max-md:landscape:min-h-0 max-md:landscape:grid-cols-[1fr_1.1fr] max-md:landscape:gap-3 max-md:landscape:pb-6">
        <div className="order-2 flex flex-col gap-5 md:order-1 md:gap-8 max-md:landscape:order-2 max-md:landscape:gap-4">
          <div className="landing-fade-up flex items-center gap-2">
            <Sparkles className="size-4 animate-pulse text-indigo-400" />
            <span className="text-[10px] font-medium tracking-[0.2em] text-indigo-300/80 uppercase sm:text-xs sm:tracking-[0.25em]">
              Fase 2 · Coach · Journey · Aperturas
            </span>
          </div>

          <h1 className="landing-fade-up landing-fade-up-delay-1 font-heading text-[clamp(2rem,8vw,4.5rem)] leading-[1.06] font-bold tracking-tight">
            <span className="landing-gradient-text landing-text-shimmer">
              Ajedrez
            </span>
            <br />
            reimaginado en
            <br />
            <span className="landing-gradient-text landing-text-shimmer">
              cristal 3D
            </span>
          </h1>

          <p className="landing-fade-up landing-fade-up-delay-2 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-base md:text-lg">
            Movimientos con arco físico, capturas cinematográficas, coach
            Stockfish y un camino de aprendizaje estilo Duolingo. La experiencia
            más visual del ajedrez.
          </p>

          <div className="landing-fade-up landing-fade-up-delay-3 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="landing-cta-glow h-11 flex-1 border-0 bg-gradient-to-r from-indigo-500 to-sky-500 px-6 text-sm font-semibold text-white hover:from-indigo-400 hover:to-sky-400 sm:flex-none sm:px-8 sm:text-base"
            >
              <Link href="/play">
                Entrar al tablero
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 flex-1 border-indigo-500/30 bg-white/5 text-slate-200 hover:bg-indigo-500/15 sm:flex-none"
            >
              <Link href="/journey">Ver camino</Link>
            </Button>
          </div>

          <div className="landing-fade-up landing-fade-up-delay-4 flex flex-wrap gap-2 sm:gap-3">
            {SHOWCASE.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-[11px] text-slate-400 sm:text-xs"
              >
                <Icon className="size-3.5 text-indigo-400" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="landing-fade-up landing-fade-up-delay-2 relative order-1 h-[42dvh] min-h-[220px] sm:h-[48dvh] md:order-2 md:h-[calc(100vh-8rem)] max-md:landscape:order-1 max-md:landscape:h-[calc(100dvh-5rem)] max-md:landscape:min-h-[180px]">
          <div className="landing-hero-frame absolute -inset-1 rounded-2xl" />
          <div className="absolute inset-0 rounded-2xl border border-indigo-500/15 bg-gradient-to-b from-indigo-500/8 to-transparent backdrop-blur-[2px]" />
          <div className="relative h-full overflow-hidden rounded-2xl">
            <HeroScene />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-2xl bg-gradient-to-t from-[#010409] to-transparent md:h-24" />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 border-t border-white/5 px-4 py-16 sm:px-6 md:px-12 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center md:mb-16">
            <p className="mb-3 text-xs font-medium tracking-[0.3em] text-indigo-400 uppercase">
              Experiencia premium
            </p>
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">
              Gráficos que
              <span className="landing-gradient-text"> hipnotizan.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
              Shaders de aurora, bloom adaptativo al dispositivo, arcos de
              movimiento por tipo de pieza y explosiones en capturas.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="landing-card group rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:border-indigo-500/30 hover:bg-white/[0.05] sm:p-8"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-500/10 transition-all group-hover:border-indigo-400/40 group-hover:bg-indigo-500/20 sm:mb-5 sm:size-12">
                  <feature.icon className="size-5 text-indigo-300" />
                </div>
                <h3 className="font-heading mb-2 text-base font-semibold text-white sm:text-lg">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-4 py-16 sm:px-6 md:px-12 md:py-24">
        <div className="landing-cta-section mx-auto max-w-4xl rounded-3xl border border-indigo-500/25 p-8 text-center backdrop-blur-sm sm:p-12 md:p-16">
          <Crown className="mx-auto mb-5 size-10 text-indigo-400 sm:mb-6 sm:size-12" />
          <h2 className="font-heading mb-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl">
            El tablero te espera
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm text-slate-400 sm:text-base">
            Cada pieza brilla. Cada jugada tiene peso. Cada error te enseña
            algo.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="landing-cta-glow h-12 w-full border-0 bg-gradient-to-r from-indigo-500 to-sky-500 px-8 font-semibold text-white sm:w-auto sm:px-10"
            >
              <Link href="/play">
                Comenzar partida
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-12 w-full text-slate-400 hover:text-white sm:w-auto"
            >
              <Link href="/journey">Explorar el camino</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 px-4 py-8 text-center text-xs text-slate-600 sm:px-6 md:px-12">
        Chess 3D Academy — El futuro del ajedrez educativo
      </footer>
    </div>
  );
}
