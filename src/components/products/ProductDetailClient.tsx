"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Product, Category } from "@/types";
import { copy } from "@/content/copy";
import { formatInr } from "@/lib/utils";
import { ProductViewer } from "@/components/three/ProductViewer";
import { Button } from "@/components/ui/Button";
import { QuoteModal } from "@/components/forms/QuoteModal";
import { siteConfig } from "@/config/site";

interface ProductDetailClientProps {
  product: Product;
  category: Category;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  category,
  relatedProducts,
}: ProductDetailClientProps) {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
      {/* Left Column: Sticky 3D Viewer or Image Gallery Stage Panel */}
      <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
        <ProductViewer
          model3d={product.model3d}
          productName={product.name}
          categoryName={category.name}
          images={product.images}
        />
      </div>

      {/* Right Column: Title, Pricing, MOQ, Spec Table, Description, Related */}
      <div className="lg:col-span-6 space-y-8">
        {/* Header Block */}
        <div className="space-y-3 border-b border-line pb-6">
          <span className="font-mono text-xs text-muted uppercase tracking-wider block">
            {category.name}
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-ink tracking-tight">
            {product.name}
          </h1>

          {/* Price & MOQ Row */}
          <div className="pt-2 flex flex-wrap items-baseline gap-6 sm:gap-8">
            <div>
              <span className="font-mono text-xs text-muted block mb-0.5">
                {copy.products.approxPrice}
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-ink">
                {formatInr(product.priceApprox)}
              </span>
            </div>

            <div>
              <span className="font-mono text-xs text-muted block mb-0.5">
                {copy.products.minimumOrder}
              </span>
              <span className="font-mono text-lg sm:text-xl font-medium text-ink">
                {product.moq !== null
                  ? `${product.moq} ${product.moqUnit}`
                  : "Ask us"}
              </span>
            </div>
          </div>

          {/* Action */}
          <div className="pt-4 flex flex-wrap gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setQuoteOpen(true)}
              className="px-8"
            >
              {copy.products.getQuote}
            </Button>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                `Hello, I would like to inquire about ${product.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3.5 border border-ink text-ink font-body text-sm font-medium rounded-[2px] hover:bg-ink/5"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Description Block */}
        <div className="space-y-2 border-b border-line pb-6">
          <span className="font-mono text-xs text-muted uppercase tracking-wider block">
            Overview
          </span>
          <p className="font-body text-base text-ink leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Specifications Datasheet Table in IBM Plex Mono */}
        {product.specs.length > 0 && (
          <div className="space-y-3 border-b border-line pb-6">
            <span className="font-mono text-xs text-muted uppercase tracking-wider block">
              {copy.products.specifications}
            </span>

            <div className="border border-line rounded-[2px] overflow-hidden bg-paper">
              <table className="w-full text-left border-collapse font-mono text-xs sm:text-sm">
                <tbody className="divide-y divide-line">
                  {product.specs.map((spec, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-black/[0.02] transition-colors"
                    >
                      <td className="py-2.5 px-4 font-medium text-muted w-1/3 bg-black/[0.01]">
                        {spec.label}
                      </td>
                      <td className="py-2.5 px-4 text-ink">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Neutral Disclaimer when flagged */}
            {product.flagged && (
              <p className="font-mono text-xs text-muted italic pt-1">
                {copy.products.unverifiedNote}
              </p>
            )}

            {/* Internal Review Diagnostic Mode if NEXT_PUBLIC_REVIEW_MODE=true */}
            {siteConfig.flags.reviewMode && product.flagged && (
              <div className="mt-3 p-3 bg-neutral-200 border border-neutral-300 rounded-[2px] font-mono text-xs text-neutral-800">
                <span className="font-bold block mb-1">Internal Notes:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {product.flagNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Related Products as a plain row list */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-2">
            <span className="font-mono text-xs text-muted uppercase tracking-wider block">
              {copy.products.relatedProducts}
            </span>
            <div className="divide-y divide-line border-t border-b border-line">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.categorySlug}/${rel.slug}`}
                  className="py-3 flex items-center justify-between hover:bg-black/[0.02] px-2 transition-colors group"
                >
                  <span className="font-body text-sm font-semibold text-ink group-hover:underline">
                    {rel.name}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs sm:text-sm text-muted">
                      {formatInr(rel.priceApprox)}
                    </span>
                    <span className="font-mono text-sm text-ink group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <QuoteModal
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        productName={product.name}
      />
    </div>
  );
}
