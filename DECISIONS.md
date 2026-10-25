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
