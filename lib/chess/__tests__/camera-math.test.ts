import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  dramaticMovePose,
  easeOutCubic,
  lerpVec3,
  spectacularOrbitPose,
  squareFocusTarget,
} from "../camera-math";

describe("camera-math", () => {
  it("squareFocusTarget centers on board square", () => {
    const target = squareFocusTarget("e4");
    assert.ok(Math.abs(target[0]) < 1);
    assert.equal(target[1], 0);
    assert.ok(Math.abs(target[2]) < 1);
  });

  it("dramaticMovePose returns elevated camera", () => {
    const pose = dramaticMovePose("e4");
    assert.ok(pose.position[1] > 5);
    assert.ok(pose.target[1] >= 0);
  });

  it("spectacularOrbitPose changes with elapsed time", () => {
    const a = spectacularOrbitPose(0);
    const b = spectacularOrbitPose(5);
    assert.notDeepEqual(a.position, b.position);
  });

  it("lerpVec3 interpolates endpoints", () => {
    assert.deepEqual(lerpVec3([0, 0, 0], [10, 10, 10], 0), [0, 0, 0]);
    assert.deepEqual(lerpVec3([0, 0, 0], [10, 10, 10], 1), [10, 10, 10]);
  });

  it("easeOutCubic reaches 1 at t=1", () => {
    assert.equal(easeOutCubic(1), 1);
    assert.ok(easeOutCubic(0.5) > 0.5);
  });
});