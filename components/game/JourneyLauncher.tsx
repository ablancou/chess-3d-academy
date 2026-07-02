"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useGameStore } from "@/stores/game-store";
import { useProgressStore } from "@/stores/progress-store";

/**
 * Lee los parámetros ?lesson= y ?node= de la URL para iniciar
 * automáticamente la lección o el desafío elegido en el mapa del journey.
 */
export function JourneyLauncher() {
  const params = useSearchParams();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    const lessonId = params.get("lesson");
    const nodeId = params.get("node");
    if (!lessonId && !nodeId) return;
    started.current = true;

    const game = useGameStore.getState();
    if (lessonId) {
      const progress = useProgressStore.getState();
      progress.tickHearts();
      if (useProgressStore.getState().hearts === 0) return;
      game.startLesson(lessonId, nodeId ?? undefined);
    } else if (nodeId) {
      game.setJourneyNode(nodeId);
    }
  }, [params]);

  return null;
}
