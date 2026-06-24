"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Crown,
  Gem,
  Layers3,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroScene } from "./HeroScene";

const FEATURES = [
  {
    icon: Gem,
    title: "Cristal 3D de última generación",
    description:
      "Vidrio con iridiscencia, refracción física y bloom cinematográfico en cada pieza.",
  },
  {
    icon: Layers3,
    title: "6 temas futuristas",
    description:
      "Auroras animadas, partículas orbitales y atmósferas únicas por tema.",
  },
  {
    icon: BookOpen,
    title: "Academia integrada",
    description:
      "Lecciones de aperturas, defensas y guía inteligente que te enseña mientras juegas.",
  },
  {
    icon: Zap,
    title: "Efectos en tiempo real",
    description:
      "Halos de energía, explosiones de partículas y anillos pulsantes en cada jugada.",
  },
];

const STATS = [
  { value: "3D", label: "Visualización inmersiva" },
  { value: "64", label: "Casillas de cristal" },
  { value: "6", label: "Temas de lujo" },
  { value: "∞", label: "Posibilidades tácticas" },
];

export function LandingPage() {
  return (
    <div className="landing-scroll relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#010409] text-white">
      <div className="landing-noise pointer-events-none fixed inset-0 z-50 opacity-[0.04]" />

      <div className="landing-orb landing-orb-1 pointer-events-none fixed z-0" />
      <div className="landing-orb landing-orb-2 pointer-events-none fixed z-0" />
      <div className="landing-orb landing-orb-3 pointer-events-none fixed z-0" />

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.22),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_70%,rgba(56,189,248,0.1),transparent_50%)]" />
      <div className="landing-scanlines pointer-events-none fixed inset-0 z-[1] opacity-[0.03]" />

      <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-3">
          <div className="landing-glow-box flex size-9 items-center justify-center rounded-lg border border-indigo-500/40 bg-indigo-500/10">
            <Crown className="size-4 text-indigo-300" />
          </div>
          <span className="font-heading text-sm font-semibold tracking-[0.2em] text-white/90 uppercase">
            Chess 3D Academy
          </span>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-indigo-500/40 bg-white/5 text-white backdrop-blur-sm hover:bg-indigo-500/25 hover:text-white"
        >
          <Link href="/play">
            Jugar ahora
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </nav>

      <section className="relative z-10 grid min-h-[calc(100vh-5rem)] grid-cols-1 items-center gap-8 px-6 pb-16 md:grid-cols-2 md:gap-4 md:px-12 lg:gap-8">
        <div className="order-2 flex flex-col gap-8 md:order-1">
          <div className="landing-fade-up flex items-center gap-2">
            <Sparkles className="size-4 animate-pulse text-indigo-400" />
            <span className="text-xs font-medium tracking-[0.25em] text-indigo-300/80 uppercase">
              La nueva era del ajedrez
            </span>
          </div>

          <h1 className="landing-fade-up landing-fade-up-delay-1 font-heading text-4xl leading-[1.08] font-bold tracking-tight md:text-5xl lg:text-7xl">
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

          <p className="landing-fade-up landing-fade-up-delay-2 max-w-lg text-base leading-relaxed text-slate-400 md:text-lg">
            Auroras animadas, piezas de vidrio iridiscente y explosiones de luz
            en cada jugada. El tablero más espectacular que hayas visto.
          </p>

          <div className="landing-fade-up landing-fade-up-delay-3 flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="landing-cta-glow h-12 gap-2 border-0 bg-gradient-to-r from-indigo-500 to-sky-500 px-8 text-base font-semibold text-white hover:from-indigo-400 hover:to-sky-400"
            >
              <Link href="/play">
                Entrar al tablero
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-12 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <a href="#features">Explorar características</a>
            </Button>
          </div>

          <div className="landing-fade-up landing-fade-up-delay-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="landing-stat-card rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 backdrop-blur-sm"
              >
                <p className="font-heading text-2xl font-bold text-indigo-300">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="landing-fade-up landing-fade-up-delay-2 relative order-1 h-[50vh] md:order-2 md:h-[calc(100vh-8rem)]">
          <div className="landing-hero-frame absolute -inset-1 rounded-2xl" />
          <div className="absolute inset-0 rounded-2xl border border-indigo-500/15 bg-gradient-to-b from-indigo-500/8 to-transparent backdrop-blur-[2px]" />
          <div className="relative h-full overflow-hidden rounded-2xl">
            <HeroScene />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-2xl bg-gradient-to-t from-[#010409] to-transparent" />
        </div>
      </section>

      <section
        id="features"
        className="relative z-10 border-t border-white/5 px-6 py-24 md:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-medium tracking-[0.3em] text-indigo-400 uppercase">
              Experiencia premium
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-5xl">
              Gráficos que
              <span className="landing-gradient-text"> hipnotizan.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Shaders de aurora, bloom intenso, halos de energía y partículas
              en cada movimiento. Diseñado para ser el ajedrez más visual del
              mundo.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="landing-card group rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:border-indigo-500/30 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-indigo-500/5"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-indigo-500/25 bg-indigo-500/10 transition-all duration-300 group-hover:border-indigo-400/40 group-hover:bg-indigo-500/20 group-hover:shadow-md group-hover:shadow-indigo-500/20">
                  <feature.icon className="size-5 text-indigo-300" />
                </div>
                <h3 className="font-heading mb-2 text-lg font-semibold text-white">
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

      <section className="relative z-10 px-6 py-24 md:px-12">
        <div className="landing-cta-section mx-auto max-w-4xl rounded-3xl border border-indigo-500/25 p-12 text-center backdrop-blur-sm md:p-16">
          <Crown className="mx-auto mb-6 size-12 text-indigo-400" />
          <h2 className="font-heading mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            El tablero te espera
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-slate-400">
            Entra y siente la diferencia: cada pieza brilla, cada jugada
            explota en luz.
          </p>
          <Button
            asChild
            size="lg"
            className="landing-cta-glow h-14 gap-2 border-0 bg-gradient-to-r from-indigo-500 to-sky-500 px-10 text-base font-semibold text-white hover:from-indigo-400 hover:to-sky-400"
          >
            <Link href="/play">
              Comenzar partida
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center text-xs text-slate-600 md:px-12">
        Chess 3D Academy — El futuro del ajedrez educativo
      </footer>
    </div>
  );
}