import { projectId, dataset, apiVersion } from "./env";

export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "dkunique-cms"
);

export async function fetchFromSanity<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    const { createClient } = await import("@sanity/client");
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: process.env.NODE_ENV === "production",
    });
    return await client.fetch<T>(query, params || {});
  } catch {
    return null;
  }
}
