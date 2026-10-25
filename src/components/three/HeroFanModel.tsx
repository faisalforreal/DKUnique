"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motionConfig } from "@/config/motion";
import { HologramVideoPlane } from "./HologramVideoPlane";

interface HeroFanModelProps {
  mode?: "hero" | "how-it-works" | "sizes";
  progressRef?: React.MutableRefObject<number>;
  tiltOffset?: [number, number];
  scale?: number;
}

// Module-level GLB cache to prevent re-fetching and parse once
let cachedGlbScene: THREE.Group | null = null;
let glbLoadPromise: Promise<THREE.Group | null> | null = null;

async function getHeroFanGlbScene(): Promise<THREE.Group | null> {
  if (cachedGlbScene) return cachedGlbScene;
  if (glbLoadPromise) return glbLoadPromise;

  glbLoadPromise = (async () => {
    try {
      const head = await fetch("/assets/models/hero-fan.glb", { method: "HEAD" });
      if (!head.ok) return null;

      const { GLTFLoader } = await import("three-stdlib");
      const loader = new GLTFLoader();

      const gltf = await new Promise<any>((resolve, reject) => {
        loader.load("/assets/models/hero-fan.glb", resolve, undefined, reject);
      });

      const scene = gltf.scene as THREE.Group;
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      // Center XY on hub, keep Z depth as designed (blades face at Z=0, motor base behind)
      scene.position.set(-center.x, -center.y, 0);

      cachedGlbScene = scene;
      return cachedGlbScene;
    } catch {
      return null;
    }
  })();

  return glbLoadPromise;
}

