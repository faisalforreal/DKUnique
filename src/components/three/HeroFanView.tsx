"use client";

import React, { useState, useEffect } from "react";
import { View, Environment, Lightformer } from "@react-three/drei";
import { HeroFanModel } from "./HeroFanModel";
import { motionConfig } from "@/config/motion";

interface HeroFanViewProps {
  trackRef: React.RefObject<HTMLDivElement | null>;
}

export function HeroFanView({ trackRef }: HeroFanViewProps) {
  const [tilt, setTilt] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * motionConfig.hero.tiltSensitivity;
      const y = (e.clientY / innerHeight - 0.5) * motionConfig.hero.tiltSensitivity;
      setTilt([x, y]);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <View track={trackRef as React.MutableRefObject<HTMLElement>}>
      {/* Studio Lighting via Lightformer (no remote HDR / CDN presets) */}
      <Environment>
        <Lightformer
          intensity={1.2}
          position={[0, 4, 3]}
          scale={[10, 5, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={0.8}
          position={[-3, 0, 2]}
          scale={[4, 8, 1]}
          color="#2BD9E6"
        />
        <Lightformer
          intensity={0.5}
          position={[3, -2, 2]}
          scale={[4, 4, 1]}
          color="#5F5B53"
        />
      </Environment>

      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />

      <HeroFanModel
        spinSpeed={motionConfig.hero.idleSpinSpeed}
        bladeOpacity={0.9}
        ledOpacity={1.0}
        hologramOpacity={1.0}
        scale={1.05}
        tiltOffset={tilt}
      />
    </View>
  );
}
