"use client";

import React, { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { copy } from "@/content/copy";
import { motionConfig } from "@/config/motion";

interface HowItWorksSectionProps {
  trackRef: React.RefObject<HTMLDivElement | null>;
  progressRef: React.MutableRefObject<number>;
}

export function HowItWorksSection({
  trackRef,
  progressRef,
}: HowItWorksSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    progressRef.current = latest;

    const { ranges } = motionConfig.howItWorks;
    if (latest < ranges.textStep1End) {
      setActiveStep(1);
    } else if (latest < ranges.textStep2End) {
      setActiveStep(2);
    } else {
      setActiveStep(3);
    }
  });

  const steps = [
    { num: "01", text: copy.howItWorks.step1 },
    { num: "02", text: copy.howItWorks.step2 },
    { num: "03", text: copy.howItWorks.step3 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[220vh] md:h-[260vh] bg-stage text-paper border-b border-line/20"
    >
      {/* Sticky Viewport Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
        {/* Top Header */}
        <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between border-b border-line/20 pb-4 z-20">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-signal uppercase tracking-wider">
              Mechanism
            </span>
            <span className="text-line/40">/</span>
            <h2 className="font-display font-bold text-lg md:text-xl text-paper">
              {copy.howItWorks.heading}
            </h2>
          </div>
          <div className="font-mono text-xs text-paper/60">
            Scroll to observe
          </div>
        </div>

        {/* Center 3D Stage (Tracks R3F View) */}
        <div className="relative flex-1 w-full max-w-[800px] mx-auto flex items-center justify-center z-10">
          <div ref={trackRef} className="w-full h-full min-h-[300px]" />
        </div>

        {/* Bottom Step Text Carousel / Indicators */}
        <div className="max-w-[1280px] w-full mx-auto z-20 pt-4 border-t border-line/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => {
              const stepIndex = idx + 1;
              const isCurrent = activeStep === stepIndex;
              return (
                <div
                  key={step.num}
                  className={`transition-all duration-300 p-3 rounded-[2px] border ${
                    isCurrent
                      ? "border-signal bg-paper/[0.04]"
                      : "border-line/20 opacity-40"
                  }`}
                >
                  <div className="font-mono text-xs text-signal mb-1">
                    Step {step.num}
                  </div>
                  <p className="font-body text-sm md:text-base text-paper font-medium">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
