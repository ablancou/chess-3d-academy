"use client";

import { Badge } from "@/components/ui/badge";
import { getStatusLabel } from "@/lib/chess/game-status";
import type { GameStatus } from "@/lib/chess/types";
import { cn } from "@/lib/utils";

interface TurnIndicatorProps {
  turn: "w" | "b";
  status: GameStatus;
}

export function TurnIndicator({ turn, status }: TurnIndicatorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Current turn</span>
        <Badge
          variant="outline"
          className={cn(
            "font-medium",
            turn === "w"
              ? "border-amber-200/30 bg-amber-50/10 text-amber-100"
              : "border-zinc-500/30 bg-zinc-800/50 text-zinc-200",
          )}
        >
          {turn === "w" ? "White" : "Black"}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Status</span>
        <Badge
          variant={status === "check" ? "destructive" : "secondary"}
          className="font-medium"
        >
          {getStatusLabel(status)}
        </Badge>
      </div>
    </div>
  );
}