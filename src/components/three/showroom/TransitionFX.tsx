"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { smoothstep, clamp01 } from "./timeline";

/**
 * A small additive luminous point where the fan collapses and the butterfly
 * emerges. Scales/fades across [startP, endP].
 */
export function LuminousPoint({
  progressRef,
  startP,
  endP,
  position = [1.6, 0, 0.3] as [number, number, number],
  color = "#D5B77B",
}: {
  progressRef: React.MutableRefObject<number>;
  startP: number;
  endP: number;
  position?: [number, number, number];
  color?: string;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = progressRef.current;
    const t = clamp01((p - startP) / (endP - startP));
    // grow then fade out across the window
    const grow = smoothstep(clamp01(t * 1.4));
    const fade = 1 - smoothstep(clamp01(t * 1.6));
    const s = 0.05 + grow * 0.2;
    if (meshRef.current) {
      meshRef.current.visible = p >= startP && p <= endP;
      meshRef.current.scale.setScalar(s);
    }
    if (matRef.current) matRef.current.opacity = Math.max(0, fade);
  });

  return (
    <mesh ref={meshRef} position={position} visible={false}>
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial
        ref={matRef}
        color={color}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * A horizontal luminous ribbon that sweeps in the travel direction between
 * two storytelling objects, giving transitions a consistent light-trail
 * language without morphing geometries. Scales along X across [startP, endP].
 */
export function LightSweep({
  progressRef,
  startP,
  endP,
  fromX,
  toX,
  color = "#D5B77B",
}: {
  progressRef: React.MutableRefObject<number>;
  startP: number;
  endP: number;
  fromX: number;
  toX: number;
  color?: string;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const p = progressRef.current;
    const t = clamp01((p - startP) / (endP - startP));
    const e = smoothstep(t);
    const midX = (fromX + toX) / 2;
    const len = Math.abs(toX - fromX);
    const dir = Math.sign(toX - fromX);

    if (meshRef.current) {
      meshRef.current.visible = p >= startP && p <= endP;
      meshRef.current.position.x = midX + (1 - e) * (fromX - midX);
      meshRef.current.scale.x = Math.max(0.001, e);
      // slight arc feel via rotation sign
      meshRef.current.rotation.z = dir * 0.05 * (1 - e);
    }
    if (matRef.current) {
      matRef.current.opacity = 0.6 * Math.sin(Math.PI * clamp01(t));
    }
    void len;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.25]} visible={false}>
      <boxGeometry args={[1.6, 0.012, 0.012]} />
      <meshBasicMaterial
        ref={matRef}
        color={color}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
