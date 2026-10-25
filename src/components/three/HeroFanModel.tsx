"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface HeroFanModelProps {
  spinSpeed?: number; // radians per second
  bladeOpacity?: number; // 0..1
  ledOpacity?: number; // 0..1
  hologramOpacity?: number; // 0..1
  scale?: number; // physical scale factor
  tiltOffset?: [number, number]; // [tiltX, tiltY]
}

export function HeroFanModel({
  spinSpeed = 8.0,
  bladeOpacity = 1.0,
  ledOpacity = 1.0,
  hologramOpacity = 1.0,
  scale = 1.0,
  tiltOffset = [0, 0],
}: HeroFanModelProps) {
  const rotorRef = useRef<THREE.Group>(null);
  const rootRef = useRef<THREE.Group>(null);
  const hologramRef = useRef<THREE.Group>(null);

  // Generate LED dot coordinates along 4 blades
  const ledPoints = useMemo(() => {
    const coords: number[] = [];
    const colors: number[] = [];
    const ledsPerBlade = 24;
    const bladeLength = 1.05;

    for (let b = 0; b < 4; b++) {
      const angle = (b * Math.PI) / 2;
      for (let i = 0; i < ledsPerBlade; i++) {
        const radius = 0.12 + (i / ledsPerBlade) * bladeLength;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = 0.02;

        coords.push(x, y, z);

        // Core cyan/white additive gradient
        colors.push(0.17, 0.85, 0.9, 1.0); // #2BD9E6
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(coords, 3)
    );
    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 4)
    );
    return geometry;
  }, []);

  // Center Hologram Rings / Particles representing Persistence of Vision
  const hologramGeometry = useMemo(() => {
    const coords: number[] = [];
    const pointCount = 180;
    const baseRadius = 0.42;

    for (let i = 0; i < pointCount; i++) {
      const theta = (i / pointCount) * Math.PI * 2;
      const x = Math.cos(theta) * baseRadius;
      const y = Math.sin(theta) * baseRadius;
      const z = (Math.sin(theta * 3) * 0.05);

      coords.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(coords, 3));
    return geometry;
  }, []);

  useFrame((_, delta) => {
    // Spin rotor
    if (rotorRef.current) {
      rotorRef.current.rotation.z += spinSpeed * delta;
    }

    // Slowly rotate center hologram in reverse for visual parallax
    if (hologramRef.current) {
      hologramRef.current.rotation.z -= spinSpeed * 0.25 * delta;
      hologramRef.current.rotation.y += 0.5 * delta;
    }

    // Smooth lerp tilt toward target mouse tilt offset
    if (rootRef.current) {
      rootRef.current.rotation.x = THREE.MathUtils.lerp(
        rootRef.current.rotation.x,
        tiltOffset[1],
        0.08
      );
      rootRef.current.rotation.y = THREE.MathUtils.lerp(
        rootRef.current.rotation.y,
        tiltOffset[0],
        0.08
      );
    }
  });

  return (
    <group ref={rootRef} scale={scale}>
      {/* 1. Stationary Central Motor Housing */}
      <mesh position={[0, 0, -0.06]}>
        <cylinderGeometry args={[0.16, 0.18, 0.12, 32]} />
        <meshStandardMaterial
          color="#0F1115"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* 2. Rotating Hub & 4 Blades */}
      <group ref={rotorRef}>
        {/* Hub Face Plate */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.03, 32]} />
          <meshStandardMaterial
            color="#14171D"
            roughness={0.3}
            metalness={0.7}
            transparent
            opacity={bladeOpacity}
          />
        </mesh>

        {/* 4 Carbon/Plastic Blades */}
        {[0, 1, 2, 3].map((idx) => {
          const rotationAngle = (idx * Math.PI) / 2;
          return (
            <group key={idx} rotation={[0, 0, rotationAngle]}>
              <mesh position={[0.62, 0, 0]}>
                <boxGeometry args={[1.05, 0.065, 0.008]} />
                <meshStandardMaterial
                  color="#0A0C10"
                  roughness={0.5}
                  metalness={0.4}
                  transparent
                  opacity={bladeOpacity}
                />
              </mesh>
            </group>
          );
        })}

        {/* Discrete LED Emitter Dots along each blade */}
        <points geometry={ledPoints}>
          <pointsMaterial
            size={0.032}
            color="#2BD9E6"
            blending={THREE.AdditiveBlending}
            transparent
            opacity={ledOpacity}
            depthWrite={false}
          />
        </points>
      </group>

      {/* 3. Floating Center Persistence-of-Vision Hologram (Additive Shader Projection) */}
      <group ref={hologramRef} position={[0, 0, 0.05]}>
        {/* Hologram Rings */}
        <points geometry={hologramGeometry}>
          <pointsMaterial
            size={0.038}
            color="#2BD9E6"
            blending={THREE.AdditiveBlending}
            transparent
            opacity={hologramOpacity * 0.85}
            depthWrite={false}
          />
        </points>

        {/* Floating Core 3D Geometry in Center (floating logo projection) */}
        <mesh>
          <octahedronGeometry args={[0.22, 1]} />
          <meshBasicMaterial
            wireframe
            color="#2BD9E6"
            blending={THREE.AdditiveBlending}
            transparent
            opacity={hologramOpacity * 0.75}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}
