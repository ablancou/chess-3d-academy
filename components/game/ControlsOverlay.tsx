"use client";

import { MousePointerClick, Move3d, ZoomIn } from "lucide-react";
import { useState } from "react";

export function ControlsOverlay() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="pointer-events-none absolute bottom-6 left-6 z-10 max-w-sm">
      <div className="pointer-events-auto rounded-xl border border-sky-500/20 bg-background/80 p-4 shadow-xl backdrop-blur-md">
        <p className="mb-3 text-sm font-semibold text-foreground">
          Cómo mover las piezas
        </p>
        <p className="mb-3 text-xs text-sky-300/80">
          Las blancas juegan desde tu lado (fila 1 abajo). Las negras están al
          frente.
        </p>
        <ul className="space-y-2 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <MousePointerClick className="mt-0.5 size-3.5 shrink-0 text-sky-400" />
            <span>
              <strong className="text-foreground">1.</strong> Clic en tu pieza
              (se eleva, casillas verdes = movimientos legales)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <MousePointerClick className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
            <span>
              <strong className="text-foreground">2.</strong> Clic en casilla
              verde para mover
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Move3d className="mt-0.5 size-3.5 shrink-0 text-sky-400" />
            <span>
              <strong className="text-foreground">Clic derecho:</strong> rotar
              cámara
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ZoomIn className="mt-0.5 size-3.5 shrink-0 text-sky-400" />
            <span>
              <strong className="text-foreground">Scroll:</strong> zoom
            </span>
          </li>
        </ul>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mt-3 text-xs text-sky-400 hover:text-sky-300"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}