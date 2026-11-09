"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motionConfig } from "@/config/motion";
import { SHOWCASE_ASSET_IDS } from "./assets";
import { useShowroomAsset } from "./useShowroomAssets";
import { FallbackPlane } from "./FallbackPlane";

const RING_RADIUS = 1.9;

interface ShowcaseSceneProps {
  dragRef: React.MutableRefObject<number>;
  pausedRef: React.MutableRefObject<boolean>;
}

/**
 * The looping holographic content gallery (View B). Items sit on a horizontal
 * ring and the whole ring rotates slowly; dragging scrubs the ring, and the
 * loop pauses while the visitor is interacting. This scene intentionally does
 * not touch the camera — it inherits the wide centred frame View A holds.
 */
export function ShowcaseScene({ dragRef, pausedRef }: ShowcaseSceneProps) {
  const ringRef = useRef<THREE.Group>(null);
  const loopRef = useRef(0);

  useFrame((_, delta) => {
    const speed = pausedRef.current ? 0 : motionConfig.showroom.idle.showcaseLoopSpeed;
    loopRef.current += speed * delta;
    if (ringRef.current) {
      ringRef.current.rotation.y = loopRef.current + dragRef.current;
    }
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} color="#D5B77B" intensity={1.6} />
      <directionalLight position={[-3, 1, -2]} color="#C58D9D" intensity={0.9} />
      <directionalLight position={[0, -2, 3]} color="#F2EEE7" intensity={0.5} />

      <group ref={ringRef}>
        {SHOWCASE_ASSET_IDS.map((id, i) => {
          const angle = (i / SHOWCASE_ASSET_IDS.length) * Math.PI * 2;
          return <ShowcaseItem key={id} id={id} angle={angle} />;
        })}
      </group>
    </>
  );
}

function ShowcaseItem({ id, angle }: { id: string; angle: number }) {
  const { asset, status, instance } = useShowroomAsset(id);
  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(1);
  const seed = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    instance?.mixer?.update(delta);

    const g = groupRef.current;
    if (!g) return;
    const show = status === "ready" || status === "image";
    g.visible = show;
    if (!show) return;

    const x = Math.sin(angle) * RING_RADIUS;
    const z = Math.cos(angle) * RING_RADIUS;
    const bob = Math.sin(state.clock.elapsedTime * 0.7 + seed.current) * 0.06;
    g.position.set(x, bob, z);
    g.rotation.y = angle; // face outward from the ring centre
    g.scale.setScalar((asset?.baseScale ?? 1) * 0.85);
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
