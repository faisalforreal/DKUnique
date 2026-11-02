"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const HOLOGRAM_MODELS = [
  {
    id: "cyan_magenta",
    name: "Neon Cyan",
    file: "/assets/models/dk_hologram_1_cyan_magenta.glb",
    accent: "#00E5FF",
    glow: "#FF007F",
  },
  {
    id: "ice_electric_blue",
    name: "Electric Blue",
    file: "/assets/models/dk_hologram_2_ice_electric_blue.glb",
    accent: "#00BFFF",
    glow: "#1E90FF",
  },
  {
    id: "violet_blue_cyan",
    name: "Cosmic Glow",
    file: "/assets/models/dk_hologram_3_violet_blue_cyan.glb",
    accent: "#9933FF",
    glow: "#00F0FF",
  },
  {
    id: "amber_indigo",
    name: "Sunset Amber",
    file: "/assets/models/dk_hologram_4_amber_indigo.glb",
    accent: "#FFAA00",
    glow: "#4B0082",
  },
  {
    id: "mint_white",
    name: "Clean Mint",
    file: "/assets/models/dk_hologram_5_mint_white.glb",
    accent: "#00FFB2",
    glow: "#FFFFFF",
  },
] as const;

interface CachedHologramData {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

const glbCache = new Map<string, Promise<CachedHologramData | null>>();

async function loadHologramGlb(filePath: string): Promise<CachedHologramData | null> {
  const existing = glbCache.get(filePath);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const { GLTFLoader } = await import("three-stdlib");
      const loader = new GLTFLoader();

      const gltf = await new Promise<any>((resolve, reject) => {
        loader.load(filePath, resolve, undefined, reject);
      });

      return {
        scene: gltf.scene as THREE.Group,
        animations: (gltf.animations as THREE.AnimationClip[]) || [],
      };
    } catch (err) {
      console.warn("Failed to load 3d visual asset:", filePath, err);
      return null;
    }
  })();

  glbCache.set(filePath, promise);
  return promise;
}

// Preload all 5 models immediately in browser
if (typeof window !== "undefined") {
  HOLOGRAM_MODELS.forEach((m) => {
    loadHologramGlb(m.file).catch(() => {});
  });
}

export interface HologramModelProps {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  opacityRef?: React.MutableRefObject<number>;
  opacity?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

interface LoadedSlot {
  index: number;
  group: THREE.Group;
  materials: THREE.Material[];
  mixer: THREE.AnimationMixer | null;
}

export function HologramModel({
  scale = 0.24,
  position = [0, 0, 0.25],
  rotation = [0, 0, 0],
  opacityRef,
  opacity: directOpacity = 1.0,
  autoRotate = false,
  autoRotateSpeed = 0.5,
}: HologramModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);

  // Cross-fading model slots: Slot A (current) and Slot B (incoming next colorway)
  const [slotA, setSlotA] = useState<LoadedSlot | null>(null);
  const [slotB, setSlotB] = useState<LoadedSlot | null>(null);

  // Timing refs for seamless loop cross-fade
  const currentModelIndexRef = useRef(0);
  const loopCycleTimeRef = useRef(0);
  const cycleDuration = 4.0; // 4.0 seconds per complete HologramLoop cycle
  const crossFadeDuration = 0.8; // 0.8 second smooth fade into the next model

  // Helper to instantiate and clone a model slot
  const createSlot = async (modelIndex: number): Promise<LoadedSlot | null> => {
    const modelDef = HOLOGRAM_MODELS[modelIndex % HOLOGRAM_MODELS.length];
    const data = await loadHologramGlb(modelDef.file);
    if (!data) return null;

    const clone = data.scene.clone(true);
    const mats: THREE.Material[] = [];

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }

