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

export function SceneEffects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={1.35}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.85}
        mipmapBlur
        radius={0.75}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0006, 0.0006]}
        radialModulation
        modulationOffset={0.15}
      />
      <Noise opacity={0.025} blendFunction={BlendFunction.OVERLAY} />
      <BrightnessContrast brightness={0.02} contrast={0.08} />
      <Vignette eskil={false} offset={0.1} darkness={0.65} />
    </EffectComposer>
  );
}