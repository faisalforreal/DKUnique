# System Architecture: DK Unique Production Website

## 1. Overview
The DK Unique Production website is a high-performance, single-pass Next.js (App Router) B2B catalog and lead generation platform designed for Indian commercial equipment buyers (retailers, malls, event agencies, exhibition teams).

The technical architecture strictly follows a datasheet-style aesthetic:
- Neutral `#F3F1EC` paper background
- `#111111` ink typography with Archivo display, Public Sans body, and IBM Plex Mono data tables
- `#0A0C10` dark stage reserved strictly for the 3D hero stage, 3D product viewer panels, and the footer
- `#2BD9E6` signal color for focus outlines, links on dark, and hologram elements
- Zero neon glows, zero glassmorphism, zero pill badges, and zero developer jargon in visitor-facing copy

## 2. Directory Structure & Responsibilities
```
DkUnique/
├── public/
│   ├── assets/
│   │   ├── brand/          # Logo and wordmark assets
│   │   ├── products/       # Product images (/products/<slug>/main.webp)
│   │   └── models/         # 3D GLB models (/models/<slug>.glb)
│   └── draco/              # Draco 3D decompression binaries
├── scripts/
│   ├── check-copy.ts       # Automated scanner for banned buzzwords & developer jargon
│   ├── check-claims.ts     # Numerical claim validator comparing copy to data files
│   ├── check-models.ts     # 3D asset budget auditor (3MB hero, 5MB products)
│   ├── optimize-models.ts  # gltf-transform optimization pipeline
│   └── import-images.ts    # Sharp-based image converter from IndiaMART sources
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, API routes)
│   ├── components/
│   │   ├── layout/         # Header, Footer, Wordmark, MobileBottomBar
│   │   ├── ui/             # Buttons, Dialogs, Inputs, Tables, Directions
│   │   ├── three/          # R3F Canvas View, HeroFan, ProductViewer
│   │   ├── forms/          # Lead forms (Quote, Callback, Rental, Demo, Contact)
│   │   └── products/       # ProductTable, Filter, SpecTable, SizesStrip
│   ├── config/
│   │   ├── site.ts         # Business facts, contact info, flags
│   │   └── motion.ts       # Central motion ranges, speeds, and curves
│   ├── content/
│   │   └── copy.ts         # Single source of truth for visitor-facing text
│   ├── data/               # Seed data (products, categories, services, videos)
│   ├── lib/
│   │   └── data/           # Abstraction layer between UI and seed/CMS data
│   ├── server/             # Server-only lead delivery (Resend, SMTP, rate limit)
│   ├── styles/             # Tailwind v4 tokens (@theme) and global CSS
│   └── types/              # Unified TypeScript definitions
├── ARCHITECTURE.md
├── DECISIONS.md
└── PLACEHOLDERS.md
```

## 3. Data Flow
1. **Seed Data:** Raw product facts, specs, prices, and MOQs live in `src/data/products.ts`, `categories.ts`, `services.ts`, and `demo-videos.ts`.
2. **Data Access Layer:** UI components never import `src/data/` or CMS clients directly. They exclusively call async methods in `src/lib/data/` (`getProducts()`, `getProductBySlug()`, `getCategories()`, `getFanSizes()`, etc.).
3. **Motion Configuration:** All scroll ranges, spin speeds, easing curves, and scale factors are defined in `src/config/motion.ts`.
4. **Copy Separation:** UI components never hardcode visitor-facing text; all text comes from `src/content/copy.ts`.

## 4. How-To Guides

### How to Add a Product
1. Open `src/data/products.ts`.
2. Append a new product object satisfying the `Product` interface:
   ```ts
   {
     id: "fan-new-size",
     slug: "new-size-3d-holographic-fan",
     name: "New Size 3D Holographic Fan",
     categorySlug: "3d-holographic-fans",
     description: "Standard description...",
     specs: [
       { label: "Diameter", value: "xx cm" },
       { label: "LED Array", value: "xxx LEDs" }
     ],
     priceApprox: 20000,
     priceUnit: "Piece",
     showPrice: true,
     moq: 5,
     moqUnit: "Piece",
     images: [{ src: "/assets/products/new-size/main.webp", alt: "New Size Fan", width: 500, height: 500 }],
     flagged: false,
     flagNotes: [],
     visible: true,
     featured: false,
     sizeCm: xx,
     relatedSlugs: []
   }
   ```
3. Add the product image to `public/assets/products/new-size/main.webp`.

### How to Add a Category
1. Open `src/data/categories.ts`.
2. Add the category object with its slug, name, description, and representative image.
3. Ensure the category description matches `src/content/copy.ts`.

### How to Add an Image
1. Create a directory `public/assets/products/<slug>/`.
2. Save the image as `main.webp` (or `main.jpg`, `main.png`). The asset resolver in `src/data/assets.ts` automatically detects it.
3. If no image is present, the `<ProductPhoto>` component renders a neutral `#E4E0D7` fallback with the product name in monospace.

### How to Add a 3D Model (GLB)
1. Optimize the model:
   ```bash
   npx @gltf-transform/cli optimize input.glb public/assets/models/<slug>.glb --draco --texture-compress webp
   ```
2. Verify size budget:
   - Hero model: $\le 3\text{ MB}$
   - Product model: $\le 5\text{ MB}$
   - Run: `npm run models:check`
3. Set the `model3d` property on the product in `src/data/products.ts`:
   ```ts
   model3d: {
     glb: "/assets/models/<slug>.glb",
     scale: 1,
   }
   ```
4. `<ProductViewer>` will automatically mount the 3D model with scroll rotation and drag controls; when no model is present, it cleanly displays the high-resolution photo gallery.
