"use client";

import React, { useRef } from "react";
import { View, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { HologramModel } from "./HologramModel";
import { HeroFanModel } from "./HeroFanModel";
import { ViewCameraSetup } from "./ViewCameraSetup";
import { motionConfig } from "@/config/motion";

interface HologramStudioViewProps {
  trackRef: React.RefObject<HTMLDivElement | null>;
  domElement?: HTMLElement | null;
  autoSpin: boolean;
  showFan: boolean;
  controlsRef?: React.MutableRefObject<OrbitControlsImpl | null>;
}

export function HologramStudioView({
  trackRef,
  domElement,
  autoSpin,
  showFan,
  controlsRef,
}: HologramStudioViewProps) {
  const localControlsRef = useRef<OrbitControlsImpl | null>(null);

  const setControls = (node: OrbitControlsImpl | null) => {
    localControlsRef.current = node;
    if (controlsRef) {
      controlsRef.current = node;
    }
  };

  return (
    <View track={trackRef as React.MutableRefObject<HTMLElement>}>
      <ViewCameraSetup />
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 5, 5]} intensity={2.0} />
      <directionalLight position={[-4, -3, -3]} intensity={1.0} />
      <directionalLight position={[0, 4, -4]} intensity={1.2} color="#00E5FF" />

      {/* Scoped OrbitControls preventing global scroll interception */}
      <OrbitControls
        ref={setControls}
        domElement={domElement || undefined}
        enableZoom={true}
        enablePan={false}
        minDistance={1.4}
        maxDistance={4.2}
        autoRotate={autoSpin}
        autoRotateSpeed={1.2}
        makeDefault
      />

      {/* Fan Assembly if toggled on */}
      {showFan && (
        <group position={[0, 0, 0]}>
          <HeroFanModel mode="how-it-works" scale={motionConfig.models.studio.fanScale} />
        </group>
      )}

      {/* Floating 3D Hologram Model with clear Z depth separation */}
      <HologramModel
        scale={
          showFan
            ? motionConfig.models.studio.hologramScaleWithFan
            : motionConfig.models.studio.hologramScaleSolo
        }
        position={[0, showFan ? 0 : -0.05, showFan ? 0.25 : 0]}
      />
    </View>
  );
}
