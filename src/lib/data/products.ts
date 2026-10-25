import { products } from "@/data/products";
import type { Product } from "@/types";
import { isSanityConfigured, fetchFromSanity } from "@/sanity/client";

export async function getProducts(): Promise<Product[]> {
  if (isSanityConfigured) {
    const result = await fetchFromSanity<Product[]>(
      `*[_type == "product" && (!defined(visible) || visible == true)]`
    );
    if (result && result.length > 0) {
      return result;
    }
  }
  return products.filter((p) => p.visible);
}

export async function getAllProductsRaw(): Promise<Product[]> {
  if (isSanityConfigured) {
    const result = await fetchFromSanity<Product[]>(`*[_type == "product"]`);
    if (result && result.length > 0) {
      return result;
    }
  }
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSanityConfigured) {
    const result = await fetchFromSanity<Product>(
      `*[_type == "product" && slug.current == $slug && (!defined(visible) || visible == true)][0]`,
      { slug }
    );
    if (result) {
      return result;
    }
  }
  const product = products.find((p) => p.slug === slug && p.visible);
  return product || null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  if (isSanityConfigured) {
    const result = await fetchFromSanity<Product[]>(
      `*[_type == "product" && categorySlug == $categorySlug && (!defined(visible) || visible == true)]`,
      { categorySlug }
    );
    if (result && result.length > 0) {
      return result;
    }
  }
  return products.filter((p) => p.categorySlug === categorySlug && p.visible);
}

export async function getPopularFans(): Promise<Product[]> {
  const all = await getProducts();
  const popularSlugs = [
    "42cm-3d-holographic-fan",
    "46cm-3d-holographic-fan",
    "60cm-3d-holographic-fan",
    "65cm-3d-holographic-fan",
    "100cm-3d-holographic-fan",
    "65cm-3d-holographic-fan-wall",
  ];
  return all.filter((p) => popularSlugs.includes(p.slug));
}

export interface FanSizeEntry {
  id: string;
  name: string;
  slug: string;
  sizeCm: number;
  moq: number | null;
  priceApprox: number | null;
}

export async function getFanSizes(): Promise<FanSizeEntry[]> {
  const all = await getProducts();
  const fanModels = all.filter(
    (p) => p.categorySlug === "3d-holographic-fans" && typeof p.sizeCm === "number" && p.visible
  );

  return fanModels
    .map((f) => ({
      id: f.id,
      name: f.name,
      slug: f.slug,
      sizeCm: f.sizeCm as number,
      moq: f.moq ?? null,
      priceApprox: f.priceApprox ?? null,
    }))
    .sort((a, b) => a.sizeCm - b.sizeCm);
}
