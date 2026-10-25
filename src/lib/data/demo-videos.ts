import { demoVideos } from "@/data/demo-videos";
import type { DemoVideo } from "@/types";
import { isSanityConfigured, fetchFromSanity } from "@/sanity/client";

export async function getDemoVideos(): Promise<DemoVideo[]> {
  if (isSanityConfigured) {
    const result = await fetchFromSanity<DemoVideo[]>(`*[_type == "demoVideo"]`);
    if (result && result.length > 0) {
      return result;
    }
  }
  return demoVideos;
}
