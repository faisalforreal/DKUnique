# Decisions Log: DK Unique Production Rebuild (DECISIONS.md)

This log records architectural and technical decisions, package verification outputs, and justifications for the DK Unique Production B2B website rebuild.

---

## Tooling & Dependency Verification (Step 1 Baseline)

### `npm ls --depth=0` Output
```
dk-unique-production@0.1.0 C:\Users\mdfai\Documents\SideProjects\DkUnique
+-- @gltf-transform/cli@4.5.1
+-- @google/model-viewer@4.4.0
+-- @hookform/resolvers@5.9.2
+-- @radix-ui/react-dialog@1.3.1
+-- @react-three/drei@10.7.9
+-- @react-three/fiber@9.8.2
+-- @tailwindcss/postcss@4.1.5
+-- @types/node@22.15.3
+-- @types/nodemailer@6.4.17
+-- @types/react-dom@19.1.3
+-- @types/react@19.1.2
+-- @types/three@0.183.1
+-- eslint-config-next@15.5.28
+-- eslint@9.25.1
+-- lucide-react@1.61.0
+-- motion@14.6.0
+-- next@15.5.28
+-- nodemailer@6.10.0
+-- postcss@8.5.3
+-- react-dom@19.3.1
+-- react-hook-form@7.91.0
+-- react@19.3.1
+-- resend@6.34.1
+-- server-only@0.0.1
+-- sharp@0.35.5
+-- tailwindcss@4.1.5
+-- three@0.183.2
+-- tsx@4.23.15
+-- typescript@5.8.3
`-- zod@3.25.76
```

### `npm audit` Summary
- **Reported Advisories:** 6 vulnerabilities reported (2 low, 1 moderate, 3 high).
- **Analysis:**
  - `postcss`: Transitive inside Next.js build tools (fixed in Next 16+ which is a major breaking change for R3F 9 peerDependencies).
  - `zod`: Denial of Service on extreme constrained regex parsing; application schema only validates standard short strings (name, phone, company, message).
  - `nodemailer`: SMTP edge case parsing; our primary provider is Resend, with SMTP as secondary.
  - Per Rule 6: do not run `npm audit fix --force` or `--legacy-peer-deps` as it forces breaking major version upgrades.

---

## Architectural Decisions

### [2026-10-25] Decision 1: Next.js 15.5.28 LTS App Router
- **Context:** Need maximum stability with React 19, R3F v9, and SSR boundaries.
- **Decision:** Pinned Next.js 15.5.28.
- **Why:** Full compatibility with `@react-three/fiber` v9 and `@google/model-viewer` without experimental Turbopack regressions.

### [2026-10-25] Decision 2: Exact Three.js Version Pin (0.183.2)
- **Context:** Peer dependency alignment between `@react-three/fiber@9.8.2`, `@react-three/drei@10.7.9`, and `@google/model-viewer@4.4.0`.
- **Decision:** Pinned `three: 0.183.2` and `@types/three: 0.183.1`.
- **Why:** Satisfies all peer ranges cleanly with zero peer dependency conflicts.

### [2026-10-25] Decision 3: Single Canvas Architecture via Drei `View`
- **Context:** Multiple R3F canvases on a page degrade performance and risk WebGL context loss on mobile Android devices.
- **Decision:** Use a single fixed R3F Canvas positioned in the background, with Drei `<View>` components tracking DOM elements in the Hero, How It Works, and Sizes sections.
- **Why:** Single WebGL context, unified memory management, zero canvas remounting or shifting.

### [2026-10-25] Decision 4: Centralized Motion Configuration (`src/config/motion.ts`)
- **Context:** Motion ranges, spin speeds, easing curves, and scale factors must be tunable without modifying component logic.
- **Decision:** Extracted all animation thresholds and speeds into `src/config/motion.ts`.
- **Why:** Allows future motion brief fine-tuning by editing configuration values alone.

### [2026-10-25] Decision 5: Verified Copy and Claims Enforcement Scripts
- **Context:** Strict non-negotiable rules against developer talk, buzzwords, and invented claims.
- **Decision:** Implemented `scripts/check-copy.ts` (scanning for 30+ banned words) and `scripts/check-claims.ts` (matching copy numbers to data files).
- **Why:** Guarantees automated enforcement during `npm run verify` and pre-commit checks.

### [2026-10-25] Decision 6: Added Factual Copy for Motion Sequences
- **Context:** User amendment required specific step text for the How It Works sequence and Sizes sequence.
- **Decision:** Added plain factual sentences to `src/content/copy.ts`:
  - "A fan with LED blades spins very fast."
  - "The LEDs flash in time with the spin."
  - "Your eye sees a picture floating in the air."
  - "Sizes" / "Scroll to compare fan sizes from 14 cm to 100 cm."
  - "MOQ: ask us" (for models without listed MOQ).
- **Why:** 100% compliant with approved plan Section 9 and user amendments.


### [2026-10-25] Decision 7: Multi-Channel Lead Pipeline Architecture
- **Context:** B2B buyers have varying connectivity; enquiries must never get dropped.
- **Decision:** Built `/api/lead` with server-side Zod validation, honeypot anti-spam, 5 req/min in-memory rate limiting, Resend primary dispatch, Nodemailer SMTP secondary dispatch, and development console fallback. Followed immediately by an auto-populated WhatsApp message link for direct follow-up.
- **Why:** Maximum reliability for buyer lead generation across Indian B2B channels.

### [2026-10-25] Decision 8: Equipment Gallery & Pure Lightbox
- **Context:** Catalog contains 52+ real product photographs from warehouse and installations.
- **Decision:** Created `/gallery` with category filter tabs and an accessible, full-screen lightbox modal displaying high-res photos and direct links to product spec sheets.
- **Why:** Visual proof for buyers without bloating bundle size with heavy carousel/gallery libraries.

### [2026-10-25] Decision 9: Comprehensive Search & Technical SEO Architecture
- **Context:** Dynamic catalog pages and demos must be discoverable, while internal API and Studio paths must remain unindexed.
- **Decision:** Implemented dynamic `robots.ts` (controlled by `NEXT_PUBLIC_ALLOW_INDEXING`), `sitemap.ts` (mapping static routes, all 6 categories, and all 52 products), and Schema.org JSON-LD structured data (`Organization`, `Product`, `VideoObject`).
- **Why:** Complete enterprise SEO compliance without third-party SEO plugins.

### [2026-10-25] Decision 10: Sanity CMS v3 Baseline with Studio Route Decoupling
- **Context:** Next.js 15.5.28 with React 19.3.1 requires exact version alignment for Sanity CMS without resorting to `--legacy-peer-deps` or `--force`.
- **Decision:**
  - Pinned `next-sanity@9.8.59`, `sanity@3.76.1`, and `styled-components@6.1.15`.
  - Verified peer dependencies: `next: '^14.2 || ^15.0.0-0'`, `react: '^18.3 || ^19.0.0-0'`.
  - Decoupled `@sanity/client` from Sanity Studio internals using `src/sanity/env.ts` and pure client fetch in `src/sanity/client.ts`.
  - Wrapped `NextStudio` in client component (`StudioClient.tsx`) mounted at `/studio/[[...tool]]`.
  - Added graceful fallback to local seed data in `src/lib/data/*` so the site runs completely standalone if Sanity project keys are unset.
  - Authored `scripts/seed-sanity.ts` for one-command content synchronization.
- **Why:** Full compatibility, zero build-time leaks into server routes (e.g. `sitemap.xml`), and zero runtime dependency on external CMS uptime.

### [2026-10-25] Decision 11: Hero Scene Model Override, Three-Quarter Camera & Hologram Video Plane
- **Context:** User provided real 3D model `hero-fan.glb` (347 KB) to replace the procedural fan in the hero and scroll stages, requested a realistic three-quarter camera perspective showing the motor housing and wall plate, and a floating hologram video plane with procedural fallback.
- **Decision:**
  - Placed model at `public/assets/models/hero-fan.glb`. Verified node hierarchy (`Rotor_Hub` containing `Blade_01..04`, `Motor_Base` containing `Motor_Housing` and `Wall_Plate`, material `"LED"`).
  - Implemented singleton fetch/parse cache with per-view deep cloning (`.clone(true)`) and material cloning, preventing Three.js scene-stealing across views.
  - Scripted `Rotor_Hub` rotation purely via code in `useFrame`, throttling material `"LED"` emissive intensity based on scroll progress.
  - Configured three-quarter perspective camera in `src/config/motion.ts` (`angleDegrees: 30`, `elevationDegrees: 18`, `distance: 2.15m`, `position: [1.02, 0.62, 1.76]`, `target: [0, 0, -0.04]`, `fov: 42`). Enforced across Drei Views via `<ViewCameraSetup />`.
  - Created `<HologramVideoPlane />` sized to 80% blade diameter ($0.52\text{m}$), using `VideoTexture` with `THREE.AdditiveBlending`, hidden initially, fading in and rising past scroll progress 0.7. Falls back cleanly to procedural hologram when `/assets/demo/holo-loop.mp4` is absent.
- **Why:** Delivers an honest, industrial 3D perspective showcasing actual product hardware without top-down flattening or vibe-coded neon clutter.

