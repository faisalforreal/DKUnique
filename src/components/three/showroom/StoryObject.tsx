"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motionConfig } from "@/config/motion";
import { useShowroomAsset } from "./useShowroomAssets";
import { FallbackPlane } from "./FallbackPlane";
import type { ObjTransform } from "./timeline";

interface StoryObjectProps {
  id: "fan" | "butterfly" | "emblem" | "sneaker";
  progressRef: React.MutableRefObject<number>;
  transform: (p: number) => ObjTransform;
}

/**
 * A scroll-driven storytelling object. Applies the progress-derived transform
 * to an outer group, drives the model's own animation clip on a time basis
 * (independent of scroll), adds a gentle holographic float/yaw, and fades
 * materials to match progress.
 */
export function StoryObject({ id, progressRef, transform }: StoryObjectProps) {
  const { asset, status, instance } = useShowroomAsset(id);
  const groupRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Object3D | null>(null);
  const opacityRef = useRef(0);
  const seed = useRef(Math.random() * Math.PI * 2);

  useEffect(() => {
    if (id === "fan" && instance) {
      rotorRef.current = instance.group.getObjectByName("Rotor_Hub") ?? null;
    }
  }, [id, instance]);

  useFrame((state, delta) => {
    instance?.mixer?.update(delta);

    const t = transform(progressRef.current);
    const g = groupRef.current;
    if (!g) return;

    const show = t.visible && (status === "ready" || status === "image");
    g.visible = show;
    if (!show) return;

    opacityRef.current = t.opacity;
    const scale = (asset?.baseScale ?? 1) * t.scale;

    if (id === "fan") {
      // Physical fan: fixed front-facing orientation, spinning rotor.
      g.position.set(t.position[0], t.position[1], t.position[2]);
      g.scale.setScalar(scale);
      g.rotation.set(0, 0, 0);
      if (rotorRef.current) {
        rotorRef.current.rotation.z += motionConfig.showroom.idle.fanSpinSpeed * delta;
      }
    } else {
      // Holographic object: gentle float + slow yaw, wings keep flapping via mixer.
      const bob = Math.sin(state.clock.elapsedTime * 0.8 + seed.current) * 0.05;
      g.position.set(t.position[0], t.position[1] + bob, t.position[2]);
      g.scale.setScalar(scale);
      g.rotation.y = state.clock.elapsedTime * 0.3;
    }

    if (instance) {
      for (const m of instance.materials) m.opacity = t.opacity;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {status === "ready" && instance ? (
        <primitive object={instance.group} />
      ) : status === "image" && asset?.fallbackImage ? (
        <FallbackPlane src={asset.fallbackImage} opacityRef={opacityRef} />
      ) : null}
    </group>
  );
}
