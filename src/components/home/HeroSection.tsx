"use client";

import React from "react";
import { copy } from "@/content/copy";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";

interface HeroSectionProps {
  trackRef: React.RefObject<HTMLDivElement | null>;
  onOpenQuoteModal: () => void;
}

export function HeroSection({ trackRef, onOpenQuoteModal }: HeroSectionProps) {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    "Hello, I am interested in 3D holographic fans from DK Unique Production."
  )}`;

  return (
    <section className="relative w-full bg-stage text-paper min-h-[90vh] md:min-h-screen flex items-center border-b border-line/20 overflow-hidden">
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-12 md:py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Mobile 3D Fan Stage (sits above text on small screens) */}
          <div className="lg:hidden w-full h-[280px] sm:h-[340px] relative">
            <div ref={trackRef} className="w-full h-full" />
          </div>

          {/* Left Column: Headline, Body, Actions, Facts */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8">
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
                href="#demo-videos"
              >
                {copy.hero.watchDemoButton}
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

          {/* Desktop Right Column: 3D Fan Stage */}
          <div className="hidden lg:block lg:col-span-5 h-[480px] xl:h-[560px] relative">
            <div ref={trackRef} className="w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
