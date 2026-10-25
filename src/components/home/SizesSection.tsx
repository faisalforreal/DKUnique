"use client";

import React, { useRef, useState } from "react";
import { View } from "@react-three/drei";
import { useScroll, useMotionValueEvent } from "motion/react";
import type { FanSizeEntry } from "@/lib/data/products";
import { copy } from "@/content/copy";
import { formatInr } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { HeroFanModel } from "@/components/three/HeroFanModel";
import { ViewCameraSetup } from "@/components/three/ViewCameraSetup";

interface SizesSectionProps {
  models: FanSizeEntry[];
  onSelectModelQuote: (modelName: string) => void;
}

export function SizesSection({
  models,
  onSelectModelQuote,
}: SizesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    progressRef.current = latest;
    const total = models.length;
    if (total > 0) {
      const idx = Math.min(total - 1, Math.floor(latest * total));
      setSelectedIndex(idx);
    }
  });

  const activeModel = models[selectedIndex] || models[0];

  return (
    <section
      id="sizes"
      ref={containerRef}
      className="relative w-full h-[200vh] md:h-[240vh] bg-stage text-paper border-b border-line/20"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
        {/* Top Header */}
        <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between border-b border-line/20 pb-4 z-20">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-signal uppercase tracking-wider">
              {copy.sizes.heading}
            </span>
            <span className="text-line/40">/</span>
            <h2 className="font-display font-bold text-lg md:text-xl text-paper">
              {copy.sizes.subheading}
            </h2>
          </div>
          <div className="font-mono text-xs text-paper/60">
            {activeModel ? `${activeModel.sizeCm} cm` : ""}
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
              mode="sizes"
              progressRef={progressRef}
            />
          </View>
        </div>

        {/* Bottom Real-time Datasheet Strip (Generated from Data Layer) */}
        <div className="max-w-[1280px] w-full mx-auto z-20 pt-4 border-t border-line/20">
          {activeModel && (
            <div className="bg-paper/[0.04] border border-line/30 p-4 sm:p-6 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="font-mono text-xs text-signal uppercase tracking-wider">
                  Active Specification
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-paper">
                  {activeModel.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 w-full md:w-auto">
                <div>
                  <span className="font-mono text-xs text-paper/50 block">
                    {copy.sizes.modelLabel}
                  </span>
                  <span className="font-mono text-sm sm:text-base text-paper font-semibold">
                    {activeModel.sizeCm} cm
                  </span>
                </div>

                <div>
                  <span className="font-mono text-xs text-paper/50 block">
                    {copy.sizes.moqLabel}
                  </span>
                  <span className="font-mono text-sm sm:text-base text-paper font-semibold">
                    {activeModel.moq !== null
                      ? `${activeModel.moq} Piece`
                      : copy.sizes.noMoqText}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-xs text-paper/50 block">
                    {copy.sizes.priceLabel}
                  </span>
                  <span className="font-mono text-sm sm:text-base text-paper font-semibold">
                    {activeModel.priceApprox !== null
                      ? formatInr(activeModel.priceApprox)
                      : "Ask us"}
                  </span>
                </div>
              </div>

              <Button
                variant="stagePrimary"
                size="sm"
                onClick={() => onSelectModelQuote(activeModel.name)}
                className="w-full md:w-auto"
              >
                {copy.popularFans.columns.action}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
