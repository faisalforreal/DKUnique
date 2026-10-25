import fs from "fs";
import path from "path";
import https from "https";
import sharp from "sharp";

interface ImageSourceMapping {
  slug: string;
  path: string;
  isLogo?: boolean;
}

const BASE_URL = "https://5.imimg.com/data5/SELLER/Default/";
const LOGO_BASE_URL = "https://5.imimg.com/data5/SELLER/Logo/";

const IMAGE_SOURCES: ImageSourceMapping[] = [
  { slug: "fan-65cm-wall", path: "2024/12/476052061/MR/OS/CG/47962329/65cm-3d-holographic-fan-wall-500x500.jpg" },
  { slug: "fan-42cm", path: "2026/10/651229082/HP/YM/UD/47962329/42-cm-3d-holographic-fan-125x125.webp" },
  { slug: "fan-14cm-2-blade", path: "2024/1/378953920/FE/EE/LB/47962329/14cm-hologram-led-125x125.jpeg" },
  { slug: "fan-52cm", path: "2024/1/378940991/MH/QU/TE/47962329/42cm-4-blade-3d-holographic-fan-125x125.jpeg" },
  { slug: "fan-100cm", path: "2024/1/377834510/RT/XC/HS/47962329/100cm-4-blade-hologram-fan-125x125.jpg" },
  { slug: "display-fan-35cm", path: "2024/1/378953462/RY/CW/ZA/47962329/360-degree-hologram-125x125.jpeg" },
  { slug: "display-86-rectangular", path: "2026/10/651222793/QV/CP/IO/47962329/86-inch-rectangular-3d-holographic-display-125x125.jpg" },
  { slug: "display-86-cylindrical", path: "2026/10/651223105/BA/QG/UN/47962329/86-inch-cylindrical-3d-holographic-display-125x125.png" },
  { slug: "hologram-display-box", path: "2026/10/655002382/KD/SP/WQ/47962329/3d-holobox-500x500.jpeg" },
  { slug: "projector-digicast-dcx", path: "2024/1/377987061/UK/PU/PW/47962329/digicast-dcx-android-9-hd-projector-125x125.jpeg" },
  { slug: "projector-digicast-portable", path: "2024/1/378954025/WZ/MP/FT/47962329/x-pro-projector-125x125.jpeg" },
  { slug: "projector-dcr100", path: "2024/1/377987344/QT/AK/OM/47962329/digicast-dcr100-projector-125x125.jpeg" },
  { slug: "projector-dc82t", path: "2024/1/378953774/SO/EY/QW/47962329/dc-852-projector-125x125.jpeg" },
  { slug: "projector-dc886", path: "2024/1/378951742/KV/MU/CN/47962329/dc-886-projector-125x125.jpeg" },
  { slug: "logo-projector-15w", path: "2025/6/517616565/CR/FA/WD/47962329/led-logo-light-projector-125x125.jpg" },
  { slug: "logo-projector-20w", path: "2026/10/651219426/YQ/OT/CR/47962329/logo-light-projector-125x125.jpg" },
  { slug: "logo-projector-50w", path: "2026/10/651220022/ZF/VM/SY/47962329/led-logo-light-projector-125x125.png" },
  { slug: "logo-projector-60w", path: "2026/10/651282824/LW/FI/NH/47962329/60w-led-logo-projector-125x125.png" },
  { slug: "rental-hologram-fan", path: "2024/9/451477593/NC/EH/XZ/47962329/3d-hologram-fan-rental-125x125.jpeg" },
  { slug: "projector-epson", path: "2025/6/517626169/IV/HQ/XZ/47962329/epson-digital-projector-125x125.jpg" },
  { slug: "projector-used", path: "2025/3/498741785/MA/SY/DW/47962329/second-hand-and-used-projector-125x125.jpeg" },
  { slug: "xyloband", path: "2025/6/517629901/HJ/VI/QT/47962329/silicon-led-xyloband-125x125.jpg" },
  { slug: "humanoid-robot-1400", path: "2026/10/651283582/GG/UA/XU/47962329/1400mm-humanoid-robot-125x125.png" },
  { slug: "led-display-32", path: "2026/10/651021582/IW/KJ/GT/47962329/product-jpeg-125x125.jpg" },
  { slug: "digital-standee-55", path: "2026/10/650983615/VG/XZ/CX/47962329/semi-outdoor-led-digital-standee-10x8-ft-hd-125x125.jpg" },
  { slug: "logo-reference", path: "2024/1/377947017/GW/XF/AF/47962329/yrf-120x120.jpeg", isLogo: true },
];

function downloadBuffer(url: string): Promise<Buffer | null> {
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          resolve(null);
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", () => resolve(null));
  });
}

async function processImage(item: ImageSourceMapping) {
  const base = item.isLogo ? LOGO_BASE_URL : BASE_URL;
  const originalUrl = `${base}${item.path}`;
  const higherResPath = item.path.replace(/-(?:125x125|120x120)\./, "-500x500.");
  const highResUrl = `${base}${higherResPath}`;

  const destDir = item.isLogo
    ? path.join(process.cwd(), "public", "assets", "brand")
    : path.join(process.cwd(), "public", "assets", "products", item.slug);

  fs.mkdirSync(destDir, { recursive: true });
  const finalWebpPath = item.isLogo
    ? path.join(destDir, "logo-reference.webp")
    : path.join(destDir, "main.webp");

  if (fs.existsSync(finalWebpPath)) {
    console.log(`[Import] Skipping existing asset: ${item.slug}`);
    return;
  }

  console.log(`[Import] Processing: ${item.slug}`);

  let buffer = await downloadBuffer(highResUrl);
  if (!buffer) {
    buffer = await downloadBuffer(originalUrl);
  }

  if (!buffer) {
    console.warn(`  [!] Could not download asset for ${item.slug}`);
    return;
  }

  try {
    await sharp(buffer).webp({ quality: 85 }).toFile(finalWebpPath);
    console.log(`  [OK] Saved WebP to: ${path.relative(process.cwd(), finalWebpPath)}`);
  } catch (err) {
    console.error(`  [X] Sharp WebP conversion failed for ${item.slug}:`, err);
  }
}

async function run() {
  console.log("=== Importing Product Assets from IndiaMART Catalog ===");
  for (const item of IMAGE_SOURCES) {
    await processImage(item);
  }
  console.log("=== Asset Import Complete ===");
}

run();
