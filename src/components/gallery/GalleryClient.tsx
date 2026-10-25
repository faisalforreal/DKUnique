"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, Category } from "@/types";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  productName: string;
  categorySlug: string;
  productSlug: string;
}

export function GalleryClient({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Flatten all product images
  const allItems: GalleryItem[] = products.flatMap((p) =>
    p.images.map((img, idx) => ({
      id: `${p.id}-${idx}`,
      src: img.src,
      alt: img.alt || p.name,
      productName: p.name,
      categorySlug: p.categorySlug,
      productSlug: p.slug,
    }))
  );

  const filteredItems =
    selectedCategory === "all"
      ? allItems
      : allItems.filter((item) => item.categorySlug === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-line pb-4">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 font-mono text-xs rounded-[2px] transition-colors ${
            selectedCategory === "all"
              ? "bg-ink text-paper font-semibold"
              : "bg-paper text-muted border border-line hover:text-ink hover:border-ink"
          }`}
        >
          All ({allItems.length})
        </button>
        {categories.map((cat) => {
          const count = allItems.filter(
            (item) => item.categorySlug === cat.slug
          ).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 font-mono text-xs rounded-[2px] transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-ink text-paper font-semibold"
                  : "bg-paper text-muted border border-line hover:text-ink hover:border-ink"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group relative aspect-square bg-neutral-100 border border-line rounded-[2px] overflow-hidden cursor-pointer hover:border-ink transition-colors"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-ink/90 text-paper p-2 text-left opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="font-mono text-[11px] truncate">{item.productName}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-paper border border-line rounded-[2px] overflow-hidden p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-ink">
                  {activeItem.productName}
                </h3>
                <p className="font-mono text-xs text-muted">
                  Category: {activeItem.categorySlug}
                </p>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="font-mono text-xs px-2.5 py-1 border border-line hover:border-ink rounded-[2px]"
              >
                Close [ESC]
              </button>
            </div>

            <div className="relative aspect-square max-h-[60vh] w-full bg-neutral-100 rounded-[2px] overflow-hidden border border-line">
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 90vw, 800px"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-xs text-muted">
                {activeItem.alt}
              </span>
              <Link
                href={`/products/${activeItem.categorySlug}/${activeItem.productSlug}`}
                className="font-mono text-xs px-4 py-2 bg-ink text-paper hover:bg-ink/90 rounded-[2px]"
              >
                View Product Details →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
