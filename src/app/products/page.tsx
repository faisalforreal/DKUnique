import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/data";
import { copy } from "@/content/copy";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { ProductListClient } from "@/components/products/ProductListClient";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Products",
  description:
    "Complete equipment catalog of 3D holographic fans, display boxes, LED projectors and logo projectors.",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <OrganizationJsonLd />
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-muted mb-6">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">{copy.products.title}</span>
        </div>

        {/* Header */}
        <div className="border-b border-line pb-6 mb-8">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            {copy.products.title}
          </h1>
          <p className="font-body text-base text-muted mt-2 max-w-xl">
            Compare sizes, specifications, minimum order quantities and prices across our visual display hardware.
          </p>
        </div>

        {/* Interactive Filterable Catalog */}
        <Suspense fallback={<div className="py-12 font-mono text-sm text-muted">Loading catalog...</div>}>
          <ProductListClient
            initialProducts={products}
            categories={categories}
          />
        </Suspense>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
