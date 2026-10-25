import { demoVideos } from "@/data/demo-videos";
import type { DemoVideo } from "@/types";

export async function getDemoVideos(): Promise<DemoVideo[]> {
  return demoVideos;
}
