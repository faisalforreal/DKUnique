"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";
import { copy } from "@/content/copy";

interface CategoriesIndexProps {
  categories: Category[];
}

export function CategoriesIndex({ categories }: CategoriesIndexProps) {

  return (
    <section className="w-full bg-paper text-ink py-20 border-b border-line">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-baseline gap-4 mb-12 border-b border-line pb-4">
          <span className="font-mono text-sm text-muted">01</span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink">
            {copy.categories.heading}
          </h2>
        </div>

        {/* Index Row List with Floating Hover Thumbnail */}
        <div className="relative divide-y divide-line">
          {categories.map((cat, idx) => {
            const numStr = String(idx + 1).padStart(2, "0");
            const href = cat.slug === "rental" ? "/rental" : `/products/${cat.slug}`;

            return (
              <Link
                key={cat.id}
                href={href}
                className="group py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-black/[0.02] px-2 sm:px-4"
              >
                <div className="flex items-start md:items-center gap-4 sm:gap-6">
                  <span className="font-mono text-xs sm:text-sm text-muted group-hover:text-ink pt-1 md:pt-0">
                    {numStr}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-ink group-hover:underline">
                      {cat.name}
                    </h3>
                    <p className="font-body text-sm text-muted mt-1 max-w-xl">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Mobile Inline Thumbnail */}
                <div className="md:hidden flex items-center justify-between pt-2">
                  <div className="relative w-16 h-16 bg-neutral-200 border border-line rounded-[2px] overflow-hidden flex-shrink-0">
                    <Image
                      src={cat.image.src}
                      alt={cat.image.alt}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <span className="font-mono text-lg text-ink">→</span>
                </div>

                {/* Desktop Arrow */}
                <span className="hidden md:inline-block font-mono text-xl text-ink transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
