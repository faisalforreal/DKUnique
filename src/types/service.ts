import type { MediaAsset } from "./media";

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: "rental";
  description: string;
  specs: { label: string; value: string }[];
  priceApprox: number | null;
  priceUnit: string; // "Piece", "Day", "Event"
  flagged: boolean;
  flagNotes: string[];
  image: MediaAsset;
}
