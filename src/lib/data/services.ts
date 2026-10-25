import { services } from "@/data/services";
import type { Service } from "@/types";

export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return services.find((s) => s.slug === slug) || null;
}
