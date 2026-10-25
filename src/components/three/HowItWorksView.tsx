"use client";

import React, { useState } from "react";
import { View, Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HeroFanModel } from "./HeroFanModel";
import { motionConfig } from "@/config/motion";

interface HowItWorksViewProps {
  trackRef: React.RefObject<HTMLDivElement | null>;
  progressRef: React.MutableRefObject<number>;
}

function DynamicFanScene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const [spinSpeed, setSpinSpeed] = useState(motionConfig.howItWorks.spinSpeeds.maxSpin);
  const [hologramOpacity, setHologramOpacity] = useState(0);

  const { ranges, spinSpeeds } = motionConfig.howItWorks;

  useFrame(() => {
    const p = Math.max(0, Math.min(1, progressRef.current));

    let currentSpeed = spinSpeeds.minSpin;
    let currentHolo = 0;

    if (p <= ranges.decelerateEnd) {
      // 0 to 0.3: Decelerate spin from max to min
      const t = p / ranges.decelerateEnd;
      currentSpeed = THREE.MathUtils.lerp(spinSpeeds.maxSpin, spinSpeeds.minSpin, t);
      currentHolo = 0;
    } else if (p < ranges.textStepsEnd) {
      // 0.3 to 0.7: Gentle slow spin, discrete blades and LEDs clearly visible
      currentSpeed = spinSpeeds.minSpin;
      currentHolo = 0;
    } else {
      // 0.7 to 1.0: Accelerate spin up to final speed and reveal center hologram
      const t = (p - ranges.textStepsEnd) / (ranges.accelerateEnd - ranges.textStepsEnd);
      currentSpeed = THREE.MathUtils.lerp(spinSpeeds.minSpin, spinSpeeds.finalSpin, t);
      currentHolo = THREE.MathUtils.lerp(0, 1, t);
    }

    setSpinSpeed(currentSpeed);
    setHologramOpacity(currentHolo);
  });

  return (
    <HeroFanModel
      spinSpeed={spinSpeed}
      bladeOpacity={1.0}
      ledOpacity={1.0}
      hologramOpacity={hologramOpacity}
      scale={1.0}
    />
  );
}

export function HowItWorksView({ trackRef, progressRef }: HowItWorksViewProps) {
  return (
    <View track={trackRef as React.MutableRefObject<HTMLElement>}>
      <Environment>
        <Lightformer
          intensity={1.0}
          position={[0, 4, 3]}
          scale={[10, 5, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={0.6}
          position={[-3, 0, 2]}
          scale={[4, 8, 1]}
          color="#2BD9E6"
        />
      </Environment>

      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />

      <DynamicFanScene progressRef={progressRef} />
    </View>
  );
}
