import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { copy } from "@/content/copy";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { DirectionsButton } from "@/components/ui/DirectionsButton";
import { PhoneButton } from "@/components/ui/PhoneButton";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us | DK Unique Production",
  description: copy.about.body,
};

export default function AboutPage() {
  const companyFacts = [
    { label: "Business Name", value: siteConfig.name },
    { label: "Year Established", value: "2020" },
    { label: "Business Type", value: "Proprietorship" },
    { label: "Owner / Proprietor", value: siteConfig.owner.name },
    { label: "GST Registration", value: siteConfig.gstNumber },
    {
      label: "Registered Address",
      value: "B-46, DDA Sheds, Okhla Industrial Area Phase 2, South East Delhi, New Delhi 110020",
    },
    {
      label: "Nature of Business",
      value: "Wholesale and retail trade of holographic fans, display boxes, LED projectors and accessories",
    },
    { label: "Primary Phone", value: siteConfig.phoneDisplay },
    { label: "Instagram", value: "@dkunique.376" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <OrganizationJsonLd />
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">About</span>
        </div>

        {/* Section 1: Intro */}
        <section className="border-b border-line pb-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">
              Company Information
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            {copy.about.heading}
          </h1>
          <p className="font-body text-lg text-ink/90 max-w-2xl leading-relaxed">
            {copy.about.body}
          </p>
          <div className="pt-2">
            <span className="inline-block font-mono text-sm px-3 py-1 bg-black/[0.04] border border-line rounded-[2px] text-ink">
              {copy.about.owner}
            </span>
          </div>
        </section>

        {/* Section 2: Business Facts Table */}
        <section className="space-y-4">
          <h2 className="font-display font-bold text-xl text-ink tracking-tight">
            Business Details
          </h2>
          <div className="border border-line rounded-[2px] overflow-hidden bg-paper">
            <table className="w-full text-left font-mono text-xs sm:text-sm">
              <tbody>
                {companyFacts.map((fact, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-line/60 last:border-0 hover:bg-black/[0.02] transition-colors"
                  >
                    <td className="w-1/3 py-3 px-4 sm:px-6 text-muted font-medium bg-black/[0.01]">
                      {fact.label}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-ink">
                      {fact.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Visit or Inquire */}
        <section className="border border-line rounded-[2px] p-6 sm:p-8 bg-paper flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-xl text-ink">
              Visit our Okhla location
            </h3>
            <p className="font-body text-sm text-muted mt-1 max-w-md">
              Our office and warehouse is in Okhla Phase 2, New Delhi. Please call before visiting to confirm stock availability.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PhoneButton />
            <DirectionsButton />
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
