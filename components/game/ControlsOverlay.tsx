"use client";

import { MousePointerClick, Move3d, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";

export function ControlsOverlay() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setDismissed(true);
    }
  }, []);

  if (dismissed) return null;

  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-10 max-w-xs md:bottom-6 md:left-6 md:max-w-sm">
      <div className="pointer-events-auto rounded-xl border border-indigo-500/25 bg-[#0a0f1e]/85 p-4 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
        <p className="mb-3 font-heading text-sm font-semibold text-white">
          Cómo mover las piezas
        </p>
        <p className="mb-3 text-xs text-indigo-300/70">
          Las blancas juegan desde tu lado (fila 1 abajo). Las negras están al
          frente.
        </p>
        <ul className="space-y-2 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <MousePointerClick className="mt-0.5 size-3.5 shrink-0 text-indigo-400" />
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
            <Move3d className="mt-0.5 size-3.5 shrink-0 text-indigo-400" />
            <span>
              <strong className="text-foreground">Clic derecho:</strong> rotar
              cámara
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ZoomIn className="mt-0.5 size-3.5 shrink-0 text-indigo-400" />
            <span>
              <strong className="text-foreground">Scroll:</strong> zoom
            </span>
          </li>
        </ul>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="mt-3 text-xs text-indigo-400 transition-colors hover:text-indigo-300"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}