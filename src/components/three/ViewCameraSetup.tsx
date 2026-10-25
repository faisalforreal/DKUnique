"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motionConfig } from "@/config/motion";

interface ViewCameraSetupProps {
  position?: [number, number, number];
  target?: [number, number, number];
  fov?: number;
}

/**
 * Ensures the R3F Drei View camera is oriented at the exact three-quarter side view
 * configured in src/config/motion.ts (25-35 degrees off fan axis, slightly above,
 * making motor housing and wall plate clearly visible).
 */
export function ViewCameraSetup({
  position = motionConfig.hero.camera.position,
  target = motionConfig.hero.camera.target,
  fov = motionConfig.hero.camera.fov,
}: ViewCameraSetupProps) {
  const { camera } = useThree();
  const targetVec = useRef(new THREE.Vector3(...target));

  useEffect(() => {
    targetVec.current.set(...target);
    camera.position.set(...position);
    if ("fov" in camera) {
      (camera as THREE.PerspectiveCamera).fov = fov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(targetVec.current);
  }, [camera, position, target, fov]);

  useFrame(() => {
    camera.position.set(...position);
    camera.lookAt(targetVec.current);
  });

  return null;
}
