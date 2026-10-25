import type { MediaAsset } from "./media";
import type { Model3D } from "./model3d";

export interface ProductSpec {
  label: string;
  value: string;
  flagged?: boolean;
  flagNote?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  specs: ProductSpec[];
  priceApprox: number | null; // INR approximate price, null = unlisted
  priceUnit: string; // "Piece", "Set", "Unit"
  showPrice: boolean; // Per-product price display toggle
  moq: number | null; // Minimum Order Quantity, null = not specified
  moqUnit: string; // "Piece", "Unit", "Set"
  images: MediaAsset[];
  model3d?: Model3D;
  videoId?: string; // YouTube demo video ID
  condition?: "new" | "used";
  flagged: boolean; // True if specs or prices conflict or need verification
  flagNotes: string[]; // Internal verification notes (visible only when reviewMode is true)
  visible: boolean; // Catalog visibility toggle
  featured: boolean; // Homepage popular fans showcase toggle
  sizeCm?: number; // Numeric diameter in cm for fan size scaling/sorting
  relatedSlugs: string[]; // Cross-sell product slugs
}
