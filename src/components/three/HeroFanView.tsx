"use client";

import React, { useState, useEffect } from "react";
import { View } from "@react-three/drei";
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
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -2]} intensity={0.5} />

      <HeroFanModel
        mode="hero"
        tiltOffset={tilt}
        scale={1.1}
      />
    </View>
  );
}
