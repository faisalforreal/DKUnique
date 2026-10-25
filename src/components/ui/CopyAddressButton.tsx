"use client";

import React, { useState } from "react";
import { siteConfig } from "@/config/site";
import { copy } from "@/content/copy";
import { Button } from "./Button";

export function CopyAddressButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.address.full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleCopy}
      className={className}
    >
      {copied ? copy.findUs.addressCopied : copy.findUs.copyAddress}
    </Button>
  );
}
