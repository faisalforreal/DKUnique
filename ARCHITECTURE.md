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


## 5. CMS Architecture & Content Synchronization

The website is engineered with a **zero-downtime hybrid data architecture**:
1. **Local Seed Default:** The site builds and runs out-of-the-box using the local datasets in `src/data/`.
2. **Sanity Overlay:** If `NEXT_PUBLIC_SANITY_PROJECT_ID` is defined, `src/lib/data/*` seamlessly routes queries to Sanity. If queries fail or return empty datasets, it gracefully falls back to local data.
3. **Studio Route:** Sanity Studio is mounted at `/studio` (`/studio/[[...tool]]`) as a dynamic client route with `noindex` headers.
4. **Content Seeding:**
   To synchronize local products, services, categories, and videos to a live Sanity project, set:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=your_sanity_write_token
   ```
   Then execute:
   ```bash
   npm run seed:sanity
   ```

## 6. Lead Pipeline Architecture

Visitor enquiries are processed via `src/app/api/lead/route.ts`:
- **Validation:** Strict server-side Zod validation (`src/server/lead-schema.ts`) supporting 5 lead types (`quote`, `callback`, `rental`, `demo`, `contact`).
- **Anti-Spam:** Honeypot field inspection rejects automated bot submissions without user impact.
- **Rate Limiting:** Sliding-window in-memory rate limiter (`src/server/rate-limit.ts`) limits requests to 5 per minute per IP.
- **Dispatch:**
  1. Primary: Resend API (`RESEND_API_KEY`).
  2. Secondary: SMTP transport via Nodemailer (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).
  3. Development: Safe console output fallback when email keys are not provided.
- **Buyer Direct Hand-off:** Every successful submission returns a pre-populated WhatsApp intent URL allowing buyers to initiate direct conversation on `+91 79485 48724` with one tap.

## 7. Build, Verification & Deployment Commands

### Verification Suite
Execute the full quality verification gate with:
```bash
npm run verify
```
This runs in sequence:
- `npm run typecheck` (`tsc --noEmit`)
- `npm run lint` (`eslint src`)
- `npm run copy:check` (validates no banned words or developer jargon in visitor strings)
- `npm run claims:check` (ensures all numerical claims align with verified data)
- `npm run build` (`next build` with static prerendering)

### Production Deployment
- **Platform:** Vercel, Node server, or containerized hosting.
- **Build Command:** `npm run build`
- **Output:** Next.js standalone App Router build.
- **Environment Flags:**
  - `NEXT_PUBLIC_SITE_URL`: Domain URL (e.g. `https://dkunique.com`)
  - `NEXT_PUBLIC_ALLOW_INDEXING`: Set to `true` on production domain to enable search engine indexing; defaults to `false` for prototype previews.
  - `NEXT_PUBLIC_PHONE`: Contact phone number.
  - `NEXT_PUBLIC_WHATSAPP`: Contact WhatsApp number.
  - `RESEND_API_KEY`: API key for email delivery.

## 8. 3D Stage & Motion Pipeline

- **Single Canvas (`<CanvasManager>`):** Renders one fixed full-viewport Three.js WebGL canvas (`position: fixed, inset: 0, zIndex: 15, pointerEvents: none`). Drei `<View>` portals track the individual DOM stages (`HeroSection`, `HowItWorksSection`, `SizesSection`), ensuring a single WebGL context and zero canvas remounting.
- **Hero Fan Model (`public/assets/models/hero-fan.glb`):**
  - High-performance, lightweight GLB asset (347 KB).
  - Node hierarchy: `Rotor_Hub` (with child blades `Blade_01..04`, LED dot strips `LED_Dots_01..04`, and hub cap) and stationary `Motor_Base` (motor housing, neck, wall mounting plate, and screws).
  - Rotated exclusively about the Z axis via code in `useFrame` (no baked keyframe animations).
  - LED material: `MeshStandardMaterial` named `"LED"`, emissive throttled dynamically via scroll progress.
  - Procedural fallback: When `hero-fan.glb` is missing, renders an identical node hierarchy procedurally with 4 blades and 96 discrete LED dots.
- **Three-Quarter Camera Angle (`<ViewCameraSetup>`):**
  - Configured in `src/config/motion.ts` (`position: [1.02, 0.62, 1.76]`, `target: [0, 0, -0.04]`, `fov: 42`).
  - Sets perspective 30° off normal and 18° above horizontal, clearly displaying the motor housing and wall plate behind the spinning blades.
- **Hologram Video Plane (`<HologramVideoPlane>`):**
  - Sized to 80% of blade diameter (0.52m), facing +Z.
  - Additive blending (`THREE.AdditiveBlending`) rendering black video backgrounds transparent.
  - Configured in `src/config/motion.ts` (`mode: "in-plane"` or `"above"`, `riseDistance: 0.06m`, `fadeStartProgress: 0.7`).
  - Video plays only while the section is in view; falls back seamlessly to procedural POV wireframe when `/assets/demo/holo-loop.mp4` is absent.

