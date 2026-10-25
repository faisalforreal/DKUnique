import fs from "fs";
import path from "path";

/**
 * Resolves product image paths following the convention:
 * /public/assets/products/<slug>/main.<webp|jpg|jpeg|png>
 * If not found on disk, returns null so the neutral fallback block renders.
 */
export function getProductImagePath(slug: string): string | null {
  const extensions = ["webp", "jpg", "jpeg", "png"];
  for (const ext of extensions) {
    const relativePath = `/assets/products/${slug}/main.${ext}`;
    const fullPath = path.join(process.cwd(), "public", "assets", "products", slug, `main.${ext}`);
    if (fs.existsSync(fullPath)) {
      return relativePath;
    }
  }
  return null;
}
