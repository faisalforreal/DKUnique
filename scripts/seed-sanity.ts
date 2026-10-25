import { createClient } from "@sanity/client";
import { categories } from "../src/data/categories";
import { products } from "../src/data/products";
import { services } from "../src/data/services";
import { demoVideos } from "../src/data/demo-videos";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

async function runSeed() {
  console.log("=== Sanity CMS Seed Script ===");

  if (!projectId || !token) {
    console.log(
      "[INFO] Sanity write credentials not configured (SANITY_API_WRITE_TOKEN or NEXT_PUBLIC_SANITY_PROJECT_ID missing)."
    );
    console.log(
      "To sync seed data with your live Sanity project, provide these environment variables and run this script."
    );
    process.exit(0);
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2024-01-01",
    useCdn: false,
  });

  console.log(`Targeting project: ${projectId}, dataset: ${dataset}`);

  // 1. Seed Categories
  console.log(`Seeding ${categories.length} categories...`);
  const catTransaction = client.transaction();
  for (const cat of categories) {
    catTransaction.createOrReplace({
      _id: `category-${cat.id}`,
      _type: "category",
      id: cat.id,
      name: cat.name,
      slug: { _type: "slug", current: cat.slug },
      description: cat.description,
      order: cat.sortOrder,
    });
  }
  await catTransaction.commit();
  console.log("✓ Categories seeded.");

  // 2. Seed Services
  console.log(`Seeding ${services.length} services...`);
  const srvTransaction = client.transaction();
  for (const srv of services) {
    srvTransaction.createOrReplace({
      _id: `service-${srv.id}`,
      _type: "service",
      id: srv.id,
      name: srv.name,
      slug: { _type: "slug", current: srv.slug },
      category: srv.category,
      description: srv.description,
      specs: srv.specs,
      priceApprox: srv.priceApprox,
      priceUnit: srv.priceUnit,
      flagged: srv.flagged,
      flagNotes: srv.flagNotes,
    });
  }
  await srvTransaction.commit();
  console.log("✓ Services seeded.");

  // 3. Seed Demo Videos
  console.log(`Seeding ${demoVideos.length} demo videos...`);
  const videoTransaction = client.transaction();
  for (const video of demoVideos) {
    videoTransaction.createOrReplace({
      _id: `demoVideo-${video.id}`,
      _type: "demoVideo",
      id: video.id,
      title: video.title,
      youtubeId: video.youtubeId,
      thumbnailUrl: video.thumbnailUrl,
    });
  }
  await videoTransaction.commit();
  console.log("✓ Demo videos seeded.");

  // 4. Seed Products in batches of 10
  console.log(`Seeding ${products.length} products...`);
  const batchSize = 10;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const prodTransaction = client.transaction();
    for (const prod of batch) {
      prodTransaction.createOrReplace({
        _id: `product-${prod.id}`,
        _type: "product",
        id: prod.id,
        name: prod.name,
        slug: { _type: "slug", current: prod.slug },
        categorySlug: prod.categorySlug,
        description: prod.description,
        specs: prod.specs,
        priceApprox: prod.priceApprox,
        priceUnit: prod.priceUnit,
        showPrice: prod.showPrice,
        moq: prod.moq,
        moqUnit: prod.moqUnit,
        flagged: prod.flagged,
        flagNotes: prod.flagNotes,
        images: prod.images,
      });
    }
    await prodTransaction.commit();
    console.log(`  Seeded products ${i + 1} to ${Math.min(i + batchSize, products.length)}`);
  }
  console.log("✓ Products seeded successfully.");
  console.log("=== Sanity CMS Seed Complete ===");
}

runSeed().catch((err) => {
  console.error("Failed to seed Sanity:", err);
  process.exit(1);
});
