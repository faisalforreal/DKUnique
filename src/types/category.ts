import type { MediaAsset } from "./media";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: MediaAsset;
  featured: boolean;
  sortOrder: number;
}
