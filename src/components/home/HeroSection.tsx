"use client";

import React from "react";
import { View } from "@react-three/drei";
import { copy } from "@/content/copy";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { HeroFanModel } from "@/components/three/HeroFanModel";
import { ViewCameraSetup } from "@/components/three/ViewCameraSetup";

interface HeroSectionProps {
  onOpenQuoteModal: () => void;
}

export function HeroSection({ onOpenQuoteModal }: HeroSectionProps) {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    "Hello, I am interested in 3D holographic fans from DK Unique Production."
  )}`;

  return (
    <section className="relative w-full bg-stage text-paper min-h-[90vh] md:min-h-screen flex items-center border-b border-line/20 overflow-hidden">
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-12 md:py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline, Body, Actions, Facts */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-paper tracking-tight leading-[1.08]">
                {copy.hero.h1}
              </h1>
              <p className="font-body text-base sm:text-lg text-paper/80 max-w-xl leading-relaxed">
                {copy.hero.body}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="stagePrimary"
                size="lg"
                onClick={onOpenQuoteModal}
              >
                {copy.hero.getQuoteButton}
              </Button>
              <Button
                variant="stageSecondary"
                size="lg"
                href="#studio"
              >
                Try 3D Studio
              </Button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-paper/90 hover:text-signal underline underline-offset-4 ml-1"
              >
                {copy.hero.whatsappLink}
              </a>
            </div>

            {/* Factual Credentials Strip with hairlines */}
            <div className="pt-8 border-t border-line/20">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-line/20">
                {copy.hero.facts.map((fact, idx) => (
                  <div
                    key={idx}
                    className={`font-mono text-xs text-paper/70 tracking-wider uppercase pt-2 sm:pt-0 ${
                      idx > 0 ? "sm:pl-4" : ""
                    }`}
                  >
                    {fact}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Single Responsive 3D Fan Stage */}
          <div className="lg:col-span-5 w-full h-[340px] sm:h-[420px] lg:h-[500px] xl:h-[580px] relative order-1 lg:order-2 flex flex-col items-center justify-center">
            <View className="w-full h-full">
              <ViewCameraSetup />
              <ambientLight intensity={1.5} />
              <directionalLight position={[4, 5, 5]} intensity={2.2} />
              <directionalLight position={[-4, -2, -3]} intensity={1.2} />
              <directionalLight position={[-3, 2, 3]} intensity={1.6} color="#2BD9E6" />
              <HeroFanModel mode="hero" scale={1.25} />
            </View>
          </div>
        </div>
      </div>
    </section>
  );
}
