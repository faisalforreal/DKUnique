"use client";

import React, { useRef, useState } from "react";
import { View } from "@react-three/drei";
import { useScroll, useMotionValueEvent } from "motion/react";
import { copy } from "@/content/copy";
import { motionConfig } from "@/config/motion";
import { HeroFanModel } from "@/components/three/HeroFanModel";
import { ViewCameraSetup } from "@/components/three/ViewCameraSetup";

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
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
      id="how-it-works"
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
          <View className="w-full h-full min-h-[300px]">
            <ViewCameraSetup />
            <ambientLight intensity={1.5} />
            <directionalLight position={[4, 5, 5]} intensity={2.2} />
            <directionalLight position={[-4, -2, -3]} intensity={1.2} />
            <directionalLight position={[-3, 2, 3]} intensity={1.6} color="#2BD9E6" />
            <HeroFanModel
              mode="how-it-works"
              progressRef={progressRef}
              scale={1.2}
            />
          </View>
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
