import { demoVideos } from "@/data/demo-videos";
import type { DemoVideo } from "@/types";
import { isSanityConfigured, sanityClient } from "@/sanity/client";

export async function getDemoVideos(): Promise<DemoVideo[]> {
  if (isSanityConfigured) {
    try {
      const result = await sanityClient.fetch<DemoVideo[]>(`*[_type == "demoVideo"]`);
      if (result && result.length > 0) {
        return result;
      }
    } catch {
      // Fallback
    }
  }
  return demoVideos;
}
