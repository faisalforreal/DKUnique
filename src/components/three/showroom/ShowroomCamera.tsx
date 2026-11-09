"use client";

import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cameraState } from "./timeline";

interface ShowroomCameraProps {
  progressRef: React.MutableRefObject<number>;
}

/** Progress-driven camera: lerps position, lookAt target and FOV per frame. */
export function ShowroomCamera({ progressRef }: ShowroomCameraProps) {
  const { camera } = useThree();
  const targetVec = useRef(new THREE.Vector3());

  useFrame(() => {
    const state = cameraState(progressRef.current);
    camera.position.set(...state.position);
    targetVec.current.set(...state.target);
    camera.lookAt(targetVec.current);
    if ("fov" in camera) {
      const persp = camera as THREE.PerspectiveCamera;
      if (Math.abs(persp.fov - state.fov) > 0.01) {
        persp.fov = state.fov;
        persp.updateProjectionMatrix();
      }
    }
  });

  return null;
}
