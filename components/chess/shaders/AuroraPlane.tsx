"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import type { ShaderMaterial } from "three";

const AuroraShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: [0.4, 0.5, 1.0],
    uColorB: [0.2, 0.8, 1.0],
    uColorC: [0.6, 0.3, 1.0],
    uIntensity: 1.0,
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform float uIntensity;
    varying vec2 vUv;

    float wave(vec2 uv, float speed, float freq) {
      return sin(uv.x * freq + uTime * speed) * cos(uv.y * freq * 0.7 + uTime * speed * 0.6);
    }

    void main() {
      vec2 uv = vUv;
      float w1 = wave(uv, 0.4, 6.0) * 0.5 + 0.5;
      float w2 = wave(uv + 0.3, 0.25, 4.0) * 0.5 + 0.5;
      float w3 = wave(uv - 0.15, 0.55, 8.0) * 0.5 + 0.5;

      vec3 color = mix(uColorA, uColorB, w1);
      color = mix(color, uColorC, w2 * 0.6);
      color += uColorB * w3 * 0.3;

      float fade = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.5, uv.y);
      fade *= smoothstep(0.0, 0.1, uv.x) * smoothstep(1.0, 0.9, uv.x);

      float alpha = (w1 * 0.4 + w2 * 0.3 + w3 * 0.2) * fade * uIntensity;
      gl_FragColor = vec4(color, alpha * 0.55);
    }
  `,
);

extend({ AuroraShaderMaterial });

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

interface AuroraPlaneProps {
  colorA: string;
  colorB: string;
  colorC?: string;
  position?: [number, number, number];
  scale?: [number, number, number];
}

export function AuroraPlane({
  colorA,
  colorB,
  colorC,
  position = [0, 8, -16],
  scale = [1, 1, 1],
}: AuroraPlaneProps) {
  const ref = useRef<ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh position={position} scale={scale} rotation={[0.2, 0, 0]}>
      <planeGeometry args={[50, 30, 1, 1]} />
      {/* @ts-expect-error R3F extended material */}
      <auroraShaderMaterial
        ref={ref}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        uColorA={hexToRgb(colorA)}
        uColorB={hexToRgb(colorB)}
        uColorC={hexToRgb(colorC ?? colorA)}
        uIntensity={1.2}
      />
    </mesh>
  );
}