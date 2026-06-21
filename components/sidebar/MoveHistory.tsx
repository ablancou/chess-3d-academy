"use client";

import type { Move } from "chess.js";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface MoveHistoryProps {
  moves: Move[];
}

function formatMovePairs(moves: Move[]): { number: number; white: string; black?: string }[] {
  const pairs: { number: number; white: string; black?: string }[] = [];

  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i].san,
      black: moves[i + 1]?.san,
    });
  }

  return pairs;
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  const pairs = formatMovePairs(moves);

  if (pairs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No moves yet. Click a piece to begin.
      </p>
    );
  }

  return (
    <ScrollArea className="h-48 pr-3">
      <div className="space-y-1 font-mono text-sm">
        {pairs.map((pair, index) => (
          <div
            key={pair.number}
            className={cn(
              "grid grid-cols-[2rem_1fr_1fr] gap-2 rounded-md px-2 py-1",
              index === pairs.length - 1 && "bg-accent/50",
            )}
          >
            <span className="text-muted-foreground">{pair.number}.</span>
            <span>{pair.white}</span>
            <span className="text-muted-foreground">{pair.black ?? ""}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}