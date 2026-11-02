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

export type HologramStyleId = (typeof HOLOGRAM_MODELS)[number]["id"];

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

// Preload all 5 hologram models in browser
if (typeof window !== "undefined") {
  HOLOGRAM_MODELS.forEach((m) => {
    loadHologramGlb(m.file).catch(() => {});
  });
}

export interface HologramModelProps {
  styleIndex?: number;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  opacityRef?: React.MutableRefObject<number>;
  opacity?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  onLoaded?: () => void;
}

export function HologramModel({
  styleIndex = 0,
  scale = 0.22,
  position = [0, 0, 0.05],
  rotation = [0, 0, 0],
  opacityRef,
  opacity: directOpacity = 1.0,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  onLoaded,
}: HologramModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  const [instanceScene, setInstanceScene] = useState<THREE.Group | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Fade-in transition when switching models
  const fadeAlphaRef = useRef(0);

  const safeIndex = Math.max(0, Math.min(styleIndex, HOLOGRAM_MODELS.length - 1));
  const modelDef = HOLOGRAM_MODELS[safeIndex];

  useEffect(() => {
    let active = true;
    setIsReady(false);
    fadeAlphaRef.current = 0;

    loadHologramGlb(modelDef.file).then((data) => {
      if (!active) return;
      if (!data) return;

      // Deep clone scene hierarchy so instances don't share mutation state
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

      materialsRef.current = mats;

      // Setup AnimationMixer for HologramLoop
      if (data.animations && data.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(clone);
        const clip = data.animations.find((a) => a.name === "HologramLoop") || data.animations[0];
        if (clip) {
          const action = mixer.clipAction(clip);
          action.play();
        }
        mixerRef.current = mixer;
      } else {
        mixerRef.current = null;
      }

      setInstanceScene(clone);
      setIsReady(true);
      if (onLoaded) onLoaded();
    });

    return () => {
      active = false;
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
    };
  }, [modelDef.file, onLoaded]);

  // Animation frame loop
  useFrame((_, delta) => {
    if (!isReady || !instanceScene) return;

    // Advance mixer animation clip
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // Auto-rotate if enabled (e.g. In showcase/studio mode)
    if (autoRotate && spinRef.current) {
      spinRef.current.rotation.y += delta * autoRotateSpeed;
    }

    // Smooth fade-in
    if (fadeAlphaRef.current < 1.0) {
      fadeAlphaRef.current = Math.min(1.0, fadeAlphaRef.current + delta * 2.5);
    }

    // Determine target opacity: combines external opacityRef, directOpacity, and smooth fade-in
    let targetOpacity = directOpacity * fadeAlphaRef.current;
    if (opacityRef !== undefined) {
      targetOpacity *= opacityRef.current;
    }

    const isVisible = targetOpacity > 0.01;
    if (rootRef.current) {
      rootRef.current.visible = isVisible;
    }

    if (isVisible) {
      for (let i = 0; i < materialsRef.current.length; i++) {
        materialsRef.current[i].opacity = targetOpacity;
      }
    }
  });

  return (
    <group ref={rootRef} position={position} rotation={rotation} scale={scale} visible={false}>
      <group ref={spinRef}>
        {/* Hologram pivot offset: In Blender, rings and text are centered at Y=1.25.
            Offsetting by Y=-1.25 aligns the hologram's center of gravity precisely on (0, 0, 0). */}
        <group position={[0, -1.25, 0]}>
          {instanceScene && <primitive object={instanceScene} />}
        </group>
      </group>
    </group>
  );
}
