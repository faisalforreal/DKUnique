"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { copy } from "@/content/copy";
import { QuoteModal } from "@/components/forms/QuoteModal";

interface MobileBottomBarProps {
  onOpenQuoteModal?: () => void;
  productName?: string;
}

export function MobileBottomBar({
  onOpenQuoteModal,
  productName,
}: MobileBottomBarProps) {
  const [internalQuoteOpen, setInternalQuoteOpen] = useState(false);

  const handleClickQuote = () => {
    if (onOpenQuoteModal) {
      onOpenQuoteModal();
    } else {
      setInternalQuoteOpen(true);
    }
  };

  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
    productName
      ? `Hello, I am enquiring about ${productName} from DK Unique Production.`
      : "Hello, I am enquiring about products from DK Unique Production."
  )}`;

  return (
    <>
      <aside
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper border-t border-line px-2 py-2 safe-area-bottom shadow-sm"
        aria-label="Quick Actions"
      >
        <div className="grid grid-cols-3 gap-2">
          {/* 1. Call Button */}
          <a
            href={`tel:${siteConfig.phone}`}
            className="flex items-center justify-center min-h-[44px] px-2 py-2 border border-ink text-ink font-body text-xs font-medium text-center rounded-[2px] active:bg-ink active:text-paper"
          >
            Call
          </a>

          {/* 2. WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center min-h-[44px] px-2 py-2 border border-ink text-ink font-body text-xs font-medium text-center rounded-[2px] active:bg-ink active:text-paper"
          >
            WhatsApp
          </a>

          {/* 3. Get a Quote Button */}
          <button
            type="button"
            onClick={handleClickQuote}
            className="flex items-center justify-center min-h-[44px] px-2 py-2 bg-ink text-paper font-body text-xs font-medium text-center rounded-[2px] active:bg-ink/90"
          >
            {copy.nav.getQuote}
          </button>
        </div>
      </aside>

      {/* Internal Quote Modal if standalone */}
      {!onOpenQuoteModal && (
        <QuoteModal
          open={internalQuoteOpen}
          onOpenChange={setInternalQuoteOpen}
          productName={productName}
        />
      )}
    </>
  );
}
