"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { View, PerformanceMonitor } from "@react-three/drei";

interface CanvasManagerProps {
  children?: React.ReactNode;
}

export function CanvasManager({ children }: CanvasManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState(1.5);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);

      // Check for basic WebGL support
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) setHasWebGL(false);
      } catch {
        setHasWebGL(false);
      }

      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  if (!hasWebGL || prefersReducedMotion) {
    return <div ref={containerRef}>{children}</div>;
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* The ONE fixed R3F canvas covering the whole viewport */}
      <Canvas
        className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
        eventSource={containerRef}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.5)}
        />
        <View.Port />
      </Canvas>

      {/* Page HTML Content tracking DOM views */}
      {children}
    </div>
  );
}
