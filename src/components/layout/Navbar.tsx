"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { siteConfig } from "@/config/site";
import { copy } from "@/content/copy";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  onOpenQuoteModal?: () => void;
}

export function Navbar({ onOpenQuoteModal }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // The homepage opens with a dark immersive showroom; use a dark nav there.
  const dark = pathname === "/";

  const navLinks = [
    { href: "/products", label: copy.nav.products },
    { href: "/rental", label: copy.nav.rental },
    { href: "/demo", label: copy.nav.demo },
    { href: "/gallery", label: copy.nav.gallery },
    { href: "/about", label: copy.nav.about },
    { href: "/contact", label: copy.nav.contact },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b ${
        dark
          ? "bg-midnight/85 backdrop-blur border-champagne/15"
          : "bg-paper border-line"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-8">
          <Logo inverted={dark} />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-body transition-colors ${
                    isActive
                      ? dark
                        ? "text-pearl font-semibold"
                        : "text-ink font-semibold"
                      : dark
                        ? "text-pearl/70 hover:text-pearl"
                        : "text-muted hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Phone + Quote Button */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href={`tel:${siteConfig.phone}`}
            className={`font-mono text-xs hover:underline tracking-tight ${
              dark ? "text-pearl" : "text-ink"
            }`}
            aria-label={`Call ${siteConfig.phoneDisplay}`}
          >
            {siteConfig.phoneDisplay}
          </a>
          <Button
            variant={dark ? "stagePrimary" : "primary"}
            size="sm"
            onClick={onOpenQuoteModal}
            className="px-4 py-2"
          >
            {copy.nav.getQuote}
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 border rounded-[2px] ${
              dark
                ? "border-champagne/30 text-pearl hover:bg-pearl hover:text-midnight"
                : "border-line text-ink hover:bg-ink hover:text-paper"
            }`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="font-mono text-xs uppercase">
              {mobileMenuOpen ? "Close" : "Menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 py-4 space-y-3 ${
            dark ? "bg-midnight border-champagne/15" : "bg-paper border-line"
          }`}
        >
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 text-base font-body border-b ${
                  dark ? "border-champagne/10 text-pearl" : "border-line/40 text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-2">
            <a
              href={`tel:${siteConfig.phone}`}
              className={`py-2 font-mono text-sm border text-center rounded-[2px] ${
                dark ? "border-champagne/30 text-pearl" : "border-line text-ink"
              }`}
            >
              Call: {siteConfig.phoneDisplay}
            </a>
            <Button
              variant={dark ? "stagePrimary" : "primary"}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal?.();
              }}
              className="w-full"
            >
              {copy.nav.getQuote}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
