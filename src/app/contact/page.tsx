import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { copy } from "@/content/copy";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { ContactForm } from "@/components/forms/ContactForm";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { DirectionsButton } from "@/components/ui/DirectionsButton";
import { CopyAddressButton } from "@/components/ui/CopyAddressButton";
import { PhoneButton } from "@/components/ui/PhoneButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact Us | DK Unique Production",
  description:
    "Contact DK Unique Production in Okhla Phase 2, New Delhi. Phone, WhatsApp, address and enquiry form.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <OrganizationJsonLd />
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">Contact</span>
        </div>

        {/* Header */}
        <div className="border-b border-line pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">
              01 / Get in Touch
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            Contact DK Unique Production
          </h1>
          <p className="font-body text-base text-muted mt-2 max-w-xl">
            Reach our office in Okhla, New Delhi for quotes, equipment specifications, or bulk order pricing.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info & Map */}
          <div className="lg:col-span-6 space-y-8">
            {/* Address & Note */}
            <div className="border border-line bg-paper p-6 rounded-[2px] space-y-4">
              <h3 className="font-display font-bold text-lg text-ink">
                Office & Warehouse
              </h3>
              <div className="font-mono text-xs sm:text-sm text-ink/90 leading-relaxed space-y-1">
                <p className="font-medium text-ink">{siteConfig.name}</p>
                <p>{siteConfig.address.line1}</p>
                <p>{siteConfig.address.area}</p>
                <p>
                  {siteConfig.address.district}, {siteConfig.address.city} - {siteConfig.address.pincode}
                </p>
                <p>{siteConfig.address.country}</p>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-[2px]">
                <p className="font-mono text-xs text-amber-950">
                  Notice: {copy.findUs.note}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <DirectionsButton />
                <CopyAddressButton />
              </div>
            </div>

            {/* Direct Connect Options */}
            <div className="border border-line bg-paper p-6 rounded-[2px] space-y-4">
              <h3 className="font-display font-bold text-lg text-ink">
                Direct Communication
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <PhoneButton />
                <WhatsAppButton />
              </div>

              {siteConfig.email && (
                <div className="pt-2 font-mono text-xs">
                  <span className="text-muted">Email: </span>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-ink hover:underline"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              )}

              <div className="border-t border-line pt-3 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-muted">
                <span>{copy.footer.gst}</span>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink underline"
                >
                  Instagram {siteConfig.social.instagramHandle}
                </a>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="w-full aspect-video bg-neutral-200 border border-line rounded-[2px] overflow-hidden">
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
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-6">
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
