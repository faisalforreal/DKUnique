"use client";

import React, { useState } from "react";
import { copy } from "@/content/copy";
import { siteConfig } from "@/config/site";
import { DirectionsButton } from "@/components/ui/DirectionsButton";
import { Button } from "@/components/ui/Button";

export function FindUsSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.address.full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="w-full bg-paper text-ink py-20 border-b border-line">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-baseline gap-4 mb-10 border-b border-line pb-4">
          <span className="font-mono text-sm text-muted">05</span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink">
            {copy.findUs.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Embedded Google Map */}
          <div className="lg:col-span-7 w-full aspect-[4/3] sm:aspect-[16/10] bg-neutral-200 border border-line rounded-[2px] overflow-hidden">
            <iframe
              src={siteConfig.maps.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="DK Unique Production Office Map"
              className="w-full h-full"
            />
          </div>

          {/* Address, Note, and Direction Actions */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="space-y-2 border-b border-line pb-6">
              <span className="font-mono text-xs text-muted uppercase tracking-wider block">
                Office & Workshop Address
              </span>
              <p className="font-body text-base sm:text-lg text-ink font-medium leading-relaxed">
                {siteConfig.address.full}
              </p>
            </div>

            {/* Visit Note */}
            <div className="p-4 bg-black/[0.02] border border-line rounded-[2px]">
              <span className="font-mono text-xs text-muted uppercase tracking-wider block mb-1">
                Notice
              </span>
              <p className="font-body text-sm text-ink">
                {copy.findUs.note}
              </p>
            </div>

            {/* Actions: Directions + Copy Address */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <DirectionsButton variant="primary" size="md" />
              <Button
                variant="secondary"
                size="md"
                onClick={handleCopyAddress}
              >
                {copied ? copy.findUs.addressCopied : copy.findUs.copyAddress}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
