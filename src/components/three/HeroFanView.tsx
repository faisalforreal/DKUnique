"use client";

import React from "react";
import { View } from "@react-three/drei";
import { HeroFanModel } from "./HeroFanModel";

interface HeroFanViewProps {
  trackRef: React.RefObject<HTMLDivElement | null>;
}

export function HeroFanView({ trackRef }: HeroFanViewProps) {
  return (
    <View track={trackRef as React.MutableRefObject<HTMLElement>}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -2]} intensity={0.5} />

      <HeroFanModel
        mode="hero"
        scale={1.1}
      />
    </View>
  );
}
