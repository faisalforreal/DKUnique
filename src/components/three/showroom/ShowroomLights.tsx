"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motionConfig } from "@/config/motion";
import { clamp01 } from "./timeline";

/**
 * Cinematic "Midnight Luxury" lighting rig: champagne-gold key, muted-rose
 * rim, cool pearl fill. Intensities subtly rise through the journey so the
 * holographic visuals feel increasingly lit as the showcase approaches.
 */
export function ShowroomLights({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const p = clamp01(progressRef.current);
    const keyBoost = 0.85 + p * 0.3;
    const rimBoost = 0.8 + p * 0.35;
    if (keyRef.current) keyRef.current.intensity = motionConfig.showroom.lights.key.intensity * keyBoost;
    if (rimRef.current) rimRef.current.intensity = motionConfig.showroom.lights.rim.intensity * rimBoost;
  });

  return (
    <>
      <ambientLight intensity={motionConfig.showroom.lights.ambient.intensity} />
      <directionalLight
        ref={keyRef}
        position={motionConfig.showroom.lights.key.position}
        color={motionConfig.showroom.lights.key.color}
        intensity={motionConfig.showroom.lights.key.intensity}
      />
      <directionalLight
        ref={rimRef}
        position={motionConfig.showroom.lights.rim.position}
        color={motionConfig.showroom.lights.rim.color}
        intensity={motionConfig.showroom.lights.rim.intensity}
      />
      <directionalLight
        position={motionConfig.showroom.lights.fill.position}
        color={motionConfig.showroom.lights.fill.color}
        intensity={motionConfig.showroom.lights.fill.intensity}
      />
    </>
  );
}
