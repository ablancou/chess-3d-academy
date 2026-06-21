"use client";

/** Minimal studio cyclorama — clean, no animation. */
export function SceneBackdrop() {
  return (
    <mesh position={[0, 2, 12]} receiveShadow>
      <planeGeometry args={[40, 24]} />
      <meshStandardMaterial
        color="#080d16"
        metalness={0.05}
        roughness={0.95}
      />
    </mesh>
  );
}