import { services } from "@/data/services";
import type { Service } from "@/types";
import { isSanityConfigured, fetchFromSanity } from "@/sanity/client";

export async function getServices(): Promise<Service[]> {
  if (isSanityConfigured) {
    const result = await fetchFromSanity<Service[]>(`*[_type == "service"]`);
    if (result && result.length > 0) {
      return result;
    }
  }
  return services;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (isSanityConfigured) {
    const result = await fetchFromSanity<Service>(
      `*[_type == "service" && slug.current == $slug][0]`,
      { slug }
    );
    if (result) {
      return result;
    }
  }
  return services.find((s) => s.slug === slug) || null;
}
