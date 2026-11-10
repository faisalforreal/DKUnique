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
  const angleRef = useRef(0);
  const seed = useRef(Math.random() * Math.PI * 2);

  useEffect(() => {
    if (id === "fan" && instance) {
      rotorRef.current = instance.group.getObjectByName("Rotor_Hub") ?? null;
    }
  }, [id, instance]);

  useFrame((state, delta) => {
    const cfg =
      id === "butterfly"
        ? motionConfig.showroom.models.butterfly
        : (motionConfig.showroom.models[id] ?? motionConfig.showroom.models.default);

    const flapMultiplier =
      cfg?.flapSpeed ??
      (id === "butterfly" ? motionConfig.showroom.idle.butterflyFlapTimeScale : 1.0);
    instance?.mixer?.update(delta * flapMultiplier);

    const t = transform(progressRef.current);
    const g = groupRef.current;
    if (!g) return;

    const show = t.visible && (status === "ready" || status === "image");
    g.visible = show;
    if (!show) return;

    opacityRef.current = t.opacity;

    const baseScale = cfg?.scale ?? asset?.baseScale ?? 1;
    const scale = baseScale * t.scale;

    if (id === "fan") {
      // 1. Physical fan: fixed front-facing orientation, spinning rotor hub.
      g.position.set(t.position[0], t.position[1], t.position[2]);
      g.scale.setScalar(scale);
      g.rotation.set(0, 0, 0);
      if (rotorRef.current) {
        rotorRef.current.rotation.z += motionConfig.showroom.idle.fanSpinSpeed * delta;
      }
    } else if (id === "butterfly") {
      // 2. Butterfly: zero continuous rotation (does not spin), wings flap via mixer as it slides across.
      const bob = Math.sin(state.clock.elapsedTime * cfg.floatSpeed + seed.current) * cfg.floatAmplitude;
      g.position.set(t.position[0], t.position[1] + bob, t.position[2]);
      g.scale.setScalar(scale);

      const rotY =
        cfg.rotationYDegrees !== undefined
          ? (cfg.rotationYDegrees * Math.PI) / 180
          : (cfg.baseRotation?.[1] ?? Math.PI * 0.25);
      const rotX = cfg.baseRotation?.[0] ?? 0;
      const rotZ = cfg.baseRotation?.[2] ?? 0;
      g.rotation.set(rotX, rotY, rotZ);
    } else {
      // 3. Showcase models (Emblem, Sneaker, etc.): non-linear 90° dwell rotation.
      // Slows down noticeably when displaying the front/cardinal face, accelerates through intermediate turns.
      const bob = Math.sin(state.clock.elapsedTime * cfg.floatSpeed + seed.current) * cfg.floatAmplitude;
      g.position.set(t.position[0], t.position[1] + bob, t.position[2]);
      g.scale.setScalar(scale);

      if (cfg.autoRotate) {
        const dwell = cfg.dwellFactor ?? 0.75;
        const freq = cfg.dwellFrequency ?? 4;
        const phase =
          cfg.dwellAngleDegrees !== undefined
            ? (cfg.dwellAngleDegrees * Math.PI) / 180
            : (cfg.phaseOffset ?? 0);
        const baseSpeed = cfg.rotationSpeed ?? 0.4;
        const speedMult = 1 - dwell * Math.cos(freq * (angleRef.current - phase));
        angleRef.current += baseSpeed * speedMult * delta;
        g.rotation.set(0, angleRef.current, 0);
      } else {
        const rot = cfg.baseRotation ?? [0, 0, 0];
        g.rotation.set(rot[0], rot[1], rot[2]);
      }
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
