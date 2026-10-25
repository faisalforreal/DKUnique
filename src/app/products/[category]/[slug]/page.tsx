import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProductsRaw,
  getProductBySlug,
  getCategoryBySlug,
  getProducts,
} from "@/lib/data";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { ProductJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const allProducts = await getAllProductsRaw();
  return allProducts.map((p) => ({
    category: p.categorySlug,
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { category: catSlug, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.categorySlug !== catSlug) {
    notFound();
  }

  const category = await getCategoryBySlug(catSlug);
  if (!category) {
    notFound();
  }

  // Fetch related products
  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter(
    (p) => product.relatedSlugs?.includes(p.slug) && p.id !== product.id
  );

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <ProductJsonLd product={product} />
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-mono text-xs text-muted mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-ink">
            Products
          </Link>
          <span>/</span>
          <Link href={`/products/${category.slug}`} className="hover:text-ink">
            {category.name}
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">{product.name}</span>
        </div>

        {/* Product Detail Stage & Specification Grid */}
        <ProductDetailClient
          product={product}
          category={category}
          relatedProducts={relatedProducts}
        />
      </main>

      <Footer />
      <MobileBottomBar productName={product.name} />
    </div>
  );
}
