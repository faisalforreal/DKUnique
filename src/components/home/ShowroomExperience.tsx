"use client";

import React, { useEffect, useRef, useState } from "react";
import { View } from "@react-three/drei";
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "motion/react";
import { motionConfig } from "@/config/motion";
import { copy } from "@/content/copy";
import { Button } from "@/components/ui/Button";
import { ShowroomScene } from "@/components/three/showroom/ShowroomScene";
import { prefetchShowroomAsset } from "@/components/three/showroom/useShowroomAssets";

interface ShowroomExperienceProps {
  onOpenQuoteModal: () => void;
}

/**
 * The single pinned scroll-driven journey: hero fan → butterfly → emblem →
 * sneaker → possibilities. One drei <View> projects into the shared canvas;
 * all text lives in the DOM and animates off the same scroll progress.
 */
export function ShowroomExperience({ onOpenQuoteModal }: ShowroomExperienceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const prefetchedSoon = useRef(false);
  const prefetchedLater = useRef(false);

  const [trackVh, setTrackVh] = useState(motionConfig.showroom.trackHeightVh);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () =>
      setTrackVh(
        mq.matches
          ? motionConfig.showroom.trackHeightMobileVh
          : motionConfig.showroom.trackHeightVh
      );
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    if (!prefetchedSoon.current && v > 0.2) {
      prefetchedSoon.current = true;
      prefetchShowroomAsset("emblem");
      prefetchShowroomAsset("sneaker");
    }
    if (!prefetchedLater.current && v > 0.6) {
      prefetchedLater.current = true;
      prefetchShowroomAsset("perfume");
      prefetchShowroomAsset("diamond");
      prefetchShowroomAsset("beverage");
    }
  });

  // Hero text fades out and slides left as the fan gives way.
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.16], [1, 1, 0]);
  const heroX = useTransform(scrollYProgress, [0, 0.16], [0, -60]);
  const heroHintOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  // Beat 1 (butterfly) — text on the RIGHT.
  const b1Opacity = useTransform(scrollYProgress, [0.28, 0.36, 0.42, 0.5], [0, 1, 1, 0]);
  const b1X = useTransform(scrollYProgress, [0.28, 0.42], [40, 0]);

  // Beat 2 (emblem) — text on the LEFT.
  const b2Opacity = useTransform(scrollYProgress, [0.56, 0.63, 0.68, 0.74], [0, 1, 1, 0]);
  const b2X = useTransform(scrollYProgress, [0.56, 0.68], [-40, 0]);

  // Beat 3 (sneaker) — text on the RIGHT.
  const b3Opacity = useTransform(scrollYProgress, [0.8, 0.85, 0.88, 0.92], [0, 1, 1, 0]);
  const b3X = useTransform(scrollYProgress, [0.8, 0.88], [40, 0]);

  // Beat 4 (possibilities) — centred, stays visible into the gallery hand-off.
  const b4Opacity = useTransform(scrollYProgress, [0.9, 0.96], [0, 1]);
  const b4Y = useTransform(scrollYProgress, [0.9, 0.96], [30, 0]);

  const [beat1, beat2, beat3, beat4] = copy.showroom.beats;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-midnight text-pearl"
      style={{ height: `${trackVh}vh` }}
      aria-label="Holographic showroom"
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 20%, #281A30 0%, #0B0C13 60%)",
        }}
      >
        {/* Shared-canvas 3D scene. The <View> is mounted outside the R3F
            Canvas, so drei renders its own tracking <div> — it MUST be given a
            size here or the viewport is 0x0 and nothing draws. */}
        <View className="absolute inset-0 w-full h-full pointer-events-none">
          <ShowroomScene progressRef={progressRef} />
        </View>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: heroHintOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 font-mono text-[11px] uppercase tracking-[0.25em] text-champagne/70"
        >
          {copy.showroom.hero.scrollHint}
        </motion.div>

        {/* ── Hero (left) ── */}
        <motion.div
          style={{ opacity: heroOpacity, x: heroX }}
          className="absolute inset-0 z-20 flex items-center pointer-events-none"
        >
          <div className="max-w-[1280px] w-full mx-auto px-6">
            <div className="max-w-xl space-y-6">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-champagne">
                {copy.showroom.hero.label}
              </span>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.06] tracking-tight text-pearl">
                {copy.showroom.hero.heading}
              </h1>
              <p className="font-body text-base sm:text-lg text-pearl/75 leading-relaxed max-w-md">
                {copy.showroom.hero.body}
              </p>
              <div className="pt-2 pointer-events-auto">
                <Button variant="stagePrimary" size="lg" onClick={onOpenQuoteModal}>
                  {copy.showroom.hero.cta}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Beat 1 (right) ── */}
        <BeatText
          style={{ opacity: b1Opacity, x: b1X }}
          side="right"
          label={beat1.label}
          heading={beat1.heading}
          body={beat1.body}
        />

        {/* ── Beat 2 (left) ── */}
        <BeatText
          style={{ opacity: b2Opacity, x: b2X }}
          side="left"
          label={beat2.label}
          heading={beat2.heading}
          body={beat2.body}
        />

        {/* ── Beat 3 (right) ── */}
        <BeatText
          style={{ opacity: b3Opacity, x: b3X }}
          side="right"
          label={beat3.label}
          heading={beat3.heading}
          body={beat3.body}
        />

        {/* ── Beat 4 (centre) ── */}
        <motion.div
          style={{ opacity: b4Opacity, y: b4Y }}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none px-6"
        >
          <div className="max-w-xl text-center space-y-5">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-champagne">
              {beat4.label}
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl leading-[1.06] tracking-tight text-pearl">
              {beat4.heading}
            </h2>
            <p className="font-body text-base sm:text-lg text-pearl/75 leading-relaxed">
              {beat4.body}
            </p>
            <div className="pt-2 pointer-events-auto">
              <Button variant="stagePrimary" size="lg" href="/products">
                {beat4.cta}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface BeatTextProps {
  style: { opacity: MotionValue<number>; x: MotionValue<number> };
  side: "left" | "right";
  label: string;
  heading: string;
  body: string;
}

function BeatText({ style, side, label, heading, body }: BeatTextProps) {
  return (
    <motion.div
      style={style}
      className="absolute inset-0 z-20 flex items-center pointer-events-none"
    >
      <div
        className={`max-w-[1280px] w-full mx-auto px-6 flex ${
          side === "right" ? "justify-end" : "justify-start"
        }`}
      >
        <div className="max-w-md space-y-4">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-champagne">
            {label}
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-[1.06] tracking-tight text-pearl">
            {heading}
          </h2>
          <p className="font-body text-base sm:text-lg text-pearl/75 leading-relaxed">
            {body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
