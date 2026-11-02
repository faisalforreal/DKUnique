"use client";

import React, { useRef, useState, useEffect } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { copy } from "@/content/copy";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { HologramStudioView } from "@/components/three/HologramStudioView";

interface HologramStudioSectionProps {
  onSelectStyleQuote: (styleName: string) => void;
}

export function HologramStudioSection({
  onSelectStyleQuote,
}: HologramStudioSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const [autoSpin, setAutoSpin] = useState(true);
  const [showFan, setShowFan] = useState(false);
  const [domReady, setDomReady] = useState(false);

  useEffect(() => {
    setDomReady(true);
  }, []);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const whatsappConsultUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    "Hello, I would like to consult on custom 3D holographic visuals for my brand."
  )}`;

  return (
    <section
      id="studio"
      ref={containerRef}
      className="relative w-full bg-stage text-paper py-16 sm:py-24 border-b border-line/20 overflow-hidden"
    >
      <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-line/20 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-signal animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-paper/70">
                Live 3D Customizer
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-paper tracking-tight">
              {copy.studio.heading}
            </h2>
            <p className="font-body text-base text-paper/70 leading-relaxed">
              {copy.studio.subheading}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAutoSpin((prev) => !prev)}
              className={`font-mono text-xs px-3 py-1.5 rounded border transition-colors ${
                autoSpin
                  ? "border-signal text-signal bg-signal/10"
                  : "border-line/40 text-paper/60 hover:text-paper"
              }`}
            >
              {copy.studio.autoSpin}: {autoSpin ? "On" : "Off"}
            </button>
            <button
              type="button"
              onClick={() => setShowFan((prev) => !prev)}
              className={`font-mono text-xs px-3 py-1.5 rounded border transition-colors ${
                showFan
                  ? "border-signal text-signal bg-signal/10"
                  : "border-line/40 text-paper/60 hover:text-paper"
              }`}
            >
              {copy.studio.showFan}: {showFan ? "Visible" : "Hidden"}
            </button>
            <button
              type="button"
              onClick={handleResetView}
              className="font-mono text-xs px-3 py-1.5 rounded border border-line/40 text-paper/60 hover:text-paper hover:border-line transition-colors"
            >
              {copy.studio.resetView}
            </button>
          </div>
        </div>

        {/* Studio Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-center">
          {/* Left Column: 3D Stage Viewer */}
          <div className="lg:col-span-7">
            <div
              ref={trackRef}
              className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] rounded-xl border border-line/30 bg-black/40 flex items-center justify-center overflow-hidden touch-none"
            >
              {/* Subtle Ambient Radial Glow */}
              <div className="absolute inset-0 pointer-events-none opacity-20 blur-3xl bg-[radial-gradient(circle_at_center,_#00E5FF_0%,_transparent_70%)]" />

              {/* R3F Drei View */}
              {domReady && trackRef.current && (
                <HologramStudioView
                  trackRef={trackRef}
                  domElement={trackRef.current}
                  autoSpin={autoSpin}
                  showFan={showFan}
                  controlsRef={controlsRef}
                />
              )}

              {/* Bottom Stage Overlay Drag Hint */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="font-mono text-[11px] text-paper/50 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-line/20">
                  {copy.studio.rotateHint}
                </span>
                <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded border border-signal/40 bg-signal/15 text-signal">
                  Auto Color Spectrum
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Feature Highlights & Actions */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="space-y-4 pt-2">
              {copy.studio.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-line/30 bg-white/[0.02] flex items-start gap-4"
                >
                  <span className="font-mono text-xs text-signal font-semibold pt-0.5">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-paper">
                      {feature.title}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-paper/70 mt-1 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-line/20 space-y-3">
              <Button
                variant="stagePrimary"
                size="lg"
                className="w-full justify-center"
                onClick={() => onSelectStyleQuote("3D Hologram Loop")}
              >
                {copy.studio.quoteButton}
              </Button>

              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="font-body text-xs text-paper/60">
                  {copy.studio.customHelp}
                </span>
                <a
                  href={whatsappConsultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-signal hover:underline flex-shrink-0"
                >
                  Chat with us →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
