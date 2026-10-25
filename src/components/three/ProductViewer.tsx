"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Model3D, MediaAsset } from "@/types";

interface ProductViewerProps {
  model3d?: Model3D;
  productName: string;
  categoryName: string;
  images: MediaAsset[];
}

export function ProductViewer({
  model3d,
  productName,
  categoryName,
  images,
}: ProductViewerProps) {
  const viewerRef = useRef<HTMLElement | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);

  useEffect(() => {
    if (model3d?.glb) {
      import("@google/model-viewer")
        .then(() => setModelViewerLoaded(true))
        .catch((err) => console.error("Failed to load model-viewer", err));
    }
  }, [model3d?.glb]);

  // Light scroll rotation effect
  useEffect(() => {
    if (!model3d?.glb || !modelViewerLoaded) return;

    const handleScroll = () => {
      if (viewerRef.current) {
        const scrollOffset = window.scrollY;
        const orbitDeg = (scrollOffset * 0.25) % 360;
        viewerRef.current.setAttribute(
          "camera-orbit",
          `${orbitDeg}deg 75deg 105%`
        );
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [model3d?.glb, modelViewerLoaded]);

  // 1. 3D Model Viewer if GLB is configured
  if (model3d?.glb && modelViewerLoaded) {
    return (
      <div className="relative w-full aspect-square bg-stage border border-line/20 rounded-[2px] overflow-hidden flex items-center justify-center">
        <model-viewer
          ref={viewerRef}
          src={model3d.glb}
          ios-src={model3d.usdz}
          poster={model3d.poster || images[0]?.src}
          alt={productName}
          auto-rotate
          camera-controls
          shadow-intensity="1"
          exposure="1.2"
          ar
          ar-modes="webxr scene-viewer quick-look"
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        />
        <div className="absolute bottom-3 left-3 bg-stage/90 border border-line/30 px-2 py-1 rounded-[2px] font-mono text-[10px] text-paper/70">
          Scroll to rotate • Drag to orbit
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
