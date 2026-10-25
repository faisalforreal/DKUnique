"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { Product, Category } from "@/types";
import { copy } from "@/content/copy";
import { formatInr } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/FormField";
import { QuoteModal } from "@/components/forms/QuoteModal";

interface ProductListClientProps {
  initialProducts: Product[];
  categories: Category[];
  selectedCategorySlug?: string;
}

export function ProductListClient({
  initialProducts,
  categories,
  selectedCategorySlug,
}: ProductListClientProps) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState<string>(
    selectedCategorySlug || searchParams.get("category") || "all"
  );
  const [sortOption, setSortOption] = useState<string>("default");

  // Quote modal
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>();

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter((p) => p.categorySlug === activeCategory);
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.specs.some(
            (s) =>
              s.label.toLowerCase().includes(q) ||
              s.value.toLowerCase().includes(q)
          )
      );
    }

    // Sort filter
    if (sortOption === "priceAsc") {
      result.sort((a, b) => (a.priceApprox ?? 0) - (b.priceApprox ?? 0));
    } else if (sortOption === "priceDesc") {
      result.sort((a, b) => (b.priceApprox ?? 0) - (a.priceApprox ?? 0));
    }

    return result;
  }, [initialProducts, activeCategory, searchTerm, sortOption]);

  const handleOpenQuote = (name?: string) => {
    setSelectedProduct(name);
    setQuoteOpen(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Filter Column */}
      <aside className="lg:col-span-3 space-y-6 bg-paper border border-line p-4 sm:p-5 rounded-[2px]">
        {/* Search Input */}
        <div className="space-y-1.5">
          <label className="font-mono text-xs text-muted uppercase tracking-wider block">
            Search
          </label>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category List */}
        <div className="space-y-2 pt-2 border-t border-line">
          <label className="font-mono text-xs text-muted uppercase tracking-wider block">
            {copy.products.filterHeading}
          </label>
          <div className="flex flex-col space-y-1">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`text-left text-sm py-1.5 px-2 rounded-[2px] transition-colors ${
                activeCategory === "all"
                  ? "bg-ink text-paper font-medium"
                  : "text-ink hover:bg-black/[0.04]"
              }`}
            >
              {copy.products.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={`text-left text-sm py-1.5 px-2 rounded-[2px] transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-ink text-paper font-medium"
                    : "text-ink hover:bg-black/[0.04]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Select */}
        <div className="space-y-1.5 pt-2 border-t border-line">
          <label className="font-mono text-xs text-muted uppercase tracking-wider block">
            {copy.products.sortHeading}
          </label>
          <Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">{copy.products.sortOptions.default}</option>
            <option value="priceAsc">{copy.products.sortOptions.priceAsc}</option>
            <option value="priceDesc">{copy.products.sortOptions.priceDesc}</option>
          </Select>
        </div>
      </aside>

      {/* Right Results: Datasheet Table */}
      <div className="lg:col-span-9 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <span className="font-mono text-xs text-muted uppercase tracking-wider">
            {filteredProducts.length} Models Available
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center border border-line bg-paper rounded-[2px] p-6">
            <p className="font-body text-base text-muted">
              {copy.products.emptyState}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-line bg-paper rounded-[2px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-black/[0.02] font-mono text-xs text-muted uppercase tracking-wider">
                  <th className="py-3 px-4 w-16">Photo</th>
                  <th className="py-3 px-4">Model & Description</th>
                  <th className="py-3 px-4">{copy.products.minimumOrder}</th>
                  <th className="py-3 px-4">{copy.products.approxPrice}</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-black/[0.02] transition-colors"
                  >
                    {/* Photo */}
                    <td className="py-3.5 px-4">
                      <div className="relative w-14 h-14 bg-neutral-200 border border-line rounded-[2px] overflow-hidden flex-shrink-0">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0].src}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-muted text-center p-1 bg-[#E4E0D7]">
                            No Photo
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name & Slug Link */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <Link
                        href={`/products/${product.categorySlug}/${product.slug}`}
                        className="font-body font-semibold text-sm sm:text-base text-ink hover:underline block"
                      >
                        {product.name}
                      </Link>
                      <p className="font-body text-xs text-muted line-clamp-1 mt-0.5">
                        {product.description}
                      </p>
                    </td>

                    {/* MOQ */}
                    <td className="py-3.5 px-4 font-mono text-sm text-ink whitespace-nowrap">
                      {product.moq !== null
                        ? `${product.moq} ${product.moqUnit}`
                        : "Ask us"}
                    </td>

                    {/* Approx Price */}
                    <td className="py-3.5 px-4 font-mono text-sm text-ink font-semibold whitespace-nowrap">
                      {formatInr(product.priceApprox)}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenQuote(product.name)}
                      >
                        {copy.products.getQuote}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <QuoteModal
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        productName={selectedProduct}
      />
    </div>
  );
}
