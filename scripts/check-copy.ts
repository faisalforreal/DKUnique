import fs from "fs";
import path from "path";

/**
 * Build-time hygiene check: strictly forbids developer jargon, unverified marketing
 * claims, and unconfirmed specs from leaking into visitor-facing UI copy and strings.
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
 * Strips code imports and type annotations so we inspect only strings, JSX text, and template literals.
 */
function extractVisitorVisibleContent(code: string): string {
  // Remove single line comments and multi-line comments
  let text = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
  // Remove import/export statements
  text = text.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, "");
  text = text.replace(/export\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, "");
  // Remove typescript type annotations like : React.ReactNode or : ReactNode
  text = text.replace(/:\s*React\.[a-zA-Z0-9_]+/g, "");
  text = text.replace(/:\s*ReactNode/g, "");
  text = text.replace(/React\.ReactNode/g, "");
  return text;
}

function checkFiles() {
  console.log("=== Running Visitor Copy Hygiene & Factual Claims Check ===");
  const files = scanDirectory(TARGET_DIR);
  let violationCount = 0;

  for (const file of files) {
    const rawContent = fs.readFileSync(file, "utf-8");
    const relative = path.relative(process.cwd(), file);
    const content = extractVisitorVisibleContent(rawContent);

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
