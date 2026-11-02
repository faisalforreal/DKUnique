"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motionConfig } from "@/config/motion";
import { HologramModel } from "./HologramModel";

interface HeroFanModelProps {
  mode?: "hero" | "how-it-works";
  progressRef?: React.MutableRefObject<number>;
  scale?: number;
  hologramStyleIndex?: number;
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
  scale = 1.0,
  hologramStyleIndex = 0,
}: HeroFanModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Object3D | null>(null);
  const proceduralRotorRef = useRef<THREE.Group>(null);
  const ledMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const glbMaterialsRef = useRef<THREE.Material[]>([]);
  const proceduralMaterialsRef = useRef<THREE.Material[]>([]);
  const proceduralLedMaterialRef = useRef<THREE.PointsMaterial | null>(null);

  // Time & opacity tracking for hero startup sequence
  const timeElapsedRef = useRef(0);
  const heroHoloOpacityRef = useRef(0);
  const howItWorksHoloOpacityRef = useRef(0);

  // Smooth fade-in on initial load to avoid abrupt popping
  const loadFadeRef = useRef(0);

  const [instanceScene, setInstanceScene] = useState<THREE.Group | null>(null);
  const [useGlb, setUseGlb] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  // Procedural fan materials with transparency support (emergency fallback only)
  const proceduralMaterials = useMemo(() => {
    const mats = {
      motorBase: new THREE.MeshStandardMaterial({
        color: "#222630",
        roughness: 0.3,
        metalness: 0.7,
        transparent: true,
      }),
      hubFace: new THREE.MeshStandardMaterial({
        color: "#181B22",
        roughness: 0.3,
        metalness: 0.8,
        transparent: true,
      }),
      hubCenter: new THREE.MeshStandardMaterial({
        color: "#3D4452",
        roughness: 0.2,
        metalness: 0.9,
        transparent: true,
      }),
      bladeBody: new THREE.MeshStandardMaterial({
        color: "#1E222B",
        roughness: 0.4,
        metalness: 0.5,
        transparent: true,
      }),
      bladeRidge: new THREE.MeshStandardMaterial({
        color: "#2E3442",
        roughness: 0.3,
        metalness: 0.7,
        transparent: true,
      }),
      bladeStrip: new THREE.MeshBasicMaterial({
        color: "#2BD9E6",
        transparent: true,
      }),
    };
    proceduralMaterialsRef.current = Object.values(mats);
    return mats;
  }, []);

  // Load and deep-clone the GLB model for this specific view instance
  useEffect(() => {
    let active = true;

    getHeroFanGlbScene().then((rawScene) => {
      if (!active) return;
      if (!rawScene) {
        setLoadFailed(true);
        setUseGlb(false);
        return;
      }

      // Deep clone scene hierarchy and clone materials so each instance is independent
      const clone = rawScene.clone(true);
      const foundLeds: THREE.MeshStandardMaterial[] = [];
      const foundFanMats: THREE.Material[] = [];
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
            if (m) {
              m.transparent = true;
              foundFanMats.push(m);
              if (m.name === "LED") {
                const stdMat = m as THREE.MeshStandardMaterial;
                stdMat.emissive = new THREE.Color("#2BD9E6");
                stdMat.emissiveIntensity = 3.5;
                foundLeds.push(stdMat);
              }
            }
          });
        }
      });

      rotorRef.current = foundRotor;
      ledMaterialsRef.current = foundLeds;
      glbMaterialsRef.current = foundFanMats;
      setInstanceScene(clone);
      setUseGlb(true);
      setLoadFailed(false);
    });

    return () => {
      active = false;
    };
  }, []);

  // Discrete LED points running down the 4 procedural blades (fallback model only)
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

  useFrame((_, delta) => {
    // Smooth fade-in once loaded
    if (instanceScene && loadFadeRef.current < 1.0) {
      loadFadeRef.current = Math.min(1.0, loadFadeRef.current + delta * 3.0);
    }

    let currentSpinSpeed = 0;
    let currentFanOpacity = 1.0;
    let currentHoloOpacity = 0;
    let currentLedIntensity = 1.0;

    if (mode === "hero") {
      timeElapsedRef.current += delta;
      const t = timeElapsedRef.current;

      const stillDuration = motionConfig.hero.startup.stillDuration;
      const spinUpDuration = motionConfig.hero.startup.spinUpDuration;
      const maxSpinSpeed = motionConfig.hero.startup.maxSpinSpeed;
      const fanMinOpacity = motionConfig.hero.startup.fanMinOpacity;
      const fanMaxOpacity = motionConfig.hero.startup.fanMaxOpacity;
      const hologramMinOpacity = motionConfig.hero.startup.hologramMinOpacity;
      const hologramMaxOpacity = motionConfig.hero.startup.hologramMaxOpacity;

      if (t < stillDuration) {
        // 1. Initial still state: fan visible, still, hologram hidden
        currentSpinSpeed = 0;
        currentFanOpacity = fanMaxOpacity;
        currentHoloOpacity = hologramMinOpacity;
        currentLedIntensity = 0.5;
      } else if (t < stillDuration + spinUpDuration) {
        // 2. Spin-up phase: Starts slow and accelerates to full speed
        const progress = Math.min(1, Math.max(0, (t - stillDuration) / spinUpDuration));
        // Smoothstep curve for natural mechanical acceleration
        const ease = progress * progress * (3 - 2 * progress);
        currentSpinSpeed = THREE.MathUtils.lerp(0, maxSpinSpeed, ease);
        // Visibility of fan drops gradually to ~5%
        currentFanOpacity = THREE.MathUtils.lerp(fanMaxOpacity, fanMinOpacity, ease);
        // Visibility of hologram rises from 0 to 100%
        currentHoloOpacity = THREE.MathUtils.lerp(hologramMinOpacity, hologramMaxOpacity, ease);
        currentLedIntensity = THREE.MathUtils.lerp(0.5, motionConfig.howItWorks.ledVisibility.emissiveMax, ease);
      } else {
        // 3. Steady state at full speed: 5% fan opacity, 100% hologram visibility
        currentSpinSpeed = maxSpinSpeed;
        currentFanOpacity = fanMinOpacity;
        currentHoloOpacity = hologramMaxOpacity;
        currentLedIntensity = motionConfig.howItWorks.ledVisibility.emissiveMax;
      }

      heroHoloOpacityRef.current = currentHoloOpacity;

      // Update fan mesh opacity
      glbMaterialsRef.current.forEach((mat) => {
        mat.opacity = currentFanOpacity * loadFadeRef.current;
      });
      proceduralMaterialsRef.current.forEach((mat) => {
        mat.opacity = currentFanOpacity * loadFadeRef.current;
      });
    } else if (mode === "how-it-works" && progressRef) {
      // Solid fan visibility in how-it-works mode
      glbMaterialsRef.current.forEach((mat) => {
        mat.opacity = 1.0 * loadFadeRef.current;
      });
      proceduralMaterialsRef.current.forEach((mat) => {
        mat.opacity = 1.0 * loadFadeRef.current;
      });

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
      }

      howItWorksHoloOpacityRef.current = currentHoloOpacity;
    }

    // 1. Rotate node named Rotor_Hub about Z by code
    const activeRotor = useGlb ? rotorRef.current : proceduralRotorRef.current;
    if (activeRotor) {
      activeRotor.rotation.z += currentSpinSpeed * delta;
    }

    // 2. Drive emissive LEDs
    ledMaterialsRef.current.forEach((mat) => {
      mat.emissiveIntensity = currentLedIntensity;
    });

    if (proceduralLedMaterialRef.current) {
      proceduralLedMaterialRef.current.opacity = Math.min(1.0, currentLedIntensity / 2.5);
    }

    // 3. Stable front-facing alignment (no mouse-tracking tilt)
    if (rootRef.current) {
      rootRef.current.rotation.x = 0;
      rootRef.current.rotation.y = 0;
    }
  });

  const showHologram = mode === "how-it-works" || mode === "hero";
  const activeOpacityRef = mode === "hero" ? heroHoloOpacityRef : howItWorksHoloOpacityRef;

  // UX Fix: If the GLB is still downloading, render NOTHING (no awkward unscaled placeholder)
  const isLoaded = useGlb && instanceScene;
  if (!isLoaded && !loadFailed) {
    return <group ref={rootRef} scale={scale} visible={false} />;
  }

  return (
    <group ref={rootRef} scale={scale}>
      {/* 1. GLB Fan Model */}
      {isLoaded && instanceScene ? (
        <primitive object={instanceScene} />
      ) : loadFailed ? (
        /* Emergency Fallback ONLY if network/parse fails completely */
        <group>
          <mesh name="Motor_Base" position={[0, 0, -0.08]} material={proceduralMaterials.motorBase}>
            <cylinderGeometry args={[0.18, 0.22, 0.14, 32]} />
          </mesh>

          <group ref={proceduralRotorRef} name="Rotor_Hub">
            <mesh position={[0, 0, 0]} material={proceduralMaterials.hubFace}>
              <cylinderGeometry args={[0.16, 0.16, 0.04, 32]} />
            </mesh>
            <mesh position={[0, 0, 0.022]} material={proceduralMaterials.hubCenter}>
              <circleGeometry args={[0.1, 32]} />
            </mesh>

            {[
              { name: "Blade_01", angle: 0 },
              { name: "Blade_02", angle: Math.PI / 2 },
              { name: "Blade_03", angle: Math.PI },
              { name: "Blade_04", angle: (Math.PI * 3) / 2 },
            ].map((b) => (
              <group key={b.name} name={b.name} rotation={[0, 0, b.angle]}>
                <mesh position={[0.58, 0, 0.005]} material={proceduralMaterials.bladeBody}>
                  <boxGeometry args={[0.98, 0.072, 0.012]} />
                </mesh>
                <mesh position={[0.58, 0.038, 0.003]} material={proceduralMaterials.bladeRidge}>
                  <boxGeometry args={[0.96, 0.006, 0.008]} />
                </mesh>
                <mesh position={[0.62, 0, 0.014]} material={proceduralMaterials.bladeStrip}>
                  <boxGeometry args={[0.9, 0.014, 0.004]} />
                </mesh>
              </group>
            ))}

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
      ) : null}

      {/* 2. Native 3D Hologram (True Transparency, 3D Rotation & Glowing Loops) */}
      {showHologram && (
        <HologramModel
          styleIndex={hologramStyleIndex}
          scale={0.24}
          position={[0, 0, 0.06]}
          opacityRef={activeOpacityRef}
        />
      )}
    </group>
  );
}
