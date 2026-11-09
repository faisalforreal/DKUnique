"use client";

/**
 * Pure scroll-progress → transform functions for the storytelling scene.
 * Everything is a function of `p` (0..1), so the sequence is fully reversible
 * when scrolling up. Idle animations (wing flap, float) are time-based and
 * handled separately in the components, never tied to scroll.
 */

import { motionConfig } from "@/config/motion";

const S = motionConfig.showroom.segments;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smoothstep = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpV3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/** Normalised 0..1 progress within a named segment (clamped outside). */
function inSeg(p: number, key: keyof typeof S): number {
  const { start, end } = S[key];
  return clamp01((p - start) / (end - start));
}

export interface ObjTransform {
  visible: boolean;
  position: [number, number, number];
  /** Multiplier applied on top of the asset's `baseScale`. */
  scale: number;
  opacity: number;
}

/**
 * Fan: hero centrepiece on the right → shrinks + dissolves into a luminous
 * point on the right as the visitor scrolls (fanToButterfly).
 */
export function fanTransform(p: number): ObjTransform {
  const position: [number, number, number] = [1.25, 0, 0];
  let scale = 1;
  let opacity = 1;
  let visible = true;

  if (p > S.hero.end) {
    const t = inSeg(p, "fanToButterfly");
    const e = smoothstep(t);
    scale = lerp(1, 0.12, e);
    opacity = lerp(1, 0, e);
    position[0] = lerp(1.25, 1.6, e);
    if (t >= 1) visible = false;
  }

  return { visible, position, scale, opacity };
}

/**
 * Butterfly: materialises on the right (emerging from the fan's collapse
 * point), travels R→L, settles left, then dissolves into the emblem.
 */
export function butterflyTransform(p: number): ObjTransform {
  const position: [number, number, number] = [1.6, 0, 0];
  let scale = 0.12;
  let opacity = 0;
  let visible = false;

  // Emerge (0.12 → 0.30)
  if (p >= S.fanToButterfly.start) {
    const appear = (p - S.fanToButterfly.start) / 0.18;
    scale = lerp(0.12, 1, smoothstep(appear));
    opacity = smoothstep(appear);
    visible = true;
  }
  // Travel R→L (0.26 → 0.40)
  if (p >= S.butterfly.start) {
    const travel = inSeg(p, "butterfly");
    position[0] = lerp(1.6, -1.1, smoothstep(travel));
  }
  // Fold + dissolve (0.40 → 0.54)
  if (p >= S.butterflyToEmblem.start) {
    const d = smoothstep(inSeg(p, "butterflyToEmblem"));
    opacity = lerp(1, 0, d);
    scale = lerp(1, 0.85, d);
    if (d >= 1) visible = false;
  }

  return { visible, position, scale, opacity };
}

/**
 * Emblem: materialises on the left, travels L→R, settles right, then
 * dissolves into the sneaker. (When the GLB is missing, the DK logo image
 * fallback is shown in its place.)
 */
export function emblemTransform(p: number): ObjTransform {
  const position: [number, number, number] = [-1.4, 0, 0];
  let scale = 0.3;
  let opacity = 0;
  let visible = false;

  if (p >= S.butterflyToEmblem.start) {
    const appear = inSeg(p, "butterflyToEmblem");
    const e = smoothstep(appear);
    scale = lerp(0.3, 1, e);
    opacity = e;
    position[0] = lerp(-1.4, 1.1, e);
    visible = true;
  }
  if (p >= S.emblemToSneaker.start) {
    const d = smoothstep(inSeg(p, "emblemToSneaker"));
    opacity = lerp(1, 0, d);
    scale = lerp(1, 0.9, d);
    if (d >= 1) visible = false;
  }

  return { visible, position, scale, opacity };
}

/**
 * Sneaker: materialises on the right, travels R→L, settles left, then glides
 * to the centre as the environment widens for the showcase hand-off.
 */
export function sneakerTransform(p: number): ObjTransform {
  const position: [number, number, number] = [1.6, 0, 0];
  let scale = 0.3;
  let opacity = 0;
  let visible = false;

  if (p >= S.emblemToSneaker.start) {
    const appear = inSeg(p, "emblemToSneaker");
    const e = smoothstep(appear);
    scale = lerp(0.3, 1, e);
    opacity = e;
    position[0] = lerp(1.6, -1.1, e);
    visible = true;
  }
  if (p >= S.sneakerToShowcase.start) {
    const c = smoothstep(inSeg(p, "sneakerToShowcase"));
    position[0] = lerp(-1.1, 0, c);
    scale = lerp(1, 0.95, c);
  }

  return { visible, position, scale, opacity };
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

/** Interpolate the camera through its keyframes (smoothed). */
export function cameraState(p: number): CameraState {
  const kf = motionConfig.showroom.camera.keyframes;
  if (p <= kf[0].p) return kf[0];
  if (p >= kf[kf.length - 1].p) return kf[kf.length - 1];

  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i];
    const b = kf[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = smoothstep((p - a.p) / (b.p - a.p));
      return {
        position: lerpV3(a.position, b.position, t),
        target: lerpV3(a.target, b.target, t),
        fov: lerp(a.fov, b.fov, t),
      };
    }
  }
  return kf[kf.length - 1];
}
