"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Chess } from "chess.js";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Camera } from "three";
import { Vector3 } from "three";
import {
  checkCloseUpPose,
  dramaticMovePose,
  easeInOutCubic,
  easeOutCubic,
  spectacularOrbitPose,
  type CameraPose,
  type Vec3,
} from "@/lib/chess/camera-math";
import { findKingSquare } from "@/lib/chess/move-logic";
import type { GameStatus, LastMove } from "@/lib/chess/types";

const MOVE_ANIM_DURATION = 1.35;
const RESTORE_DURATION = 0.9;
const CHECK_ANIM_DURATION = 1.6;

type AnimPhase = "idle" | "move" | "restore" | "check";

interface UseCameraAnimationOptions {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  spectacularMode: boolean;
  lastMove: LastMove | null;
  moveTimestamp: number;
  status: GameStatus;
  turn: "w" | "b";
  chessFen: string;
  autoRotate?: boolean;
}

function vec3ToVector3(v: Vec3, out: Vector3) {
  out.set(v[0], v[1], v[2]);
  return out;
}

function capturePose(camera: Camera, controls: OrbitControlsImpl): CameraPose {
  return {
    position: [camera.position.x, camera.position.y, camera.position.z],
    target: [controls.target.x, controls.target.y, controls.target.z],
  };
}

function applyPose(
  camera: Camera,
  controls: OrbitControlsImpl,
  pose: CameraPose,
  tmpPos: Vector3,
  tmpTarget: Vector3,
) {
  vec3ToVector3(pose.position, tmpPos);
  vec3ToVector3(pose.target, tmpTarget);
  camera.position.copy(tmpPos);
  controls.target.copy(tmpTarget);
  controls.update();
}

function interpolatePose(from: CameraPose, to: CameraPose, t: number): CameraPose {
  const p = easeInOutCubic(t);
  return {
    position: [
      from.position[0] + (to.position[0] - from.position[0]) * p,
      from.position[1] + (to.position[1] - from.position[1]) * p,
      from.position[2] + (to.position[2] - from.position[2]) * p,
    ],
    target: [
      from.target[0] + (to.target[0] - from.target[0]) * p,
      from.target[1] + (to.target[1] - from.target[1]) * p,
      from.target[2] + (to.target[2] - from.target[2]) * p,
    ],
  };
}

export function useCameraAnimation({
  controlsRef,
  spectacularMode,
  lastMove,
  moveTimestamp,
  status,
  turn,
  chessFen,
  autoRotate = false,
}: UseCameraAnimationOptions) {
  const { camera, clock } = useThree();
  const phase = useRef<AnimPhase>("idle");
  const phaseStart = useRef(0);
  const savedPose = useRef<CameraPose | null>(null);
  const fromPose = useRef<CameraPose | null>(null);
  const toPose = useRef<CameraPose | null>(null);
  const lastHandledTimestamp = useRef(0);
  const tmpPos = useRef(new Vector3());
  const tmpTarget = useRef(new Vector3());

  const beginSequence = (targetPose: CameraPose, nextPhase: AnimPhase) => {
    const controls = controlsRef.current;
    if (!controls) return;
    savedPose.current = capturePose(camera, controls);
    fromPose.current = savedPose.current;
    toPose.current = targetPose;
    phase.current = nextPhase;
    phaseStart.current = clock.elapsedTime;
    controls.enabled = false;
  };

  useEffect(() => {
    if (autoRotate || !lastMove || moveTimestamp === 0) return;
    if (moveTimestamp === lastHandledTimestamp.current) return;
    lastHandledTimestamp.current = moveTimestamp;

    if (spectacularMode) {
      beginSequence(dramaticMovePose(lastMove.to), "move");
      return;
    }

    beginSequence(dramaticMovePose(lastMove.to), "move");
  }, [moveTimestamp, lastMove, spectacularMode, autoRotate, camera, clock, controlsRef]);

  const lastCheckTimestamp = useRef(0);

  useEffect(() => {
    if (autoRotate || !spectacularMode || status !== "check") return;
    if (moveTimestamp === 0 || moveTimestamp === lastCheckTimestamp.current) return;
    lastCheckTimestamp.current = moveTimestamp;

    try {
      const chess = new Chess(chessFen);
      const kingSquare = findKingSquare(chess, turn);
      if (kingSquare) {
        beginSequence(checkCloseUpPose(kingSquare), "check");
      }
    } catch {
      /* invalid fen — skip */
    }
  }, [status, spectacularMode, moveTimestamp, turn, chessFen, autoRotate, camera, clock, controlsRef]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls || autoRotate) return;

    if (spectacularMode) {
      controls.enabled = false;
      controls.enableRotate = false;
      controls.enableZoom = false;

      if (phase.current === "idle") {
        const orbit = spectacularOrbitPose(clock.elapsedTime);
        applyPose(camera, controls, orbit, tmpPos.current, tmpTarget.current);
        return;
      }

      const elapsed = clock.elapsedTime - phaseStart.current;
      const duration =
        phase.current === "check" ? CHECK_ANIM_DURATION : MOVE_ANIM_DURATION;

      if (fromPose.current && toPose.current) {
        const t = Math.min(1, elapsed / duration);
        const pose = interpolatePose(
          fromPose.current,
          toPose.current,
          easeOutCubic(t),
        );
        applyPose(camera, controls, pose, tmpPos.current, tmpTarget.current);

        if (t >= 1) {
          phase.current = "idle";
          fromPose.current = null;
          toPose.current = null;
        }
      }
      return;
    }

    controls.enableRotate = true;
    controls.enableZoom = true;

    if (phase.current === "idle") {
      controls.enabled = true;
      return;
    }

    const elapsed = clock.elapsedTime - phaseStart.current;

    if (phase.current === "move" && fromPose.current && toPose.current) {
      const t = Math.min(1, elapsed / MOVE_ANIM_DURATION);
      const pose = interpolatePose(
        fromPose.current,
        toPose.current,
        easeOutCubic(t),
      );
      applyPose(camera, controls, pose, tmpPos.current, tmpTarget.current);

      if (t >= 1) {
        phase.current = "restore";
        phaseStart.current = clock.elapsedTime;
        fromPose.current = toPose.current;
        toPose.current = savedPose.current;
      }
      return;
    }

    if (phase.current === "restore" && fromPose.current && toPose.current) {
      const t = Math.min(1, elapsed / RESTORE_DURATION);
      const pose = interpolatePose(
        fromPose.current,
        toPose.current,
        easeInOutCubic(t),
      );
      applyPose(camera, controls, pose, tmpPos.current, tmpTarget.current);

      if (t >= 1) {
        phase.current = "idle";
        controls.enabled = true;
        savedPose.current = null;
        fromPose.current = null;
        toPose.current = null;
      }
    }
  });
}