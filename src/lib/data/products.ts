import { products } from "@/data/products";
import type { Product } from "@/types";

export async function getProducts(): Promise<Product[]> {
  return products.filter((p) => p.visible);
}

export async function getAllProductsRaw(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = products.find((p) => p.slug === slug && p.visible);
  return product || null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return products.filter((p) => p.categorySlug === categorySlug && p.visible);
}

export async function getPopularFans(): Promise<Product[]> {
  // Section 10.6: 6 featured rows: 42 cm, 65 cm, 100 cm, 65 cm wall, and two of 46/60/80 cm
  const popularSlugs = [
    "42cm-3d-holographic-fan",
    "46cm-3d-holographic-fan",
    "60cm-3d-holographic-fan",
    "65cm-3d-holographic-fan",
    "100cm-3d-holographic-fan",
    "65cm-3d-holographic-fan-wall",
  ];
  return products.filter((p) => popularSlugs.includes(p.slug));
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
  // Returns unique physical fan models with a defined diameter, sorted ascending by sizeCm
  const fanModels = products.filter(
    (p) => p.categorySlug === "3d-holographic-fans" && typeof p.sizeCm === "number" && p.visible
  );

  return fanModels
    .map((f) => ({
      id: f.id,
      name: f.name,
      slug: f.slug,
      sizeCm: f.sizeCm as number,
      moq: f.moq,
      priceApprox: f.priceApprox,
    }))
    .sort((a, b) => a.sizeCm - b.sizeCm);
}
