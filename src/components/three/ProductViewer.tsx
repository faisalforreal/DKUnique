"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Model3D, MediaAsset } from "@/types";

interface ProductViewerProps {
  model3d?: Model3D;
  productName: string;
  categoryName: string;
  images: MediaAsset[];
}

/**
 * Three.js GLB model scene with runtime material overrides:
 * - Nodes named Glass_* get a runtime physical transmission material
 * - Nodes named LED_* get a runtime emissive material
 * - Centered origin, real-world scale in meters, Y-up
 * - Missing nodes handled gracefully without errors
 */
function RuntimeProductModel({
  glbUrl,
  scale = 1.0,
}: {
  glbUrl: string;
  scale?: number;
}) {
  const modelRef = useRef<THREE.Group>(null);
  const [scene, setScene] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let active = true;
    import("three-stdlib").then(({ GLTFLoader }) => {
      const loader = new GLTFLoader();
      loader.load(
        glbUrl,
        (gltf) => {
          if (!active) return;
          const loadedScene = gltf.scene;

          // Compute bounding box to ensure centered origin
          const box = new THREE.Box3().setFromObject(loadedScene);
          const center = box.getCenter(new THREE.Vector3());
          loadedScene.position.sub(center);

          // Traverse and inject runtime materials
          loadedScene.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
              const mesh = node as THREE.Mesh;

              // Nodes named Glass_* get a runtime transmission material
              if (mesh.name.startsWith("Glass_") || mesh.name.toLowerCase().includes("glass")) {
                mesh.material = new THREE.MeshPhysicalMaterial({
                  transmission: 0.92,
                  roughness: 0.08,
                  ior: 1.5,
                  thickness: 0.25,
                  transparent: true,
                  opacity: 0.85,
                  color: new THREE.Color("#ffffff"),
                  depthWrite: false,
                });
              }
              // Nodes named LED_* get a runtime emissive material
              else if (mesh.name.startsWith("LED_") || mesh.name.toLowerCase().includes("led")) {
                mesh.material = new THREE.MeshStandardMaterial({
                  color: new THREE.Color("#2BD9E6"),
                  emissive: new THREE.Color("#2BD9E6"),
                  emissiveIntensity: 3.5,
                });
              }
            }
          });

          setScene(loadedScene);
        },
        undefined,
        (err) => {
          console.error("Failed to load product GLB:", err);
        }
      );
    });

    return () => {
      active = false;
    };
  }, [glbUrl]);

  // Light scroll-based rotation and slow idle spin
  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.5 * delta;
    }
  });

  if (!scene) return null;

  return (
    <group ref={modelRef} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

export function ProductViewer({
  model3d,
  productName,
  categoryName,
  images,
}: ProductViewerProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 1. 3D R3F Model Viewer if GLB is configured
  if (model3d?.glb) {
    return (
      <div className="relative w-full aspect-square bg-stage border border-line/20 rounded-[2px] overflow-hidden flex items-center justify-center">
        <Canvas
          camera={{ position: [0, 0, 1.8], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 5]} intensity={1.2} />
          <directionalLight position={[-3, -2, -2]} intensity={0.5} />
          <Suspense fallback={null}>
            <RuntimeProductModel glbUrl={model3d.glb} scale={model3d.scale || 1.0} />
          </Suspense>
          <OrbitControls enableZoom={true} enablePan={false} autoRotate={false} />
        </Canvas>

        <div className="absolute bottom-3 left-3 bg-stage/90 border border-line/30 px-2 py-1 rounded-[2px] font-mono text-[10px] text-paper/70 pointer-events-none">
          Drag to orbit • Scroll to zoom
        </div>
      </div>
    );
  }

  // 2. High-Res Image Gallery if photos exist
  if (images.length > 0) {
    const activeImage = images[selectedImageIndex] || images[0];

    return (
      <div className="flex flex-col gap-4">
        {/* Main Stage Image */}
        <div className="relative w-full aspect-square bg-neutral-200 border border-line rounded-[2px] overflow-hidden">
          <Image
            src={activeImage.src}
            alt={activeImage.alt || productName}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Thumbnail Selector if multiple images */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 h-16 border rounded-[2px] overflow-hidden flex-shrink-0 ${
                  selectedImageIndex === idx ? "border-ink" : "border-line opacity-60"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || `${productName} view ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 3. Neutral Missing Photo Fallback (Flat neutral #E4E0D7 block with mono product name & category)
  return (
    <div className="w-full aspect-square bg-[#E4E0D7] border border-line rounded-[2px] flex flex-col items-center justify-center p-8 text-center select-none">
      <span className="font-mono text-xs uppercase tracking-widest text-muted mb-2">
        {categoryName}
      </span>
      <h3 className="font-mono text-base font-semibold text-ink max-w-xs">
        {productName}
      </h3>
    </div>
  );
}
