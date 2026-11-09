"use client";

import React, { useEffect, useRef } from "react";
import { View } from "@react-three/drei";
import { copy } from "@/content/copy";
import { Button } from "@/components/ui/Button";
import { ShowcaseScene } from "@/components/three/showroom/ShowcaseScene";
import { SHOWCASE_ASSET_IDS, SHOWROOM_ASSETS } from "@/components/three/showroom/assets";

/**
 * The final holographic content gallery. One drei <View> (View B) reuses the
 * shared canvas and already-cached models. Drag to scrub the ring; the loop
 * pauses while interacting or hovering.
 */
export function HolographicShowcaseSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(0);
  const pausedRef = useRef(false);
  const dragState = useRef<{ startX: number; startDrag: number } | null>(null);
  const resumeTimer = useRef<number | null>(null);

  const pause = () => {
    pausedRef.current = true;
  };
  const scheduleResume = () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, 1600);
  };

  useEffect(() => {
    return () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pause();
    dragState.current = { startX: e.clientX, startDrag: dragRef.current };
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    dragRef.current = dragState.current.startDrag + dx * 0.006;
  };
  const endDrag = () => {
    if (dragState.current) {
      dragState.current = null;
      scheduleResume();
    }
  };

  return (
    <section className="relative w-full bg-midnight text-pearl py-20 sm:py-28 overflow-hidden">
      <div className="max-w-[1280px] w-full mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne/20 pb-8">
          <div className="space-y-3 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-champagne">
              {copy.showroom.showcase.label}
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-pearl">
              {copy.showroom.showcase.heading}
            </h2>
            <p className="font-body text-base text-pearl/70 leading-relaxed">
              {copy.showroom.showcase.body}
            </p>
          </div>
          <div className="shrink-0">
            <Button variant="stagePrimary" size="lg" href="/products">
              {copy.showroom.showcase.cta}
            </Button>
          </div>
        </div>

        {/* 3D Stage */}
        <div
          ref={trackRef}
          role="region"
          aria-label="Holographic content gallery"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          onMouseEnter={pause}
          onMouseLeave={scheduleResume}
          onFocus={pause}
          onBlur={scheduleResume}
          className="relative w-full h-[52vh] sm:h-[58vh] mt-8 rounded-[2px] cursor-grab active:cursor-grabbing outline-offset-4"
          style={{ touchAction: "pan-y" }}
        >
          <View className="absolute inset-0 w-full h-full pointer-events-none">
            <ShowcaseScene dragRef={dragRef} pausedRef={pausedRef} />
          </View>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none font-mono text-[11px] uppercase tracking-[0.2em] text-pearl/50 bg-midnight/60 px-3 py-1 rounded-full border border-champagne/20">
            Drag to explore • Hover to pause
          </div>
        </div>

        {/* Caption strip (honest: content types, no product links) */}
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 justify-center">
          {SHOWCASE_ASSET_IDS.map((id) => {
            const item = SHOWROOM_ASSETS[id];
            if (!item) return null;
            return (
              <div key={id} className="flex items-baseline gap-2">
                <span className="font-display font-bold text-sm text-pearl">{item.label}</span>
                <span className="font-mono text-xs text-pearl/50">{item.application}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
