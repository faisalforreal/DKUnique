"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motionConfig } from "@/config/motion";

interface HeroFanModelProps {
  mode?: "hero" | "how-it-works" | "sizes";
  progressRef?: React.MutableRefObject<number>;
  tiltOffset?: [number, number];
  scale?: number;
}

export function HeroFanModel({
  mode = "hero",
  progressRef,
  tiltOffset = [0, 0],
  scale = 1.0,
}: HeroFanModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Group>(null);
  const hologramRef = useRef<THREE.Group>(null);
  const ledMaterialRef = useRef<THREE.PointsMaterial | THREE.MeshStandardMaterial>(null);

  // Optional override GLB support
  const [overrideScene, setOverrideScene] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/assets/models/hero-fan.glb", { method: "HEAD" })
      .then((res) => {
        if (res.ok && active) {
          import("three-stdlib").then(({ GLTFLoader }) => {
            const loader = new GLTFLoader();
            loader.load(
              "/assets/models/hero-fan.glb",
              (gltf) => {
                if (!active) return;
                const scene = gltf.scene;
                scene.traverse((node) => {
                  if (node.name === "Rotor_Hub") {
                    rotorRef.current = node as THREE.Group;
                  }
                  if ((node as THREE.Mesh).isMesh) {
                    const mesh = node as THREE.Mesh;
                    if (Array.isArray(mesh.material)) {
                      mesh.material.forEach((m) => {
                        if (m.name === "LED") {
                          ledMaterialRef.current = m as THREE.MeshStandardMaterial;
                        }
                      });
                    } else if (mesh.material?.name === "LED") {
                      ledMaterialRef.current = mesh.material as THREE.MeshStandardMaterial;
                    }
                  }
                });
                setOverrideScene(scene);
              },
              undefined,
              () => {}
            );
          });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Discrete LED points running down the 4 blades
  const ledPoints = useMemo(() => {
    const coords: number[] = [];
    const ledsPerBlade = 24;
    const bladeLength = 0.95;

    for (let b = 0; b < 4; b++) {
      const angle = (b * Math.PI) / 2;
      for (let i = 0; i < ledsPerBlade; i++) {
        const radius = 0.16 + (i / ledsPerBlade) * bladeLength;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = 0.025;
        coords.push(x, y, z);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(coords, 3));
    return geometry;
  }, []);

  // Center Persistence-of-Vision Hologram Geometry
  const hologramGeometry = useMemo(() => {
    const coords: number[] = [];
    const pointCount = 180;
    const baseRadius = 0.42;

    for (let i = 0; i < pointCount; i++) {
      const theta = (i / pointCount) * Math.PI * 2;
      const x = Math.cos(theta) * baseRadius;
      const y = Math.sin(theta) * baseRadius;
      const z = Math.sin(theta * 4) * 0.04;
      coords.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(coords, 3));
    return geometry;
  }, []);

  useFrame((_, delta) => {
    let currentSpinSpeed = motionConfig.hero.idleSpinSpeed;
    let currentHoloOpacity = 1.0;
    let targetScale = scale;

    if (mode === "how-it-works" && progressRef) {
      const p = Math.max(0, Math.min(1, progressRef.current));
      const { ranges, spinSpeeds } = motionConfig.howItWorks;

      if (p <= ranges.decelerateEnd) {
        // 0 to 0.3: Spin slows down; blades and LED dots become distinct
        const t = p / ranges.decelerateEnd;
        currentSpinSpeed = THREE.MathUtils.lerp(spinSpeeds.maxSpin, spinSpeeds.minSpin, t);
        currentHoloOpacity = 0;
      } else if (p < ranges.textStepsEnd) {
        // 0.3 to 0.7: Gentle slow spin for reading steps
        currentSpinSpeed = spinSpeeds.minSpin;
        currentHoloOpacity = 0;
      } else {
        // 0.7 to 1.0: Spin speeds up and floating shape forms in the center
        const t = (p - ranges.textStepsEnd) / (ranges.accelerateEnd - ranges.textStepsEnd);
        currentSpinSpeed = THREE.MathUtils.lerp(spinSpeeds.minSpin, spinSpeeds.finalSpin, t);
        currentHoloOpacity = THREE.MathUtils.lerp(0, 1, t);
      }
    } else if (mode === "sizes" && progressRef) {
      const p = Math.max(0, Math.min(1, progressRef.current));
      targetScale = THREE.MathUtils.lerp(0.35, 1.35, p);
      currentSpinSpeed = 9.0;
      currentHoloOpacity = 1.0;
    }

    // 1. Rotate node named Rotor_Hub
    if (rotorRef.current) {
      rotorRef.current.rotation.z += currentSpinSpeed * delta;
    }

    // 2. Center hologram animation
    if (hologramRef.current) {
      hologramRef.current.rotation.z -= currentSpinSpeed * 0.35 * delta;
      hologramRef.current.rotation.y += 0.8 * delta;
      hologramRef.current.scale.setScalar(Math.max(0.001, currentHoloOpacity));
    }

    // 3. Smooth scale and tilt
    if (rootRef.current) {
      rootRef.current.scale.setScalar(targetScale);
      if (mode === "hero") {
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
      } else {
        rootRef.current.rotation.x = 0;
        rootRef.current.rotation.y = 0;
      }
    }
  });

  if (overrideScene) {
    return (
      <group ref={rootRef}>
        <primitive object={overrideScene} />
      </group>
    );
  }

  return (
    <group ref={rootRef} scale={scale}>
      {/* 1. Stationary Motor Base */}
      <mesh name="Motor_Base" position={[0, 0, -0.08]}>
        <cylinderGeometry args={[0.18, 0.22, 0.14, 32]} />
        <meshStandardMaterial color="#222630" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 2. Rotating Hub & 4 Blades (Rotor_Hub) */}
      <group ref={rotorRef} name="Rotor_Hub">
        {/* Hub Face Plate */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.04, 32]} />
          <meshStandardMaterial color="#181B22" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.022]}>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial color="#3D4452" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* 4 Blades: Blade_01, Blade_02, Blade_03, Blade_04 */}
        {[
          { name: "Blade_01", angle: 0 },
          { name: "Blade_02", angle: Math.PI / 2 },
          { name: "Blade_03", angle: Math.PI },
          { name: "Blade_04", angle: (Math.PI * 3) / 2 },
        ].map((b) => (
          <group key={b.name} name={b.name} rotation={[0, 0, b.angle]}>
            {/* Main carbon-black blade body with subtle industrial contrast */}
            <mesh position={[0.58, 0, 0.005]}>
              <boxGeometry args={[0.98, 0.072, 0.012]} />
              <meshStandardMaterial color="#1E222B" roughness={0.4} metalness={0.5} />
            </mesh>
            {/* Blade chamfered edge */}
            <mesh position={[0.58, 0.038, 0.003]}>
              <boxGeometry args={[0.96, 0.006, 0.008]} />
              <meshStandardMaterial color="#2E3442" roughness={0.3} metalness={0.7} />
            </mesh>
            {/* High-visibility LED strip track */}
            <mesh position={[0.62, 0, 0.014]}>
              <boxGeometry args={[0.9, 0.014, 0.004]} />
              <meshBasicMaterial color="#2BD9E6" />
            </mesh>
          </group>
        ))}

        {/* Discrete Glowing LED Dots with material named LED */}
        <points geometry={ledPoints}>
          <pointsMaterial
            ref={ledMaterialRef as React.RefObject<THREE.PointsMaterial>}
            name="LED"
            size={0.065}
            color="#2BD9E6"
            blending={THREE.AdditiveBlending}
            transparent
            depthWrite={false}
          />
        </points>
      </group>

      {/* 3. Center Persistence-of-Vision Hologram (Additive projection) */}
      <group ref={hologramRef} position={[0, 0, 0.08]}>
        {/* Hologram Rings */}
        <points geometry={hologramGeometry}>
          <pointsMaterial
            size={0.055}
            color="#2BD9E6"
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </points>

        {/* Floating Center 3D Octahedron / Core */}
        <mesh>
          <octahedronGeometry args={[0.26, 1]} />
          <meshBasicMaterial
            wireframe
            color="#2BD9E6"
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.8}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}
