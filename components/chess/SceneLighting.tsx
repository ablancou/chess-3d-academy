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
        intensity={0.22}
        color={scene.rimLightColor}
      />

      <pointLight
        position={[0, 8, -4]}
        intensity={scene.accentLightIntensity * 2}
        color={scene.accentLightColor}
        distance={20}
      />

      <spotLight
        position={[0, 14, 0]}
        angle={0.35}
        penumbra={0.8}
        intensity={0.6}
        color={scene.accentLightColor}
        castShadow={false}
      />

      <Environment resolution={512} background={false} environmentIntensity={0.45}>
        <Lightformer
          intensity={2.5}
          position={[0, 8, -6]}
          scale={[14, 5, 1]}
          color={scene.keyLightColor}
        />
        <Lightformer
          intensity={1.2}
          position={[-8, 4, 2]}
          scale={[4, 10, 1]}
          color={scene.fillLightColor}
        />
        <Lightformer
          intensity={0.6}
          position={[0, 2, 10]}
          scale={[16, 3, 1]}
          color={scene.accentLightColor}
        />
        <Lightformer
          intensity={0.4}
          position={[8, 6, -2]}
          scale={[3, 6, 1]}
          color={scene.rimLightColor}
        />
      </Environment>
    </>
  );
}