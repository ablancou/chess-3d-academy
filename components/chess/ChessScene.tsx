"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ACESFilmicToneMapping, MOUSE, SRGBColorSpace } from "three";
import { useCameraAnimation } from "@/hooks/use-camera-animation";
import { qualityDpr, useVisualQuality } from "@/hooks/use-visual-quality";
import { getThemeById } from "@/lib/chess/themes";
import { useGameStore } from "@/stores/game-store";
import { useThemeStore } from "@/stores/theme-store";
import { ChessBoard } from "./ChessBoard";
import { HolographicGrid } from "./HolographicGrid";
import { EnvironmentManager } from "./EnvironmentManager";
import { SceneEffects } from "./SceneEffects";
import { SceneLighting } from "./SceneLighting";
import type { VisualQuality } from "@/hooks/use-visual-quality";

interface ChessSceneProps {
  autoRotate?: boolean;
  showEffects?: boolean;
}

function SceneContent({
  autoRotate = false,
  showEffects = true,
  quality,
}: ChessSceneProps & { quality: VisualQuality }) {
  const themeId = useThemeStore((s) => s.themeId);
  const theme = getThemeById(themeId);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const spectacularMode = useGameStore((s) => s.spectacularMode);
  const lastMove = useGameStore((s) => s.lastMove);
  const moveTimestamp = useGameStore((s) => s.moveTimestamp);
  const status = useGameStore((s) => s.status);
  const turn = useGameStore((s) => s.turn);
  const fen = useGameStore((s) => s.fen);

  const { userControlsEnabled } = useCameraAnimation({
    controlsRef,
    spectacularMode: spectacularMode && !autoRotate,
    lastMove,
    moveTimestamp,
    status,
    turn,
    chessFen: fen,
    autoRotate,
  });

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.mouseButtons = {
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
    controls.enablePan = false;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.35;
  }, [autoRotate]);

  const shadowRes = quality === "high" ? 2048 : quality === "medium" ? 1024 : 512;

  return (
    <>
      <EnvironmentManager />
      <HolographicGrid color={theme.board.gridGlow} />
      <SceneLighting scene={theme.scene} />
      <ChessBoard />

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={quality === "high" ? 0.42 : 0.32}
        scale={14}
        blur={quality === "high" ? 2.4 : 1.8}
        far={8}
        color="#000000"
        resolution={shadowRes}
      />

      {(userControlsEnabled || autoRotate) && (
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enabled={!autoRotate}
          enablePan={false}
          minDistance={autoRotate ? 10 : quality === "low" ? 9 : 8}
          maxDistance={autoRotate ? 18 : 20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 0, 0]}
        />
      )}

      {showEffects && quality !== "low" && (
        <SceneEffects quality={quality} />
      )}
    </>
  );
}

export function ChessScene({
  autoRotate = false,
  showEffects = true,
}: ChessSceneProps) {
  const themeId = useThemeStore((s) => s.themeId);
  const theme = getThemeById(themeId);
  const quality = useVisualQuality();
  const dpr = qualityDpr(quality);
  const fov = quality === "low" ? 42 : 38;

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ position: [0, 11, 9], fov, near: 0.1, far: 100 }}
      gl={{
        antialias: quality !== "low",
        alpha: false,
        powerPreference: "high-performance",
      }}
      className="h-full w-full touch-none"
      style={{ background: theme.scene.backgroundGradient }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = SRGBColorSpace;
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = quality === "high" ? 1.32 : 1.22;
      }}
      onPointerMissed={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <color attach="background" args={[theme.scene.background]} />
      <Suspense fallback={null}>
        <SceneContent
          autoRotate={autoRotate}
          showEffects={showEffects}
          quality={quality}
        />
      </Suspense>
    </Canvas>
  );
}
