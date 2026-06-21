"use client";

import type { GlassMaterialConfig } from "@/lib/chess/themes";

interface GlassMaterialProps {
  config: GlassMaterialConfig;
  variant?: "base" | "accent";
  emissiveBoost?: number;
}

export function GlassMaterial({
  config,
  variant = "base",
  emissiveBoost = 1,
}: GlassMaterialProps) {
  const color =
    variant === "accent" && config.accent ? config.accent : config.color;

  return (
    <meshPhysicalMaterial
      color={color}
      metalness={config.metalness}
      roughness={config.roughness}
      transmission={config.transmission}
      thickness={config.thickness}
      ior={config.ior}
      transparent
      opacity={config.opacity}
      emissive={config.emissive}
      emissiveIntensity={config.emissiveIntensity * emissiveBoost}
      clearcoat={config.clearcoat ?? 1}
      clearcoatRoughness={config.clearcoatRoughness ?? 0.02}
      envMapIntensity={1.6}
      reflectivity={0.9}
      specularIntensity={1.2}
    />
  );
}