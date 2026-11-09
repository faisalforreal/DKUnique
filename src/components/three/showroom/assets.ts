"use client";

/**
 * Registry of 3D showroom assets (storytelling + showcase).
 *
 * Each entry maps a logical object to its GLB path, load priority, animation
 * clip (if any) and a graceful fallback when the GLB is not yet provided:
 *   - "image": show a genuine photo/video (DOM) fallback
 *   - "omit":  skip the visual, keep the text
 *
 * Models are normalised to a unit bounding-box height on load, so `baseScale`
 * is the final desired world-space height in metres.
 */

export type AssetPriority = "critical" | "soon" | "later";
export type AssetFallback = "image" | "omit";

export interface ShowroomAsset {
  id: string;
  file: string;
  priority: AssetPriority;
  /** Animation clip name to auto-play, if any (e.g. butterfly "flap"). */
  animation?: string;
  /** Final world-space scale (height in metres after unit normalisation). */
  baseScale: number;
  fallback: AssetFallback;
  /** Genuine photo fallback path when `fallback` is "image". */
  fallbackImage?: string;
  /** Gallery caption (visitor-facing name). */
  label: string;
  /** Gallery caption (one-line application). */
  application: string;
}

export const SHOWROOM_ASSETS: Record<string, ShowroomAsset> = {
  fan: {
    id: "fan",
    file: "/assets/models/hero-fan.glb",
    priority: "critical",
    baseScale: 1.35,
    fallback: "omit",
    label: "Holographic fan",
    application: "The display itself",
  },
  butterfly: {
    id: "butterfly",
    file: "/assets/models/showroom/butterfly.glb",
    priority: "critical",
    animation: "flap",
    baseScale: 0.85,
    fallback: "omit",
    label: "Butterfly",
    application: "Glamour and visual attention",
  },
  emblem: {
    id: "emblem",
    file: "/assets/models/showroom/emblem.glb",
    priority: "soon",
    baseScale: 0.9,
    fallback: "image",
    fallbackImage: "/assets/brand/logo-reference.webp",
    label: "Brand emblem",
    application: "Identity and logo projection",
  },
  sneaker: {
    id: "sneaker",
    file: "/assets/models/showroom/sneaker.glb",
    priority: "soon",
    baseScale: 0.8,
    fallback: "omit",
    label: "Sneaker",
    application: "Fashion and footwear",
  },
  perfume: {
    id: "perfume",
    file: "/assets/models/showroom/perfume.glb",
    priority: "later",
    baseScale: 1.1,
    fallback: "omit",
    label: "Perfume bottle",
    application: "Fragrance and beauty",
  },
  diamond: {
    id: "diamond",
    file: "/assets/models/showroom/diamond.glb",
    priority: "later",
    baseScale: 0.9,
    fallback: "omit",
    label: "Diamond",
    application: "Luxury and jewellery",
  },
  beverage: {
    id: "beverage",
    file: "/assets/models/showroom/beverage.glb",
    priority: "later",
    baseScale: 0.9,
    fallback: "omit",
    label: "Beverage bottle",
    application: "Food and drink",
  },
};

/** Order of the scroll-driven storytelling objects. */
export const STORY_ASSET_IDS = ["fan", "butterfly", "emblem", "sneaker"] as const;

/** Curated holographic content shown in the looping showcase gallery. */
export const SHOWCASE_ASSET_IDS = [
  "butterfly",
  "emblem",
  "sneaker",
  "perfume",
  "diamond",
  "beverage",
] as const;
