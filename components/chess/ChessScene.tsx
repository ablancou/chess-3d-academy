"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ACESFilmicToneMapping, MOUSE, SRGBColorSpace } from "three";
import { useCameraAnimation } from "@/hooks/use-camera-animation";
import { getThemeById } from "@/lib/chess/themes";
import { useGameStore } from "@/stores/game-store";
import { useThemeStore } from "@/stores/theme-store";
import { ChessBoard } from "./ChessBoard";
import { HolographicGrid } from "./HolographicGrid";
import { SceneAtmosphere } from "./SceneAtmosphere";
import { SceneBackdrop } from "./SceneBackdrop";
import { SceneEffects } from "./SceneEffects";
import { SceneLighting } from "./SceneLighting";

interface ChessSceneProps {
  autoRotate?: boolean;
  showEffects?: boolean;
}

function SceneContent({
  autoRotate = false,
  showEffects = true,
}: ChessSceneProps) {
  const themeId = useThemeStore((s) => s.themeId);
  const theme = getThemeById(themeId);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const spectacularMode = useGameStore((s) => s.spectacularMode);
  const lastMove = useGameStore((s) => s.lastMove);
  const moveTimestamp = useGameStore((s) => s.moveTimestamp);
  const status = useGameStore((s) => s.status);
  const turn = useGameStore((s) => s.turn);
  const fen = useGameStore((s) => s.fen);

  useCameraAnimation({
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

  return (
    <>
      <SceneAtmosphere scene={theme.scene} />
      <SceneBackdrop scene={theme.scene} />
      <HolographicGrid color={theme.board.gridGlow} />
      <SceneLighting scene={theme.scene} />
      <ChessBoard />

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.35}
        scale={14}
        blur={2.2}
        far={8}
        color="#000000"
        resolution={2048}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        minDistance={autoRotate ? 10 : 8}
        maxDistance={autoRotate ? 18 : 20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0, 0]}
      />

      {showEffects && <SceneEffects />}
    </>
  );
}

export function ChessScene({
  autoRotate = false,
  showEffects = true,
}: ChessSceneProps) {
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
        gl.toneMappingExposure = 1.28;
      }}
      onPointerMissed={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <color attach="background" args={[theme.scene.background]} />
      <Suspense fallback={null}>
        <SceneContent autoRotate={autoRotate} showEffects={showEffects} />
      </Suspense>
    </Canvas>
  );
}