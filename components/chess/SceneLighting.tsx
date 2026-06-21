"use client";

import { Environment, Lightformer } from "@react-three/drei";
import type { SceneThemeConfig } from "@/lib/chess/themes";

interface SceneLightingProps {
  scene: SceneThemeConfig;
}

export function SceneLighting({ scene }: SceneLightingProps) {
  return (
    <>
      <ambientLight intensity={scene.ambientIntensity} color="#e2e8f0" />

      <directionalLight
        position={[4, 16, -6]}
        intensity={scene.keyLightIntensity}
        color={scene.keyLightColor}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={40}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0001}
      />

      <directionalLight
        position={[-6, 10, 4]}
        intensity={scene.fillLightIntensity}
        color={scene.fillLightColor}
      />

      <directionalLight
        position={[0, 6, 10]}
        intensity={0.15}
        color={scene.rimLightColor}
      />

      <Environment resolution={512} background={false} environmentIntensity={0.35}>
        <Lightformer
          intensity={2}
          position={[0, 8, -6]}
          scale={[12, 4, 1]}
          color={scene.keyLightColor}
        />
        <Lightformer
          intensity={0.8}
          position={[-8, 4, 2]}
          scale={[4, 8, 1]}
          color={scene.fillLightColor}
        />
        <Lightformer
          intensity={0.4}
          position={[0, 2, 10]}
          scale={[14, 2, 1]}
          color="#1e293b"
        />
      </Environment>
    </>
  );
}