"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface FallbackPlaneProps {
  src: string;
  opacityRef?: React.MutableRefObject<number>;
}

/**
 * Genuine photo fallback rendered as a flat billboard inside the 3D scene,
 * used only when a model's GLB has not been provided yet. Never a stand-in
 * for a fake object — only real photography (e.g. the DK Unique logo).
 */
export function FallbackPlane({ src, opacityRef }: FallbackPlaneProps) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const [info, setInfo] = useState<{ tex: THREE.Texture; aspect: number } | null>(null);

  useEffect(() => {
    let active = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      src,
      (tex) => {
        if (!active) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        const img = tex.image as { width?: number; height?: number } | undefined;
        const w = img?.width || 1;
        const h = img?.height || 1;
        setInfo({ tex, aspect: w / h });
      },
      undefined,
      () => {}
    );
    return () => {
      active = false;
    };
  }, [src]);

  useEffect(() => {
    return () => {
      info?.tex.dispose();
    };
  }, [info]);

  useFrame(() => {
    if (matRef.current && opacityRef) {
      matRef.current.opacity = opacityRef.current;
    }
  });

  if (!info) return null;

  return (
    <mesh>
      <planeGeometry args={[info.aspect, 1]} />
      <meshBasicMaterial
        ref={matRef}
        map={info.tex}
        transparent
        toneMapped={false}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
