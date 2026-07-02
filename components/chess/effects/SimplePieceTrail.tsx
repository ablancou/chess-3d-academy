"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Line,
  LineBasicMaterial,
} from "three";
import type { Group, Vector3 } from "three";

interface SimplePieceTrailProps {
  trailRef: React.RefObject<Vector3[]>;
  isMovingRef: React.RefObject<boolean>;
  color: string;
}

export function SimplePieceTrail({
  trailRef,
  isMovingRef,
  color,
}: SimplePieceTrailProps) {
  const groupRef = useRef<Group>(null);
  const lineRef = useRef<Line | null>(null);
  const opacity = useRef(1);

  useEffect(() => {
    const geometry = new BufferGeometry();
    const material = new LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.85,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    const line = new Line(geometry, material);
    line.visible = false;

    lineRef.current = line;
    const group = groupRef.current;
    group?.add(line);

    return () => {
      group?.remove(line);
      geometry.dispose();
      material.dispose();
      lineRef.current = null;
    };
  }, [color]);

  useFrame((_, delta) => {
    const lineObj = lineRef.current;
    if (!lineObj) return;

    const points = trailRef.current;
    const moving = isMovingRef.current;
    const mat = lineObj.material as LineBasicMaterial;

    if (moving && points && points.length >= 2) {
      opacity.current = 1;
      const positions = new Float32Array(points.length * 3);
      points.forEach((p, i) => {
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y + 0.15;
        positions[i * 3 + 2] = p.z;
      });
      lineObj.geometry.setAttribute("position", new BufferAttribute(positions, 3));
      lineObj.geometry.setDrawRange(0, points.length);
      lineObj.geometry.attributes.position.needsUpdate = true;
      mat.opacity = 0.85;
      lineObj.visible = true;
    } else if (lineObj.visible) {
      opacity.current = Math.max(0, opacity.current - delta * 2.5);
      mat.opacity = 0.85 * opacity.current;
      if (opacity.current <= 0.01) lineObj.visible = false;
    }
  });

  return <group ref={groupRef} />;
}