        const meshMats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        meshMats.forEach((mat) => {
          if (mat) {
            mat.transparent = true;
            mat.depthWrite = false;
            mat.blending = THREE.AdditiveBlending;
            mats.push(mat);
          }
        });
      }
    });

    let mixer: THREE.AnimationMixer | null = null;
    if (data.animations && data.animations.length > 0) {
      mixer = new THREE.AnimationMixer(clone);
      const clip = data.animations.find((a) => a.name === "HologramLoop") || data.animations[0];
      if (clip) {
        const action = mixer.clipAction(clip);
        action.play();
      }
    }

    return { index: modelIndex, group: clone, materials: mats, mixer };
  };

  // Initial load: setup Slot A (model 0) and Slot B (model 1)
  useEffect(() => {
    let active = true;

    Promise.all([createSlot(0), createSlot(1)]).then(([first, second]) => {
      if (!active) return;
      if (first) setSlotA(first);
      if (second) setSlotB(second);
    });

    return () => {
      active = false;
    };
  }, []);

  // Frame loop: updates mixers in sync, handles cross-fade, and advances color spectrum
  useFrame((_, delta) => {
    loopCycleTimeRef.current += delta;
    const t = loopCycleTimeRef.current;

    // Advance both slot mixers in perfect synchrony
    if (slotA?.mixer) slotA.mixer.update(delta);
    if (slotB?.mixer) slotB.mixer.update(delta);

    // Auto-rotate if requested
    if (autoRotate && spinRef.current) {
      spinRef.current.rotation.y += delta * autoRotateSpeed;
    }

    // Determine target global opacity
    let globalOpacity = directOpacity;
    if (opacityRef !== undefined) {
      globalOpacity *= opacityRef.current;
    }

    const isVisible = globalOpacity > 0.01;
    if (rootRef.current) {
      rootRef.current.visible = isVisible;
    }

    if (!isVisible) return;

    // Cross-fade logic:
    // When loopCycleTime reaches (cycleDuration - crossFadeDuration), begin cross-fading into next model
    const fadeStartTime = cycleDuration - crossFadeDuration;
    let weightA = 1.0;
    let weightB = 0.0;

    if (t >= fadeStartTime && t < cycleDuration) {
      // In cross-fade window: smoothly transfer weight from A to B
      const progress = (t - fadeStartTime) / crossFadeDuration;
      // Smoothstep easing for seamless luminance curve
      const ease = progress * progress * (3 - 2 * progress);
      weightA = 1.0 - ease;
      weightB = ease;
    } else if (t >= cycleDuration) {
      // Cycle complete: reset timer, advance model index, and pre-load incoming next model
      loopCycleTimeRef.current = 0;
      const nextIndex = (currentModelIndexRef.current + 1) % HOLOGRAM_MODELS.length;
      currentModelIndexRef.current = nextIndex;

      // Slot B now becomes the primary visible slot
      setSlotA(slotB);

      // Preload next model in sequence into Slot B
      const upcomingIndex = (nextIndex + 1) % HOLOGRAM_MODELS.length;
      createSlot(upcomingIndex).then((newSlot) => {
        if (newSlot) {
          // Synchronize new slot's mixer time with Slot A so the animation never jumps
          if (newSlot.mixer && slotB?.mixer) {
            newSlot.mixer.setTime(loopCycleTimeRef.current);
          }
          setSlotB(newSlot);
        }
      });

      weightA = 1.0;
      weightB = 0.0;
    }

    // Apply combined opacities to materials (complementary weights: weightA + weightB = 1.0)
    if (slotA) {
      const alphaA = globalOpacity * weightA;
      for (let i = 0; i < slotA.materials.length; i++) {
        slotA.materials[i].opacity = alphaA;
      }
    }
    if (slotB) {
      const alphaB = globalOpacity * weightB;
      for (let i = 0; i < slotB.materials.length; i++) {
        slotB.materials[i].opacity = alphaB;
      }
    }
  });

  return (
    <group ref={rootRef} position={position} rotation={rotation} scale={scale} visible={false}>
      <group ref={spinRef}>
        {/* Hologram pivot offset: Y=-1.25 centers the rotating rings & 3D text precisely on (0, 0, 0) */}
        <group position={[0, -1.25, 0]}>
          {slotA && <primitive object={slotA.group} />}
          {slotB && <primitive object={slotB.group} />}
        </group>
      </group>
    </group>
  );
}
