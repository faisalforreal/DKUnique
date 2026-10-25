"use client";

import React, { useState } from "react";
import { View, Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HeroFanModel } from "./HeroFanModel";

interface SizesViewProps {
  trackRef: React.RefObject<HTMLDivElement | null>;
  progressRef: React.MutableRefObject<number>;
}

function DynamicScaleFanScene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const [currentScale, setCurrentScale] = useState(0.4);

  useFrame(() => {
    const p = Math.max(0, Math.min(1, progressRef.current));
    // Scale smoothly from 14cm relative (0.35) to 100cm relative (1.35)
    const targetScale = THREE.MathUtils.lerp(0.35, 1.35, p);
    setCurrentScale(targetScale);
  });

  return (
    <HeroFanModel
      spinSpeed={9.0}
      bladeOpacity={0.8}
      ledOpacity={1.0}
      hologramOpacity={1.0}
      scale={currentScale}
    />
  );
}

export function SizesView({ trackRef, progressRef }: SizesViewProps) {
  return (
    <View track={trackRef as React.MutableRefObject<HTMLElement>}>
      <Environment>
        <Lightformer
          intensity={1.2}
          position={[0, 4, 3]}
          scale={[10, 5, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={0.7}
          position={[-3, 0, 2]}
          scale={[4, 8, 1]}
          color="#2BD9E6"
        />
      </Environment>

      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />

      <DynamicScaleFanScene progressRef={progressRef} />
    </View>
  );
}
