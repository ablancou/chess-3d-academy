"use client";

import { useSyncExternalStore } from "react";

export type VisualQuality = "high" | "medium" | "low";

function getQuality(): VisualQuality {
  if (typeof window === "undefined") return "high";
  const w = window.innerWidth;
  const h = window.innerHeight;
  const isPortraitMobile = w < 768 && h > w;
  const isLandscapeMobile = w < 896 && h <= w;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (isPortraitMobile || (coarse && w < 640)) return "low";
  if (isLandscapeMobile || (coarse && w < 1024)) return "medium";
  return "high";
}

function subscribe(cb: () => void) {
  window.addEventListener("resize", cb);
  window.addEventListener("orientationchange", cb);
  return () => {
    window.removeEventListener("resize", cb);
    window.removeEventListener("orientationchange", cb);
  };
}

/** Calidad visual adaptativa: desktop alto, móvil landscape medio, portrait bajo. */
export function useVisualQuality(): VisualQuality {
  return useSyncExternalStore(subscribe, getQuality, () => "high");
}

export function qualityDpr(quality: VisualQuality): [number, number] {
  switch (quality) {
    case "high":
      return [1, 2];
    case "medium":
      return [1, 1.5];
    case "low":
      return [1, 1.25];
  }
}
