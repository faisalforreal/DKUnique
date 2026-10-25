"use client";

import React from "react";
import { copy } from "@/content/copy";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";

interface ClosingCallSectionProps {
  onOpenQuoteModal: () => void;
}

export function ClosingCallSection({
  onOpenQuoteModal,
}: ClosingCallSectionProps) {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    "Hello DK Unique, I would like to request a quote."
  )}`;

  return (
    <section className="w-full bg-paper text-ink py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="border border-line bg-black/[0.02] p-8 sm:p-12 md:p-16 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-ink">
              {copy.closingCall.heading}
            </h2>
            <p className="font-body text-base sm:text-lg text-muted">
              {copy.closingCall.body}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenQuoteModal}
              className="w-full sm:w-auto px-6"
            >
              {copy.closingCall.buttons.quote}
            </Button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3.5 border border-ink text-ink font-body text-base font-medium rounded-[2px] hover:bg-ink/5 w-full sm:w-auto text-center"
            >
              {copy.closingCall.buttons.whatsapp}
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3.5 border border-ink text-ink font-body text-base font-medium rounded-[2px] hover:bg-ink/5 w-full sm:w-auto text-center"
            >
              {copy.closingCall.buttons.call}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
