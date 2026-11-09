"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import type { ShowroomAsset } from "./assets";
import { SHOWROOM_ASSETS } from "./assets";

interface RawGlb {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

/**
 * Module-level GLB cache: each file is fetched + parsed exactly once, then
 * cloned per instance (geometry shared, materials cloned for independent
 * opacity control). Reusing the same asset across storytelling and the
 * showcase gallery therefore costs only one download.
 */
const glbCache = new Map<string, Promise<RawGlb | null>>();

async function loadGlb(url: string): Promise<RawGlb | null> {
  const hit = glbCache.get(url);
  if (hit) return hit;

  const promise = (async () => {
    try {
      const { GLTFLoader, DRACOLoader } = await import("three-stdlib");
      const loader = new GLTFLoader();
      const draco = new DRACOLoader();
      draco.setDecoderPath("/draco/");
      loader.setDRACOLoader(draco);

      const gltf = await new Promise<{ scene: THREE.Group; animations: THREE.AnimationClip[] }>(
        (resolve, reject) => {
          loader.load(
            url,
            (g) =>
              resolve({
                scene: g.scene as THREE.Group,
                animations: (g.animations || []) as THREE.AnimationClip[],
              }),
            undefined,
            reject
          );
        }
      );
      return gltf;
    } catch (err) {
      console.warn("[showroom] failed to load 3D asset:", url, err);
      return null;
    }
  })();

  glbCache.set(url, promise);
  return promise;
}

export type ShowroomAssetStatus = "loading" | "ready" | "image" | "omit";

export interface ShowroomInstance {
  group: THREE.Group;
  materials: THREE.Material[];
  mixer: THREE.AnimationMixer | null;
}

/** Centre a clone on its origin and normalise its max dimension to 1 unit. */
function prepareInstance(raw: RawGlb, animationName?: string): ShowroomInstance {
  const inner = raw.scene.clone(true);
  const box = new THREE.Box3().setFromObject(inner);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;

  const group = new THREE.Group();
  group.add(inner);
  inner.position.sub(center);
  group.scale.setScalar(1 / maxDim);

  const materials: THREE.Material[] = [];
  inner.traverse((node) => {
    if ((node as THREE.Mesh).isMesh) {
      const mesh = node as THREE.Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => m.clone());
      } else if (mesh.material) {
        mesh.material = mesh.material.clone();
      }
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      list.forEach((m) => {
        if (m) {
          m.transparent = true;
          materials.push(m);
        }
      });
    }
  });

  let mixer: THREE.AnimationMixer | null = null;
  if (raw.animations.length > 0) {
    mixer = new THREE.AnimationMixer(inner);
    const clip = raw.animations.find((a) => a.name === animationName) || raw.animations[0];
    if (clip) {
      mixer.clipAction(clip).play();
    }
  }

  return { group, materials, mixer };
}

export function useShowroomAsset(id: string) {
  const asset: ShowroomAsset | undefined = SHOWROOM_ASSETS[id];
  const [instance, setInstance] = useState<ShowroomInstance | null>(null);
  const [status, setStatus] = useState<ShowroomAssetStatus>("loading");

  useEffect(() => {
    let active = true;
    if (!asset) {
      setStatus("omit");
      return;
    }

    setStatus("loading");
    setInstance(null);

    loadGlb(asset.file).then((raw) => {
      if (!active) return;
      if (raw) {
        setInstance(prepareInstance(raw, asset.animation));
        setStatus("ready");
      } else if (asset.fallback === "image" && asset.fallbackImage) {
        setStatus("image");
      } else {
        setStatus("omit");
      }
    });

    return () => {
      active = false;
      setInstance((prev) => {
        if (prev) {
          prev.mixer?.stopAllAction();
          // Dispose only per-instance cloned materials. Geometry + textures are
          // shared with the module cache and must stay alive for future clones.
          prev.materials.forEach((m) => m.dispose());
        }
        return null;
      });
    };
  }, [id, asset]);

  return { asset, status, instance };
}

/** Fire-and-forget prefetch of an asset (used as scroll approaches it). */
export function prefetchShowroomAsset(id: string) {
  const asset = SHOWROOM_ASSETS[id];
  if (asset) loadGlb(asset.file).catch(() => {});
}
