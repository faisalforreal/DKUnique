import { categories } from "@/data/categories";
import type { Category } from "@/types";
import { isSanityConfigured, fetchFromSanity } from "@/sanity/client";

export async function getCategories(): Promise<Category[]> {
  if (isSanityConfigured) {
    const result = await fetchFromSanity<Category[]>(
      `*[_type == "category"] | order(order asc)`
    );
    if (result && result.length > 0) {
      return result;
    }
  }
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isSanityConfigured) {
    const result = await fetchFromSanity<Category>(
      `*[_type == "category" && slug.current == $slug][0]`,
      { slug }
    );
    if (result) {
      return result;
    }
  }
  const cat = categories.find((c) => c.slug === slug);
  return cat || null;
}
