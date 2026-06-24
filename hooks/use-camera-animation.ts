"use client";

import { useEffect, useRef, useState } from "react";
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
  controls: OrbitControlsImpl | null,
  pose: CameraPose,
  tmpPos: Vector3,
  tmpTarget: Vector3,
) {
  vec3ToVector3(pose.position, tmpPos);
  vec3ToVector3(pose.target, tmpTarget);
  camera.position.copy(tmpPos);
  if (controls) controls.target.copy(tmpTarget);
  camera.lookAt(tmpTarget);
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

function resetAnimState(
  phase: React.RefObject<AnimPhase>,
  savedPose: React.RefObject<CameraPose | null>,
  fromPose: React.RefObject<CameraPose | null>,
  toPose: React.RefObject<CameraPose | null>,
) {
  phase.current = "idle";
  savedPose.current = null;
  fromPose.current = null;
  toPose.current = null;
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
}: UseCameraAnimationOptions): { userControlsEnabled: boolean } {
  const { camera, clock } = useThree();
  const [userControlsEnabled, setUserControlsEnabled] = useState(true);
  const phase = useRef<AnimPhase>("idle");
  const phaseStart = useRef(0);
  const savedPose = useRef<CameraPose | null>(null);
  const fromPose = useRef<CameraPose | null>(null);
  const toPose = useRef<CameraPose | null>(null);
  const lastHandledTimestamp = useRef(0);
  const pendingCheck = useRef(false);
  const prevSpectacular = useRef(spectacularMode);
  const tmpPos = useRef(new Vector3());
  const tmpTarget = useRef(new Vector3());

  const beginSequence = (targetPose: CameraPose, nextPhase: AnimPhase) => {
    const controls = controlsRef.current;
    fromPose.current = controls
      ? capturePose(camera, controls)
      : {
          position: [camera.position.x, camera.position.y, camera.position.z],
          target: [0, 0, 0],
        };
    toPose.current = targetPose;
    phase.current = nextPhase;
    phaseStart.current = clock.elapsedTime;
    setUserControlsEnabled(false);
  };

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls || autoRotate) return;

    if (prevSpectacular.current !== spectacularMode) {
      resetAnimState(phase, savedPose, fromPose, toPose);
      pendingCheck.current = false;
      lastHandledTimestamp.current = 0;

      setUserControlsEnabled(!spectacularMode);
      prevSpectacular.current = spectacularMode;
    }
  }, [spectacularMode, autoRotate, controlsRef, camera, clock]);

  useEffect(() => {
    if (autoRotate || !lastMove || moveTimestamp === 0) return;
    if (moveTimestamp === lastHandledTimestamp.current) return;
    lastHandledTimestamp.current = moveTimestamp;
    pendingCheck.current = spectacularMode && status === "check";

    if (!savedPose.current && !spectacularMode) {
      const controls = controlsRef.current;
      if (controls) savedPose.current = capturePose(camera, controls);
    }

    beginSequence(dramaticMovePose(lastMove.to), "move");
  }, [moveTimestamp, lastMove, spectacularMode, status, autoRotate, camera, clock, controlsRef]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls || autoRotate) return;

    if (spectacularMode) {
      if (phase.current === "idle") {
        applyPose(
          camera,
          controls,
          spectacularOrbitPose(clock.elapsedTime),
          tmpPos.current,
          tmpTarget.current,
        );
        return;
      }

      const elapsed = clock.elapsedTime - phaseStart.current;
      const duration =
        phase.current === "check" ? CHECK_ANIM_DURATION : MOVE_ANIM_DURATION;

      if (fromPose.current && toPose.current) {
        const t = Math.min(1, elapsed / duration);
        applyPose(
          camera,
          controls,
          interpolatePose(fromPose.current, toPose.current, easeOutCubic(t)),
          tmpPos.current,
          tmpTarget.current,
        );

        if (t >= 1) {
          if (phase.current === "move" && pendingCheck.current) {
            pendingCheck.current = false;
            try {
              const chess = new Chess(chessFen);
              const kingSquare = findKingSquare(chess, turn);
              if (kingSquare) {
                beginSequence(checkCloseUpPose(kingSquare), "check");
                return;
              }
            } catch {
              /* skip */
            }
          }
          phase.current = "idle";
          fromPose.current = null;
          toPose.current = null;
        }
      }
      return;
    }

    if (phase.current === "idle") {
      if (!userControlsEnabled) setUserControlsEnabled(true);
      return;
    }

    const elapsed = clock.elapsedTime - phaseStart.current;

    if (phase.current === "move" && fromPose.current && toPose.current) {
      const t = Math.min(1, elapsed / MOVE_ANIM_DURATION);
      applyPose(
        camera,
        controls,
        interpolatePose(fromPose.current, toPose.current, easeOutCubic(t)),
        tmpPos.current,
        tmpTarget.current,
      );

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
      applyPose(
        camera,
        controls,
        interpolatePose(fromPose.current, toPose.current, easeInOutCubic(t)),
        tmpPos.current,
        tmpTarget.current,
      );

      if (t >= 1) {
        resetAnimState(phase, savedPose, fromPose, toPose);
        setUserControlsEnabled(true);
        controlsRef.current?.update();
      }
    }
  });

  return { userControlsEnabled: spectacularMode ? false : userControlsEnabled };
}