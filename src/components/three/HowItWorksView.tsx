"use client";

import React from "react";
import { View } from "@react-three/drei";
import { motionConfig } from "@/config/motion";
import { HeroFanModel } from "./HeroFanModel";

interface HowItWorksViewProps {
  trackRef: React.RefObject<HTMLDivElement | null>;
  progressRef: React.MutableRefObject<number>;
}

export function HowItWorksView({ trackRef, progressRef }: HowItWorksViewProps) {
  return (
    <View track={trackRef as React.MutableRefObject<HTMLElement>}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -2]} intensity={0.5} />

      <HeroFanModel
        mode="how-it-works"
        progressRef={progressRef}
        scale={motionConfig.models.howItWorks.fanScale}
      />
    </View>
  );
}
