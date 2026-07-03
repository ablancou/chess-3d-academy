"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
  BrightnessContrast,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { VisualQuality } from "@/hooks/use-visual-quality";

interface SceneEffectsProps {
  quality?: VisualQuality;
}

export function SceneEffects({ quality = "high" }: SceneEffectsProps) {
  const bloomIntensity =
    quality === "high" ? 1.45 : quality === "medium" ? 1.15 : 0.85;
  const multisampling = quality === "high" ? 4 : quality === "medium" ? 2 : 0;
  const chromatic = quality === "low" ? 0 : quality === "high" ? 0.0007 : 0.0004;
  const noiseOpacity = quality === "high" ? 0.022 : 0;

  return (
    <EffectComposer multisampling={multisampling}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.12}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={quality === "high" ? 0.8 : 0.65}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[chromatic, chromatic]}
        radialModulation
        modulationOffset={0.12}
      />
      <Noise opacity={noiseOpacity} blendFunction={BlendFunction.OVERLAY} />
      <BrightnessContrast
        brightness={quality === "high" ? 0.03 : 0.01}
        contrast={quality === "high" ? 0.1 : 0.06}
      />
      <Vignette
        eskil={false}
        offset={0.08}
        darkness={quality === "high" ? 0.68 : 0.55}
      />
    </EffectComposer>
  );
}
