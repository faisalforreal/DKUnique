"use client";

import React, { useRef, useState, useEffect } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { copy } from "@/content/copy";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { HOLOGRAM_MODELS } from "@/components/three/HologramModel";
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

  const [activeStyleIndex, setActiveStyleIndex] = useState(0);
  const [autoSpin, setAutoSpin] = useState(true);
  const [showFan, setShowFan] = useState(false);
  const [domReady, setDomReady] = useState(false);

  useEffect(() => {
    setDomReady(true);
  }, []);

  const activeStyle = HOLOGRAM_MODELS[activeStyleIndex];
  const activeStyleCopy = copy.studio.styles[activeStyleIndex] || copy.studio.styles[0];

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const whatsappConsultUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    `Hello, I would like to consult on custom 3D holographic visuals for my brand (Style: ${activeStyle.name}).`
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
              {/* Subtle Ambient Radial Glow matching selected style */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 blur-3xl transition-colors duration-700"
                style={{
                  background: `radial-gradient(circle at center, ${activeStyle.accent} 0%, transparent 70%)`,
                }}
              />

              {/* R3F Drei View */}
              {domReady && trackRef.current && (
                <HologramStudioView
                  trackRef={trackRef}
                  domElement={trackRef.current}
                  styleIndex={activeStyleIndex}
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
                <span
                  className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded border"
                  style={{
                    color: activeStyle.accent,
                    borderColor: `${activeStyle.accent}40`,
                    backgroundColor: `${activeStyle.accent}15`,
                  }}
                >
                  {activeStyle.name}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Style Palette & Actions */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-paper/50">
                {copy.studio.stylesLabel}
              </span>
              <h3 className="font-display font-bold text-2xl text-paper">
                {activeStyleCopy.name}
              </h3>
              <p className="font-body text-sm text-paper/70 leading-relaxed">
                {activeStyleCopy.description}
              </p>
            </div>

            {/* Style Selector Buttons */}
            <div className="space-y-2.5 pt-2">
              {HOLOGRAM_MODELS.map((item, idx) => {
                const isSelected = idx === activeStyleIndex;
                const itemCopy = copy.studio.styles[idx] || copy.studio.styles[0];

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveStyleIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? "border-signal bg-white/[0.06] shadow-lg shadow-black/40"
                        : "border-line/30 bg-white/[0.02] hover:bg-white/[0.04] hover:border-line/60"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Color Glow Dot Swatch */}
                      <span
                        className="w-4 h-4 rounded-full flex-shrink-0 transition-transform"
                        style={{
                          backgroundColor: item.accent,
                          boxShadow: isSelected
                            ? `0 0 12px ${item.accent}, 0 0 4px ${item.glow}`
                            : `0 0 4px ${item.accent}80`,
                          transform: isSelected ? "scale(1.2)" : "scale(1.0)",
                        }}
                      />
                      <div>
                        <div
                          className={`font-display text-sm font-semibold transition-colors ${
                            isSelected ? "text-paper" : "text-paper/80"
                          }`}
                        >
                          {itemCopy.name}
                        </div>
                        <div className="font-body text-xs text-paper/50 line-clamp-1 mt-0.5">
                          {itemCopy.description}
                        </div>
                      </div>
                    </div>

                    <span className="font-mono text-xs text-paper/40">
                      0{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-line/20 space-y-3">
              <Button
                variant="stagePrimary"
                size="lg"
                className="w-full justify-center"
                onClick={() => onSelectStyleQuote(activeStyle.name)}
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
