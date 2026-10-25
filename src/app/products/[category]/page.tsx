import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { ProductListClient } from "@/components/products/ProductListClient";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [allProducts, categories] = await Promise.all([
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
          <Link href="/products" className="hover:text-ink">
            Products
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">{category.name}</span>
        </div>

        {/* Header */}
        <div className="border-b border-line pb-6 mb-8">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            {category.name}
          </h1>
          <p className="font-body text-base text-muted mt-2 max-w-xl">
            {category.description}
          </p>
        </div>

        {/* Product Catalog */}
        <Suspense fallback={<div className="py-12 font-mono text-sm text-muted">Loading catalog...</div>}>
          <ProductListClient
            initialProducts={allProducts}
            categories={categories}
            selectedCategorySlug={category.slug}
          />
        </Suspense>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
