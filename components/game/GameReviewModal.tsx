"use client";

import { useGameStore } from "@/stores/game-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy, XCircle, AlertTriangle, CheckCircle2, Target } from "lucide-react";
import { useProgressStore } from "@/stores/progress-store";
import { useEffect, useState } from "react";

function calculateAccuracy(qualities: string[]) {
  if (qualities.length === 0) return 100;
  
  const scores: Record<string, number> = {
    "book": 100,
    "excellent": 100,
    "good": 85,
    "inaccuracy": 60,
    "mistake": 30,
    "blunder": 0
  };

  const totalScore = qualities.reduce((acc, q) => acc + (scores[q] ?? 80), 0);
  return Math.round(totalScore / qualities.length);
}

function countQualities(qualities: string[], match: string[]) {
  return qualities.filter((q) => match.includes(q)).length;
}

export function GameReviewModal() {
  const status = useGameStore((s) => s.status);
  const mode = useGameStore((s) => s.mode);
  const moveQualities = useGameStore((s) => s.moveQualities);
  const resetGame = useGameStore((s) => s.resetGame);
  const addXP = useProgressStore((s) => s.addXP);
  
  const isGameOver = status === "checkmate" || status === "stalemate" || status === "draw";
  const isCheckmate = status === "checkmate";
  const isDraw = status === "draw" || status === "stalemate";

  const [isOpen, setIsOpen] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  useEffect(() => {
    if (mode === "play" && isGameOver && !isOpen) {
      setIsOpen(true);
      
      // Award XP for finishing a game
      if (!xpAwarded) {
        addXP(50);
        setXpAwarded(true);
      }
    } else if (!isGameOver) {
      setIsOpen(false);
      setXpAwarded(false);
    }
  }, [isGameOver, mode, isOpen, xpAwarded, addXP]);

  if (!isGameOver) return null;

  const whiteAccuracy = calculateAccuracy(moveQualities.w);
  const blackAccuracy = calculateAccuracy(moveQualities.b);

  const StatRow = ({ label, icon: Icon, wCount, bCount, colorClass }: any) => (
    <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
      <div className={`w-8 text-center font-bold ${colorClass}`}>{wCount}</div>
      <div className="flex flex-1 items-center justify-center gap-2 text-zinc-400">
        <Icon className={`size-4 ${colorClass}`} />
        <span>{label}</span>
      </div>
      <div className={`w-8 text-center font-bold ${colorClass}`}>{bCount}</div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] border-indigo-500/20 bg-[#080d1a] text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex flex-col items-center gap-2">
            <Trophy className="size-10 text-yellow-400 mb-2" />
            Fin de la partida
          </DialogTitle>
          <p className="text-center text-zinc-400 text-sm mt-2">
            {isCheckmate ? "¡Jaque Mate!" : 
             isDraw ? "Empate" : "Juego terminado"}
          </p>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Accuracy display */}
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{whiteAccuracy}%</div>
              <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Blancas</div>
            </div>
            
            <div className="flex flex-col items-center">
              <Target className="size-6 text-sky-400 mb-1" />
              <span className="text-xs text-sky-400 font-semibold tracking-widest uppercase">Precisión</span>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-zinc-300">{blackAccuracy}%</div>
              <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Negras</div>
            </div>
          </div>

          {/* Move qualities */}
          <div className="bg-white/5 rounded-xl px-4 py-2">
            <StatRow 
              label="Brillantes / Excelentes" 
              icon={CheckCircle2} 
              wCount={countQualities(moveQualities.w, ["excellent", "book"])} 
              bCount={countQualities(moveQualities.b, ["excellent", "book"])} 
              colorClass="text-emerald-400"
            />
            <StatRow 
              label="Inprecisiones" 
              icon={AlertTriangle} 
              wCount={countQualities(moveQualities.w, ["inaccuracy"])} 
              bCount={countQualities(moveQualities.b, ["inaccuracy"])} 
              colorClass="text-yellow-400"
            />
            <StatRow 
              label="Errores Graves" 
              icon={XCircle} 
              wCount={countQualities(moveQualities.w, ["mistake", "blunder"])} 
              bCount={countQualities(moveQualities.b, ["mistake", "blunder"])} 
              colorClass="text-red-400"
            />
          </div>

          {xpAwarded && (
            <div className="text-center text-sm font-semibold text-yellow-400 animate-pulse">
              +50 XP ganados
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                setIsOpen(false);
                resetGame();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Jugar Nueva Partida
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
