import fs from "fs";
import path from "path";
import { products } from "../src/data/products";

const HERO_BUDGET_MB = 3.0;
const PRODUCT_BUDGET_MB = 5.0;

function checkModels() {
  console.log("=== Auditing 3D GLB Assets & Model Budget ===");
  const modelsDir = path.join(process.cwd(), "public", "assets", "models");

  let hasErrors = false;

  // 1. Audit products requesting 3D models
  console.log("\n1. Product Model Registrations:");
  for (const product of products) {
    if (product.model3d?.glb) {
      const glbPath = path.join(process.cwd(), "public", product.model3d.glb.replace(/^\//, ""));
      if (fs.existsSync(glbPath)) {
        const stat = fs.statSync(glbPath);
        const mb = stat.size / (1024 * 1024);
        const isOver = mb > PRODUCT_BUDGET_MB;
        console.log(
          `  [${isOver ? "OVER BUDGET" : "OK"}] ${product.name}: ${mb.toFixed(2)} MB (Max: ${PRODUCT_BUDGET_MB} MB)`
        );
        if (isOver) hasErrors = true;
      } else {
        console.log(`  [PENDING GLB] ${product.name}: Expected at ${product.model3d.glb}`);
      }
    }
  }

  // 2. Audit hero GLB
  const heroPath = path.join(modelsDir, "hero-fan.glb");
  console.log("\n2. Hero 3D Scene Model:");
  if (fs.existsSync(heroPath)) {
    const stat = fs.statSync(heroPath);
    const mb = stat.size / (1024 * 1024);
    const isOver = mb > HERO_BUDGET_MB;
    console.log(`  [${isOver ? "OVER BUDGET" : "OK"}] hero-fan.glb: ${mb.toFixed(2)} MB (Max: ${HERO_BUDGET_MB} MB)`);
    if (isOver) hasErrors = true;
  } else {
    console.log("  [INFO] hero-fan.glb not found: Real-time procedural hologram fan will be rendered.");
  }

  console.log("\n=== 3D Model Audit Finished ===\n");
  if (hasErrors) {
    process.exit(1);
  }
}

checkModels();
