"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { motionConfig } from "@/config/motion";

interface HologramVideoPlaneProps {
  progressRef?: React.MutableRefObject<number>;
  opacityRef?: React.MutableRefObject<number>;
  diameter?: number; // Fan blade diameter in meters (default 0.65)
  isInView?: boolean;
  onVideoAvailable?: (available: boolean) => void;
}

/**
 * Hologram Video Plane:
 * - Faces the same direction as the fan face (+Z)
 * - Scaled to about 80% of blade diameter (0.65m * 0.8 = 0.52m)
 * - Uses VideoTexture from /assets/demo/holo-loop.mp4 (muted, loop, playsInline)
 * - Additive blending so black becomes transparent
 * - Starts hidden; as "How it works" scroll progress passes 0.7, fades in and rises slightly
 * - Mode is set in motion.ts: "in-plane" (default) or "above"
 * - Video plays only while section is in view; shows static poster until then
 * - If file is missing, notifies parent to use procedural hologram shape
 */
export function HologramVideoPlane({
  progressRef,
  opacityRef,
  diameter = 0.65,
  isInView = true,
  onVideoAvailable,
}: HologramVideoPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);

  const [hasVideo, setHasVideo] = useState(false);

  const planeSize = diameter * motionConfig.hologram.scaleRatio;

  // Initialize and probe HTML5 video
  useEffect(() => {
    let active = true;
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    // Set source paths (mp4 primary, webm secondary)
    const canPlayWebm = video.canPlayType("video/webm");
    video.src = canPlayWebm
      ? motionConfig.hologram.videoSrcWebm
      : motionConfig.hologram.videoSrcMp4;

    const handleLoadedData = () => {
      if (!active) return;
      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBAFormat;
      textureRef.current = texture;
      setHasVideo(true);
      onVideoAvailable?.(true);
    };

    const handlePlay = () => {
      // playing
    };

    const handleError = () => {
      if (!active) return;
      // Graceful fallback to procedural hologram
      setHasVideo(false);
      onVideoAvailable?.(false);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("play", handlePlay);
    video.addEventListener("error", handleError);

    videoRef.current = video;
    video.load();

    return () => {
      active = false;
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("error", handleError);
      video.pause();
      video.src = "";
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, [onVideoAvailable]);

  // Play/pause video based on viewport visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    if (isInView) {
      video.play().catch(() => {
        // Autoplay may be restricted until user interaction
      });
    } else {
      video.pause();
    }
  }, [isInView, hasVideo]);

  // Frame loop: update opacity and rise distance based on scroll progress or hero opacity ref
  useFrame(() => {
    let opacity = 0;
    let t = 0;

    if (opacityRef !== undefined) {
      opacity = opacityRef.current;
      t = opacity;
    } else if (progressRef) {
      const p = Math.max(0, Math.min(1, progressRef.current));
      const { fadeStartProgress } = motionConfig.hologram;

      if (p >= fadeStartProgress) {
        t = (p - fadeStartProgress) / (1.0 - fadeStartProgress);
        opacity = THREE.MathUtils.lerp(0, 1, t);
      }
    }

    const { mode, zOffsetInPlane, zOffsetAbove, riseDistance } = motionConfig.hologram;
    const baseZ = mode === "above" ? zOffsetAbove : zOffsetInPlane;
    const currentZ = baseZ + riseDistance * t;

    if (meshRef.current) {
      meshRef.current.position.z = currentZ;
    }

    if (materialRef.current) {
      materialRef.current.opacity = opacity;
    }
  });

  // If video is not available or errored, return null (parent will render procedural shape)
  if (!hasVideo || !textureRef.current) {
    return null;
  }

  return (
    <mesh ref={meshRef} position={[0, 0, motionConfig.hologram.zOffsetInPlane]}>
      <planeGeometry args={[planeSize, planeSize]} />
      <meshBasicMaterial
        ref={materialRef}
        map={textureRef.current}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
        opacity={0}
      />
    </mesh>
  );
}
