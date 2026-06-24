"use client";

import type { PieceSymbol } from "chess.js";
import { Crown, Shield, Swords, Zap } from "lucide-react";
import { useGameStore } from "@/stores/game-store";

const PIECES: { type: PieceSymbol; label: string; icon: typeof Crown }[] = [
  { type: "q", label: "Dama", icon: Crown },
  { type: "r", label: "Torre", icon: Shield },
  { type: "b", label: "Alfil", icon: Zap },
  { type: "n", label: "Caballo", icon: Swords },
];

export function PromotionPicker() {
  const promotionPending = useGameStore((s) => s.promotionPending);
  const completePromotion = useGameStore((s) => s.completePromotion);

  if (!promotionPending) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="pointer-events-auto rounded-2xl border border-indigo-500/30 bg-[#0a0f1e]/95 p-6 shadow-2xl shadow-indigo-500/20">
        <p className="font-heading mb-1 text-center text-lg font-semibold text-white">
          Promoción de peón
        </p>
        <p className="mb-5 text-center text-sm text-indigo-300/70">
          Elige la pieza para {promotionPending.to}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PIECES.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => completePromotion(type)}
              className="flex flex-col items-center gap-2 rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-5 py-4 transition-all hover:border-indigo-400/50 hover:bg-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <Icon className="size-6 text-indigo-300" />
              <span className="text-sm font-medium text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}