export function HeroFanModel({
  mode = "hero",
  progressRef,
  tiltOffset = [0, 0],
  scale = 1.0,
}: HeroFanModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Object3D | null>(null);
  const proceduralRotorRef = useRef<THREE.Group>(null);
  const hologramRef = useRef<THREE.Group>(null);
  const ledMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const proceduralLedMaterialRef = useRef<THREE.PointsMaterial | null>(null);

  const [instanceScene, setInstanceScene] = useState<THREE.Group | null>(null);
  const [useGlb, setUseGlb] = useState(false);
  const [videoAvailable, setVideoAvailable] = useState<boolean | null>(null);

  // Load and deep-clone the GLB model for this specific view instance
  useEffect(() => {
    let active = true;

    getHeroFanGlbScene().then((rawScene) => {
      if (!active) return;
      if (!rawScene) {
        setUseGlb(false);
        return;
      }

      // Deep clone scene hierarchy and clone materials so each instance is independent
      const clone = rawScene.clone(true);
      const foundLeds: THREE.MeshStandardMaterial[] = [];
      let foundRotor: THREE.Object3D | null = null;

      clone.traverse((node) => {
        if (node.name === "Rotor_Hub") {
          foundRotor = node;
        }
        if ((node as THREE.Mesh).isMesh) {
          const mesh = node as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((m) => m.clone());
          } else if (mesh.material) {
            mesh.material = mesh.material.clone();
          }

          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            if (m && m.name === "LED") {
              const stdMat = m as THREE.MeshStandardMaterial;
              stdMat.emissive = new THREE.Color("#2BD9E6");
              stdMat.emissiveIntensity = 3.5;
              foundLeds.push(stdMat);
            }
          });
        }
      });

      rotorRef.current = foundRotor;
      ledMaterialsRef.current = foundLeds;
      setInstanceScene(clone);
      setUseGlb(true);
    });

    return () => {
      active = false;
    };
  }, []);

  // Discrete LED points running down the 4 procedural blades (fallback model)
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

  // Center Persistence-of-Vision Hologram Geometry (Procedural Fallback when video is missing)
  const hologramGeometry = useMemo(() => {
    const coords: number[] = [];
    const pointCount = 180;
    const baseRadius = 0.28;

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

  // Frame loop: code-driven spin about Z and scroll-throttled LED emissive intensity
  useFrame((_, delta) => {
    let currentSpinSpeed = motionConfig.hero.idleSpinSpeed;
    let currentHoloOpacity = 0;
    let currentHoloZ = motionConfig.hologram.zOffsetInPlane;
    let currentLedIntensity = motionConfig.howItWorks.ledVisibility.emissiveMax;
    let targetScale = scale;

    if (mode === "how-it-works" && progressRef) {
      const p = Math.max(0, Math.min(1, progressRef.current));
      const { ranges, spinSpeeds, ledVisibility } = motionConfig.howItWorks;

      if (p <= ranges.decelerateEnd) {
        // 0 to 0.3: Spin slows down; blades and LED dots become distinct
        const t = p / ranges.decelerateEnd;
        currentSpinSpeed = THREE.MathUtils.lerp(spinSpeeds.maxSpin, spinSpeeds.minSpin, t);
        currentLedIntensity = THREE.MathUtils.lerp(ledVisibility.emissiveMax, ledVisibility.emissiveMin, t);
        currentHoloOpacity = 0;
      } else if (p < ranges.textStepsEnd) {
        // 0.3 to 0.7: Gentle slow spin for reading steps; LEDs visible
        currentSpinSpeed = spinSpeeds.minSpin;
        currentLedIntensity = ledVisibility.emissiveMin;
        currentHoloOpacity = 0;
      } else {
        // 0.7 to 1.0: Spin speeds up and floating hologram forms in the center
        const t = (p - ranges.textStepsEnd) / (ranges.accelerateEnd - ranges.textStepsEnd);
        currentSpinSpeed = THREE.MathUtils.lerp(spinSpeeds.minSpin, spinSpeeds.finalSpin, t);
        currentLedIntensity = THREE.MathUtils.lerp(ledVisibility.emissiveMin, ledVisibility.emissiveMax, t);
        currentHoloOpacity = THREE.MathUtils.lerp(0, 1, t);
        currentHoloZ = motionConfig.hologram.zOffsetInPlane + motionConfig.hologram.riseDistance * t;
      }
    } else if (mode === "sizes" && progressRef) {
      const p = Math.max(0, Math.min(1, progressRef.current));
      targetScale = THREE.MathUtils.lerp(0.35, 1.35, p);
      currentSpinSpeed = 9.0;
      currentHoloOpacity = 0;
      currentLedIntensity = 3.5;
    }

    // 1. Rotate node named Rotor_Hub about Z by code
    const activeRotor = useGlb ? rotorRef.current : proceduralRotorRef.current;
    if (activeRotor) {
      activeRotor.rotation.z += currentSpinSpeed * delta;
    }

    // 2. Throttle material "LED" emissive intensity
    if (useGlb && ledMaterialsRef.current.length > 0) {
      ledMaterialsRef.current.forEach((mat) => {
        mat.emissiveIntensity = currentLedIntensity;
      });
    } else if (proceduralLedMaterialRef.current) {
      proceduralLedMaterialRef.current.opacity = Math.max(0.2, currentLedIntensity / 3.5);
    }

    // 3. Center procedural hologram animation (when video plane is missing or errored)
    if (hologramRef.current) {
      hologramRef.current.position.z = currentHoloZ;
      hologramRef.current.rotation.z -= currentSpinSpeed * 0.35 * delta;
      hologramRef.current.rotation.y += 0.8 * delta;
      hologramRef.current.scale.setScalar(Math.max(0.001, currentHoloOpacity));
    }

    // 4. Smooth scale and tilt
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

  const showHologramPlane = mode === "how-it-works";
  const showProceduralHologram = mode === "how-it-works" && videoAvailable !== true;

  return (
    <group ref={rootRef} scale={scale}>
      {/* GLB Override Model if loaded */}
      {useGlb && instanceScene ? (
        <primitive object={instanceScene} />
      ) : (
        /* Procedural Fan Model with identical node hierarchy */
        <group>
          {/* 1. Stationary Motor Base */}
          <mesh name="Motor_Base" position={[0, 0, -0.08]}>
            <cylinderGeometry args={[0.18, 0.22, 0.14, 32]} />
            <meshStandardMaterial color="#222630" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* 2. Rotating Hub & 4 Blades (Rotor_Hub) */}
          <group ref={proceduralRotorRef} name="Rotor_Hub">
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
                <mesh position={[0.58, 0, 0.005]}>
                  <boxGeometry args={[0.98, 0.072, 0.012]} />
                  <meshStandardMaterial color="#1E222B" roughness={0.4} metalness={0.5} />
                </mesh>
                <mesh position={[0.58, 0.038, 0.003]}>
                  <boxGeometry args={[0.96, 0.006, 0.008]} />
                  <meshStandardMaterial color="#2E3442" roughness={0.3} metalness={0.7} />
                </mesh>
                <mesh position={[0.62, 0, 0.014]}>
                  <boxGeometry args={[0.9, 0.014, 0.004]} />
                  <meshBasicMaterial color="#2BD9E6" />
                </mesh>
              </group>
            ))}

            {/* Discrete Glowing LED Dots with material named LED */}
            <points geometry={ledPoints}>
              <pointsMaterial
                ref={proceduralLedMaterialRef}
                name="LED"
                size={0.065}
                color="#2BD9E6"
                blending={THREE.AdditiveBlending}
                transparent
                depthWrite={false}
              />
            </points>
          </group>
        </group>
      )}

      {/* Hologram Video Plane (mode === "how-it-works", fades in past 0.7, rises slightly) */}
      {showHologramPlane && (
        <HologramVideoPlane
          progressRef={progressRef}
          diameter={0.65}
          isInView={true}
          onVideoAvailable={setVideoAvailable}
        />
      )}

      {/* Procedural Hologram Fallback (active only when video is missing in how-it-works mode) */}
      {showProceduralHologram && (
        <group ref={hologramRef} position={[0, 0, motionConfig.hologram.zOffsetInPlane]}>
          <points geometry={hologramGeometry}>
            <pointsMaterial
              size={0.045}
              color="#2BD9E6"
              blending={THREE.AdditiveBlending}
              transparent
              opacity={0.85}
              depthWrite={false}
            />
          </points>

          <mesh>
            <octahedronGeometry args={[0.22, 1]} />
            <meshBasicMaterial
              wireframe
              color="#2BD9E6"
              blending={THREE.AdditiveBlending}
              transparent
              opacity={0.75}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
