"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motionConfig } from "@/config/motion";
import { HologramModel } from "../HologramModel";

interface HeroShowroomAssemblyProps {
  progressRef: React.MutableRefObject<number>;
}

// Module-level asset cache to prevent re-fetching and parse once
let cachedFanScene: THREE.Group | null = null;
let fanLoadPromise: Promise<THREE.Group | null> | null = null;

async function getHeroFanScene(): Promise<THREE.Group | null> {
  if (cachedFanScene) return cachedFanScene;
  if (fanLoadPromise) return fanLoadPromise;

  fanLoadPromise = (async () => {
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

      cachedFanScene = scene;
      return cachedFanScene;
    } catch (err) {
      console.warn("[HeroShowroomAssembly] Failed to load fan model:", err);
      return null;
    }
  })();

  return fanLoadPromise;
}

export function HeroShowroomAssembly({ progressRef }: HeroShowroomAssemblyProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const fanGroupRef = useRef<THREE.Group>(null);
  const holoGroupRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Object3D | null>(null);

  const [instanceScene, setInstanceScene] = useState<THREE.Group | null>(null);

  const fanMaterialsRef = useRef<THREE.Material[]>([]);
  const ledMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const heroHoloOpacityRef = useRef(0);
  const timeElapsedRef = useRef(0);
  const heroAngleRef = useRef(0);

  // Load and clone hero fan
  useEffect(() => {
    let active = true;

    getHeroFanScene().then((masterScene) => {
      if (!active || !masterScene) return;

      const clone = masterScene.clone(true);
      const fanMats: THREE.Material[] = [];
      const ledMats: THREE.MeshStandardMaterial[] = [];

      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.name === "LED_Dots_01" || mesh.name.includes("LED")) {
            const ledMat = new THREE.MeshStandardMaterial({
              color: new THREE.Color("#00E5FF"),
              emissive: new THREE.Color("#00E5FF"),
              emissiveIntensity: 0.5,
              transparent: true,
              opacity: 1.0,
            });
            mesh.material = ledMat;
            ledMats.push(ledMat);
          } else {
            if (Array.isArray(mesh.material)) {
              mesh.material = mesh.material.map((m) => m.clone());
            } else if (mesh.material) {
              mesh.material = mesh.material.clone();
            }
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => {
              if (m) {
                m.transparent = true;
                m.opacity = 1.0;
                fanMats.push(m);
              }
            });
          }
        }
      });

      rotorRef.current = clone.getObjectByName("Rotor_Hub") ?? null;
      fanMaterialsRef.current = fanMats;
      ledMaterialsRef.current = ledMats;

      setInstanceScene(clone);
    });

    return () => {
      active = false;
    };
  }, []);

  useFrame((_, delta) => {
    const p = progressRef.current;
    timeElapsedRef.current += delta;
    const t = timeElapsedRef.current;

    const {
      stillDuration,
      spinUpDuration,
      maxSpinSpeed,
      fanMinOpacity,
      fanMaxOpacity,
      hologramOnsetThreshold,
      hologramInitialOpacity,
      hologramRampDuration,
      hologramMaxOpacity,
    } = motionConfig.hero.startup;

    // ── 1. Mechanical Spin-Up Sequence ──
    let spinSpeed = 0;
    let ledIntensity = 0.5;

    if (t < stillDuration) {
      spinSpeed = 0;
      ledIntensity = 0.5;
    } else if (t < stillDuration + spinUpDuration) {
      const progress = Math.min(1, Math.max(0, (t - stillDuration) / spinUpDuration));
      const ease = progress * progress * (3 - 2 * progress);
      spinSpeed = THREE.MathUtils.lerp(0, maxSpinSpeed, ease);
      ledIntensity = THREE.MathUtils.lerp(0.5, motionConfig.howItWorks.ledVisibility.emissiveMax, ease);
    } else {
      spinSpeed = maxSpinSpeed;
      ledIntensity = motionConfig.howItWorks.ledVisibility.emissiveMax;
    }

    if (rotorRef.current) {
      rotorRef.current.rotation.z += spinSpeed * delta;
    }

    ledMaterialsRef.current.forEach((mat) => {
      mat.emissiveIntensity = ledIntensity;
    });

    // ── 2. Time-Based Onset & Gradual Ramp (when stationary at hero) ──
    const tOnset = stillDuration + spinUpDuration * hologramOnsetThreshold;
    let baseHoloOpacity = 0.0;
    let baseFanOpacity = fanMaxOpacity;

    if (t < tOnset) {
      baseHoloOpacity = 0.0;
      const preOnsetRatio =
        t < stillDuration
          ? 0
          : Math.min(1, Math.max(0, (t - stillDuration) / (tOnset - stillDuration)));
      baseFanOpacity = THREE.MathUtils.lerp(fanMaxOpacity, 0.55, preOnsetRatio);
    } else {
      const rampProgress = Math.min(1, Math.max(0, (t - tOnset) / hologramRampDuration));
      const rampEase = rampProgress * rampProgress * (3 - 2 * rampProgress);
      baseHoloOpacity = THREE.MathUtils.lerp(
        hologramInitialOpacity,
        hologramMaxOpacity,
        rampEase
      );
      baseFanOpacity = THREE.MathUtils.lerp(0.55, fanMinOpacity, rampEase);
    }

    // ── 3. Scroll Interactions (New Requirement) ──
    // A. Fan disappearance on scroll:
    // When the visitor begins scrolling (p > 0), the ghosted fan (already at 5% opacity)
    // quickly drops from 5% to 0% by p = 0.08 and unmounts/hides completely.
    const fanScrollFade = p <= 0 ? 1 : Math.max(0, 1 - p / 0.08);
    const finalFanOpacity = baseFanOpacity * fanScrollFade;

    if (fanGroupRef.current) {
      const fanVisible = finalFanOpacity > 0.005;
      fanGroupRef.current.visible = fanVisible;
      if (fanVisible) {
        fanMaterialsRef.current.forEach((m) => {
          m.opacity = finalFanOpacity;
        });
        ledMaterialsRef.current.forEach((m) => {
          m.opacity = finalFanOpacity;
        });
      }
    }

    // B. Hologram Logo scroll transition into next model:
    // Holds steady at hero spot [1.0, 0, 0] during hero beat (p: 0 -> 0.12).
    // During fanToButterfly (p: 0.12 -> 0.26), glides smoothly towards [1.6, 0, 0.3],
    // scaling down and fading out into the luminous point where the butterfly emerges.
    const S = motionConfig.showroom.segments;
    let holoX = 1.0;
    const holoY = 0;
    let holoZ = 0.28;
    let holoScale = motionConfig.models.hero.hologramScale;
    let holoOpacity = baseHoloOpacity;

    if (p > S.hero.end) {
      const segT = Math.min(1, Math.max(0, (p - S.hero.end) / (S.fanToButterfly.end - S.hero.end)));
      const segEase = segT * segT * (3 - 2 * segT);
      holoX = THREE.MathUtils.lerp(1.25, 1.6, segEase);
      holoZ = THREE.MathUtils.lerp(0.28, 0.3, segEase);
      holoScale = THREE.MathUtils.lerp(motionConfig.models.hero.hologramScale, 0.02, segEase);
      holoOpacity = THREE.MathUtils.lerp(baseHoloOpacity, 0, segEase);
    }

    heroHoloOpacityRef.current = holoOpacity;

    const heroCfg = motionConfig.showroom.models.heroHologram;
    if (heroCfg.autoRotate) {
      const dwell = heroCfg.dwellFactor ?? 0.75;
      const freq = heroCfg.dwellFrequency ?? 4;
      const phase =
        heroCfg.dwellAngleDegrees !== undefined
          ? (heroCfg.dwellAngleDegrees * Math.PI) / 180
          : (heroCfg.phaseOffset ?? 0);
      const baseSpeed = heroCfg.rotationSpeed ?? 0.3;
      const speedMult = 1 - dwell * Math.cos(freq * (heroAngleRef.current - phase));
      heroAngleRef.current += baseSpeed * speedMult * delta;
    }

    if (holoGroupRef.current) {
      const holoVisible = holoOpacity > 0.005;
      holoGroupRef.current.visible = holoVisible;
      if (holoVisible) {
        holoGroupRef.current.position.set(holoX, holoY, holoZ);
        holoGroupRef.current.scale.setScalar(holoScale);
        if (heroCfg.autoRotate) {
          holoGroupRef.current.rotation.y = heroAngleRef.current;
        }
      }
    }
  });

  return (
    <group ref={rootGroupRef}>
      {/* 1. Physical Spinning Fan Assembly */}
      <group
        ref={fanGroupRef}
        position={[1.25, 0, -0.15]}
        scale={motionConfig.models.hero.fanScale}
        visible={true}
      >
        {instanceScene && <primitive object={instanceScene} />}
      </group>

      {/* 2. Native 3D Hologram Logo (Positioned in front with depth clearance Z=0.28) */}
      <group
        ref={holoGroupRef}
        position={[1.25, 0, 0.28]}
        scale={motionConfig.models.hero.hologramScale}
        visible={false}
      >
        <HologramModel
          scale={1.0}
          position={[0, 0, 0]}
          opacityRef={heroHoloOpacityRef}
        />
      </group>
    </group>
  );
}
