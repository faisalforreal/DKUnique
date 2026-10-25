import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { GalleryClient } from "@/components/gallery/GalleryClient";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Product Gallery | DK Unique Production",
  description:
    "Product photography of holographic fans, display boxes, LED projectors and logo projectors.",
};

export default async function GalleryPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

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
          <span className="text-ink font-medium">Gallery</span>
        </div>

        {/* Header */}
        <div className="border-b border-line pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">
              Photo Catalogue
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            Equipment Gallery
          </h1>
          <p className="font-body text-base text-muted mt-2 max-w-xl">
            Real photos of our hardware inventory, display casings, and mounting accessories.
          </p>
        </div>

        {/* Gallery interactive component */}
        <GalleryClient products={products} categories={categories} />
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
