import { copy } from "../src/content/copy";
import { products } from "../src/data/products";
import { siteConfig } from "../src/config/site";
import { demoVideos } from "../src/data/demo-videos";
import { getFanSizes } from "../src/lib/data/products";

async function checkClaims() {
  console.log("=== Running Claims & Number Consistency Check ===");

  // 1. Gather all numbers present in data files
  const allowedNumbers = new Set<string>();

  // Add numbers from siteConfig
  allowedNumbers.add(String(siteConfig.establishedYear)); // 2020
  allowedNumbers.add(siteConfig.gstNumber);

  // Add numbers from products
  for (const product of products) {
    if (product.priceApprox !== null) {
      allowedNumbers.add(String(product.priceApprox));
    }
    if (product.moq !== null) {
      allowedNumbers.add(String(product.moq));
    }
    if (product.sizeCm) {
      allowedNumbers.add(String(product.sizeCm));
    }
    // Extract numbers from name and specs
    const matches = `${product.name} ${product.specs.map((s) => s.value).join(" ")}`.match(/\b\d+\b/g);
    if (matches) {
      matches.forEach((m) => allowedNumbers.add(m));
    }
  }

  // Add numbers from demo videos
  allowedNumbers.add(String(demoVideos.length)); // 2

  // Allowed generic UI numbers (e.g. 404, steps 1-3)
  allowedNumbers.add("404");
  allowedNumbers.add("1");
  allowedNumbers.add("2");
  allowedNumbers.add("3");

  // 2. Scan copy.ts strings for numbers and check against allowed set
  function checkString(str: string, pathStr: string) {
    const numbersInStr = str.match(/\b\d+\b/g);
    if (numbersInStr) {
      for (const num of numbersInStr) {
        if (!allowedNumbers.has(num)) {
          console.error(`[CLAIMS ERROR] Number "${num}" in copy path "${pathStr}" is not in product/site data!`);
          process.exit(1);
        }
      }
    }
  }

  function traverseCopy(obj: any, pathStr = "copy") {
    for (const [key, val] of Object.entries(obj)) {
      const currentPath = `${pathStr}.${key}`;
      if (typeof val === "string") {
        checkString(val, currentPath);
      } else if (Array.isArray(val)) {
        val.forEach((item, idx) => {
          if (typeof item === "string") checkString(item, `${currentPath}[${idx}]`);
        });
      } else if (typeof val === "object" && val !== null) {
        traverseCopy(val, currentPath);
      }
    }
  }

  traverseCopy(copy);
  console.log("  [PASS] All numerical claims in copy.ts correspond to verified data.");

  // 3. Verify getFanSizes() is generated from data layer and properly sorted
  const fanSizes = await getFanSizes();
  if (fanSizes.length === 0) {
    console.error("[CLAIMS ERROR] getFanSizes() returned empty array!");
    process.exit(1);
  }

  for (let i = 0; i < fanSizes.length - 1; i++) {
    if (fanSizes[i].sizeCm > fanSizes[i + 1].sizeCm) {
      console.error(`[CLAIMS ERROR] Fan sizes not sorted in ascending order: ${fanSizes[i].sizeCm} > ${fanSizes[i + 1].sizeCm}`);
      process.exit(1);
    }
  }

  // Check no MOQ handling: 70cm fan has null MOQ
  const fan70 = fanSizes.find((f) => f.sizeCm === 70);
  if (!fan70 || fan70.moq !== null) {
    console.error("[CLAIMS ERROR] 70cm fan expected to have null MOQ per plan section 10.1");
    process.exit(1);
  }

  console.log(`  [PASS] Fan sizes strip verified: ${fanSizes.length} models sorted ascending from ${fanSizes[0].sizeCm}cm to ${fanSizes[fanSizes.length - 1].sizeCm}cm.`);
  console.log("=== Claims & Consistency Check Passed ===\n");
}

checkClaims();
