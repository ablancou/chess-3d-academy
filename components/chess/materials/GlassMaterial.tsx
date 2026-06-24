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
      envMapIntensity={2.2}
      reflectivity={1}
      specularIntensity={1.5}
      sheen={0.8}
      sheenRoughness={0.15}
      sheenColor={config.accent ?? config.color}
      iridescence={0.35}
      iridescenceIOR={1.3}
      iridescenceThicknessRange={[100, 400]}
    />
  );
}