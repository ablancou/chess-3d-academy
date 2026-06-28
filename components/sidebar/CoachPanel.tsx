"use client";

import { MessageSquare, Bot } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGameStore } from "@/stores/game-store";
import { cn } from "@/lib/utils";

export function CoachPanel() {
  const coachEnabled = useGameStore((s) => s.coachEnabled);
  const coachFeedback = useGameStore((s) => s.coachFeedback);
  const mode = useGameStore((s) => s.mode);

  if (!coachEnabled || mode !== "play") return null;

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "good":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "inaccuracy":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "mistake":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "blunder":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "book":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      default:
        return "text-muted-foreground bg-accent/50 border-border";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="size-4 text-emerald-400" />
          Play Coach
        </CardTitle>
      </CardHeader>
      <CardContent>
        {coachFeedback ? (
          <div
            className={cn(
              "flex flex-col gap-2 rounded-md border p-3 text-sm",
              getQualityColor(coachFeedback.quality)
            )}
          >
            <div className="flex items-center gap-2 font-medium uppercase tracking-wider text-[10px]">
              <MessageSquare className="size-3" />
              {coachFeedback.quality}
            </div>
            <p className="leading-relaxed">{coachFeedback.message}</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-md border border-border bg-accent/30 p-3 text-sm text-muted-foreground">
            <div className="size-2 animate-pulse rounded-full bg-emerald-500" />
            Esperando jugada...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
