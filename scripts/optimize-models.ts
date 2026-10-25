import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const MODELS_DIR = path.join(process.cwd(), "public", "assets", "models");

function optimizeModels() {
  console.log("=== Optimizing GLB Assets via gltf-transform ===");
  if (!fs.existsSync(MODELS_DIR)) {
    console.log("No models directory found. Skipping.");
    return;
  }

  const files = fs.readdirSync(MODELS_DIR).filter((f) => f.endsWith(".glb") && !f.endsWith(".optimized.glb"));
  if (files.length === 0) {
    console.log("No source .glb files found to optimize.");
    return;
  }

  for (const file of files) {
    const inputPath = path.join(MODELS_DIR, file);
    const outputPath = path.join(MODELS_DIR, file.replace(/\.glb$/, ".optimized.glb"));
    console.log(`Optimizing: ${file}...`);
    try {
      execSync(`npx @gltf-transform/cli optimize "${inputPath}" "${outputPath}" --draco --texture-compress webp`, {
        stdio: "inherit",
      });
      console.log(`[DONE] Optimized ${file}`);
    } catch (err) {
      console.error(`Failed to optimize ${file}:`, err);
    }
  }
}

optimizeModels();
