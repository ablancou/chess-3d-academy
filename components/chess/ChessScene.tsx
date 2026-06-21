"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ACESFilmicToneMapping, MOUSE, SRGBColorSpace } from "three";
import { getThemeById } from "@/lib/chess/themes";
import { useThemeStore } from "@/stores/theme-store";
import { ChessBoard } from "./ChessBoard";
import { SceneBackdrop } from "./SceneBackdrop";
import { SceneLighting } from "./SceneLighting";

function SceneContent() {
  const themeId = useThemeStore((s) => s.themeId);
  const theme = getThemeById(themeId);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.mouseButtons = {
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
    controls.enablePan = false;
  }, []);

  return (
    <>
      <SceneBackdrop />
      <SceneLighting scene={theme.scene} />
      <ChessBoard />

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.28}
        scale={12}
        blur={1.8}
        far={6}
        color="#000000"
        resolution={1024}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        minDistance={8}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0, 0]}
      />
    </>
  );
}

export function ChessScene() {
  const themeId = useThemeStore((s) => s.themeId);
  const theme = getThemeById(themeId);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 11, -9], fov: 38, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      className="h-full w-full touch-none"
      style={{ background: theme.scene.backgroundGradient }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
      }}
      onPointerMissed={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <color attach="background" args={[theme.scene.background]} />
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}