"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import type { Mesh } from "three";
import type { SceneThemeConfig } from "@/lib/chess/themes";

interface SceneBackdropProps {
  scene: SceneThemeConfig;
}

export function SceneBackdrop({ scene }: SceneBackdropProps) {
  const glowRef = useRef<Mesh>(null);
  const glow2Ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (glowRef.current) {
      const mat = glowRef.current.material as { opacity: number };
      mat.opacity = 0.4 + Math.sin(t * 0.3) * 0.12;
    }
    if (glow2Ref.current) {
      const mat = glow2Ref.current.material as { opacity: number };
      mat.opacity = 0.15 + Math.sin(t * 0.5 + 1) * 0.08;
    }
  });

  return (
    <group>
      <mesh position={[0, 4, -20]} receiveShadow>
        <planeGeometry args={[70, 42]} />
        <meshStandardMaterial color="#010409" metalness={0.15} roughness={0.98} />
      </mesh>

      <mesh ref={glowRef} position={[0, 3, -17]}>
        <planeGeometry args={[32, 18]} />
        <meshBasicMaterial
          color={scene.accentLightColor}
          transparent
          opacity={0.4}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={glow2Ref} position={[0, 1, -15]}>
        <planeGeometry args={[20, 10]} />
        <meshBasicMaterial
          color={scene.fillLightColor}
          transparent
          opacity={0.15}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[16, 64]} />
        <meshStandardMaterial
          color="#020617"
          metalness={0.5}
          roughness={0.8}
          transparent
          opacity={0.75}
        />
      </mesh>
    </group>
  );
}