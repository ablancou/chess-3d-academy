"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import { AdditiveBlending } from "three";
import type { Group, Mesh } from "three";
import type { SceneThemeConfig } from "@/lib/chess/themes";
import { AuroraPlane } from "./shaders/AuroraPlane";

interface SceneAtmosphereProps {
  scene: SceneThemeConfig;
}

function EnergyRings({ color }: { color: string }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.15;
  });

  return (
    <group ref={groupRef} position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {[4.5, 5.4, 6.3, 7.2].map((radius, i) => (
        <mesh key={radius}>
          <ringGeometry args={[radius, radius + 0.025, 128]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.06 + i * 0.05}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function OrbitalRings({ color }: { color: string }) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.3;
    ref.current.rotation.z = clock.elapsedTime * 0.08;
  });

  return (
    <group ref={ref} position={[0, 1.5, 0]}>
      {[2.8, 3.4].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2 + i * 0.4, 0, i * 0.6]}>
          <torusGeometry args={[r, 0.012, 8, 128]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15 - i * 0.04}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingParticles({ color }: { color: string }) {
  const count = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 28;
      arr[i * 3 + 1] = Math.random() * 16 + 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 28;
    }
    return arr;
  }, []);

  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.03;
  });

  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color={color}
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export function SceneAtmosphere({ scene }: SceneAtmosphereProps) {
  return (
    <group>
      <fog attach="fog" args={[scene.fog, scene.fogNear, scene.fogFar]} />

      <Stars
        radius={100}
        depth={60}
        count={6000}
        factor={4}
        saturation={0.2}
        fade
        speed={0.6}
      />

      <AuroraPlane
        colorA={scene.accentLightColor}
        colorB={scene.fillLightColor}
        colorC={scene.rimLightColor}
      />

      <AuroraPlane
        colorA={scene.rimLightColor}
        colorB={scene.accentLightColor}
        colorC={scene.fillLightColor}
        position={[-8, 6, -12]}
        scale={[0.6, 0.8, 1]}
      />

      <Sparkles
        count={80}
        scale={[16, 8, 16]}
        size={3}
        speed={0.4}
        opacity={0.5}
        color={scene.accentLightColor}
      />

      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[20, 64]} />
        <meshBasicMaterial
          color={scene.accentLightColor}
          transparent
          opacity={0.06}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <EnergyRings color={scene.accentLightColor} />
      <OrbitalRings color={scene.rimLightColor} />
      <FloatingParticles color={scene.rimLightColor} />

      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.2}>
        <mesh position={[8, 4, -4]}>
          <octahedronGeometry args={[0.45, 0]} />
          <meshBasicMaterial
            color={scene.accentLightColor}
            transparent
            opacity={0.45}
            wireframe
          />
        </mesh>
      </Float>

      <Float speed={1.0} rotationIntensity={0.25} floatIntensity={0.25}>
        <mesh position={[-7, 5, -2]}>
          <icosahedronGeometry args={[0.35, 0]} />
          <meshBasicMaterial
            color={scene.rimLightColor}
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>
      </Float>

      <Float speed={0.7} rotationIntensity={0.3} floatIntensity={0.15}>
        <mesh position={[5, 2.5, 6]}>
          <dodecahedronGeometry args={[0.25, 0]} />
          <meshBasicMaterial
            color={scene.fillLightColor}
            transparent
            opacity={0.35}
            wireframe
          />
        </mesh>
      </Float>
    </group>
  );
}