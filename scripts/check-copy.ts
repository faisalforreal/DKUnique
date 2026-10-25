import fs from "fs";
import path from "path";

/**
 * Build-time hygiene check: strictly forbids developer jargon, unverified marketing
 * claims, and unconfirmed specs from leaking into visitor-facing UI copy and strings.
 *
 * Banned in visitor-visible strings:
 * Next.js, React, Vercel, Sanity, Render, scalable, architecture, powered by,
 * built with, placeholder, coming soon, lorem, TODO, pending review, needsReview,
 * GLB, shader, WebGL, optimized.
 *
 * Banned buzzwords:
 * engineered, premium, cutting-edge, state-of-the-art, commercial-grade, seamless,
 * captivate, immersive, next-level, revolutionary, unleash, elevate, world-class,
 * verified, certified, waterproof, pan-india.
 */
const BANNED_TERMS = [
  "next.js",
  "react",
  "vercel",
  "sanity",
  "render",
  "scalable",
  "architecture",
  "powered by",
  "built with",
  "placeholder",
  "coming soon",
  "lorem",
  "todo",
  "pending review",
  "needsreview",
  "glb",
  "shader",
  "webgl",
  "optimized",
  // Banned buzzwords:
  "engineered",
  "premium",
  "cutting-edge",
  "state-of-the-art",
  "commercial-grade",
  "seamless",
  "captivate",
  "immersive",
  "next-level",
  "revolutionary",
  "unleash",
  "elevate",
  "world-class",
  "verified",
  "certified",
  "waterproof",
  "pan-india",
];

const TARGET_DIR = path.join(process.cwd(), "src");

const EXCLUDED_FILES = [
  path.normalize("src/types/product.ts"),
  path.normalize("src/types/service.ts"),
  path.normalize("src/types/demo-video.ts"),
  path.normalize("src/types/media.ts"),
  path.normalize("src/types/site-settings.ts"),
  path.normalize("src/types/model3d.ts"),
  path.normalize("src/data/products.ts"),
  path.normalize("src/data/services.ts"),
  path.normalize("src/data/demo-videos.ts"),
  path.normalize("src/data/assets.ts"),
  path.normalize("src/config/site.ts"),
  path.normalize("src/config/motion.ts"),
  path.normalize("src/components/three/CanvasManager.tsx"),
  path.normalize("src/components/three/HeroFanModel.tsx"),
  path.normalize("src/components/three/HeroFanView.tsx"),
  path.normalize("src/components/three/HowItWorksView.tsx"),
  path.normalize("src/components/three/SizesView.tsx"),
  path.normalize("src/components/three/ProductViewer.tsx"),
  path.normalize("src/sanity/client.ts"),
  path.normalize("src/sanity/config.ts"),
  path.normalize("src/sanity/env.ts"),
  path.normalize("src/sanity/schemaTypes/category.ts"),
  path.normalize("src/sanity/schemaTypes/product.ts"),
  path.normalize("src/sanity/schemaTypes/service.ts"),
  path.normalize("src/sanity/schemaTypes/demoVideo.ts"),
  path.normalize("src/sanity/schemaTypes/galleryItem.ts"),
  path.normalize("src/sanity/schemaTypes/siteSettings.ts"),
  path.normalize("src/sanity/schemaTypes/index.ts"),
  path.normalize("src/app/studio/[[...tool]]/StudioClient.tsx"),
  path.normalize("src/app/studio/[[...tool]]/page.tsx"),
];

function scanDirectory(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (/\.(tsx|jsx|html|ts)$/.test(entry.name)) {
      const normalized = path.normalize(path.relative(process.cwd(), fullPath));
      if (!EXCLUDED_FILES.includes(normalized)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

/**
 * Strips code-level constructs (imports, React types, CSS className utility prefixes)
 * so we inspect actual visitor-visible copy, text nodes, and user-facing attributes.
 */
function cleanCodeForInspection(code: string): string {
  let text = code;
  // 1. Remove comments
  text = text.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");

  // 2. Remove import/export statements
  text = text.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, "");
  text = text.replace(/export\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, "");

  // 3. Remove React namespace type and framework identifiers in code
  text = text.replace(/React\.[a-zA-Z0-9_]+/g, "");
  text = text.replace(/extends\s+React\.[a-zA-Z0-9_]+/g, "");
  text = text.replace(/displayName\s*=\s*['"][^'"]+['"]/g, "");

  // 4. Remove Tailwind CSS utility prefixes like placeholder:text-muted or focus:
  text = text.replace(/placeholder:[a-zA-Z0-9_-]+/g, "");
  // 5. Remove HTML/JSX attribute name `placeholder=` (the attribute value remains for checking)
  text = text.replace(/\bplaceholder\s*=/g, "");

  return text;
}

function checkFiles() {
  console.log("=== Running Visitor Copy Hygiene & Factual Claims Check ===");
  const files = scanDirectory(TARGET_DIR);
  let violationCount = 0;

  for (const file of files) {
    const rawContent = fs.readFileSync(file, "utf-8");
    const relative = path.relative(process.cwd(), file);
    const content = cleanCodeForInspection(rawContent);

    for (const term of BANNED_TERMS) {
      const regex = new RegExp(`(?<![a-zA-Z0-9_-])${term.replace(".", "\\.")}(?![a-zA-Z0-9_-])`, "i");
      if (regex.test(content)) {
        console.error(`[VIOLATION] Found forbidden visitor term "${term}" in: ${relative}`);
        violationCount++;
      }
    }
  }

  if (violationCount > 0) {
    console.error(`\nFailed: Found ${violationCount} user-facing copy violations.`);
    process.exit(1);
  }

  console.log(`[PASS] Clean visitor copy verified across ${files.length} source files.\n`);
}

checkFiles();
