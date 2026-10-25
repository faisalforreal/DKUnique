# Design Notes & Reference Architecture (`docs/design-notes.md`)

This document outlines the visual design strategy, reference reverse-engineering findings, motion extraction analysis, and layout patterns adopted for the DK Unique Production B2B website.

---

## 1. Reference Extraction Analysis

### Reference 1: HYPERVSN Display (`https://hypervsn.com/display/`)
- **Observed Structure:** High-contrast presentation pairing a pitch-black theatrical demonstration stage with calm, factual hardware datasheets. Clean factual statements cluster key specifications: diameter, resolution, brightness (cd/m²), and multi-unit synchronization. Features a dedicated sequential explanation of persistence-of-vision mechanics.
- **What Was Extracted:**
  - The structural flow: Bold product declaration $\to$ High-speed rotation $\to$ LED flash timing $\to$ Persistence of vision $\to$ Scalability $\to$ Physical datasheets.
  - Absence of marketing hype in favor of concrete physical metrics (diameter, weight, power, LEDs).
- **What Could NOT Be Extracted:**
  - Proprietary driver protocols and copyrighted imagery (completely avoided; our implementation uses procedural Three.js geometry and DK Unique's catalog photos).

### Reference 2: Refire Interactive Products (`awwwards.com/inspiration/interactive-products-page-refire`)
- **Observed Structure:** Industrial 12-column asymmetric grid. Left side holds technical nomenclature, model numbering, and data points; right side holds an anchored 3D model responding to pointer tilt and scroll. Hairline borders (`1px`) replace rounded card containers.
- **What Was Extracted:**
  - High data-density layout using monospace labels and values separated by subtle border lines.
  - Hover row interactions revealing product thumbnails and actions without distracting popups.
- **What Could NOT Be Extracted:**
  - Proprietary GSAP animation pipelines (adapted using React Three Fiber's `useFrame` lerping and Motion's `useScroll`).

### Reference 3: CHILE20 3D Showcase (`awwwards.com/inspiration/showcase-realistic-3d-products-chile20`)
- **Observed Structure:** Sticky stage storytelling. As the visitor scrolls natively down the page, a single 3D object remains pinned in the viewport while narrative phases transition around it, scaling and rotating the geometry smoothly.
- **What Was Extracted:**
  - The sticky viewport pattern: A container of extended height (e.g. `250vh` on desktop, `180vh` on mobile) with a `sticky top-0 h-screen` stage.
  - Scroll progress ($0 \to 1$) governing rotation velocity, part visibility, and physical scaling.
- **What Could NOT Be Extracted:**
  - Custom CAD assets (DK Unique models will be dropped into `/public/assets/models/`).

### Reference 4: Mesh3D Gallery (`https://mesh3d.gallery/`)
- **Observed Structure:** Contrast-driven theatrical staging. The dark stage (`#0A0C10`) is reserved for luminous elements, while surrounding content lives on neutral paper backgrounds.
- **What Was Extracted:**
  - Drei `<Environment><Lightformer /></Environment>` procedural lighting eliminating external HDR downloads.
  - Strict performance-aware viewport management: only 1 R3F canvas per page, paused when scrolled offscreen.
- **Motion Brief Status:** External client video ingestion skipped until user provides reference video; all motion parameters, easing, ranges, and speeds are centralized in `src/config/motion.ts` for immediate configuration tuning.

---

## 2. Selected Layout Patterns

### Pattern 1: Industrial Split-Stage Hero
- **Purpose:** Immediate visual proof of holographic technology combined with business credentials.
- **Grid & Spacing:** 12-column grid, max width 1280 px. 7 columns dedicated to typography and lead CTA on desktop; 5 columns for the live 3D stage. On mobile (390 px), the stage sits neatly above the text.
- **Type Scale:**
  - Display Title: Archivo 700/800, fluid $40\text{px} \to 64\text{px}$, tracking $-0.03\text{em}$.
  - Body: Public Sans $16\text{px} \to 18\text{px}$, line-height 1.6.
  - Credentials Row: IBM Plex Mono $13\text{px}$, uppercase, separated by hairline dividers.
- **Colors:** Deep stage `#0A0C10` background with glowing cyan `#2BD9E6` additive persistence-of-vision hologram in the fan center.

### Pattern 2: Scroll-Driven Sticky Stage with Tabular Specification Matrix
- **Purpose:** Demystifies holographic technology ("How it works") and presents clear sizing options ("Sizes").
- **Grid & Spacing:** Sticky full-viewport stage pinned during native scroll.
  - *Phase A ("How it works"):* $0 \to 0.3$ decelerates the fan, exposing the rotor blades and LED emitters; $0.3 \to 0.7$ presents 3 sequential factual statements; $0.7 \to 1.0$ accelerates the spin until the persistence-of-vision hologram forms.
  - *Phase B ("Sizes"):* Smoothly scales the fan geometry from 14 cm to 100 cm, accompanied by an IBM Plex Mono data strip dynamically generated from `getFanSizes()` showing the nearest real model, MOQ, and approximate price.
- **Type Scale:** IBM Plex Mono $14\text{px}$ for live telemetry and data attributes; Public Sans $20\text{px} \to 28\text{px}$ for step descriptions.
- **Hairlines:** `1px` `#D8D4CA` dividers with zero drop-shadows or glow on DOM elements.

### Pattern 3: Stage-Panel Focus Viewer for Product Details
- **Purpose:** Rigorous product comparison with drop-in GLB 3D support and clear commercial terms.
- **Grid & Spacing:** 2-column split (sticky 50% left stage, scrolling 50% right specification panel).
- **Left Stage:** Dark stage container (`#0A0C10`) hosting the interactive 3D viewer (or high-res WebP gallery with neutral `#E4E0D7` fallback). Scroll natively rotates the model; touch/mouse drag orbits the camera.
- **Right Panel:** Product title in Archivo, approximate price and MOQ in IBM Plex Mono, "Get a quote" button, followed by an alternating hairline datasheet table detailing diameter, LEDs, brightness, voltage, and package contents. Includes neutral review disclaimer on flagged products: *"Specifications may vary. Contact us to confirm."*

---

## 3. Strict Compliance Guardrails
- **Zero Buzzwords:** No terms like "cutting-edge", "revolutionary", "premium", or "seamless".
- **Zero Developer Talk:** No "Next.js", "React", "WebGL", "placeholder", or "needsReview".
- **Zero Vibe-Coded Aesthetics:** No gradient text, no glassmorphism backdrop blurs, no pill badges, no rounded card clusters, and no looping particle vortexes.
