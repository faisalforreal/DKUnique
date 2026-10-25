import { categories } from "@/data/categories";
import type { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cat = categories.find((c) => c.slug === slug);
  return cat || null;
}
