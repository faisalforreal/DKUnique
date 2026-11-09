# 3D Showroom Assets — Drop Guide

This file documents where to place GLB models for the scroll-driven holographic
homepage and what each model is expected to contain.

## Location

Place every new model in:

```
public/assets/models/showroom/<name>.glb
```

Use lowercase, hyphenated filenames. Do **not** include spaces or parentheses.

## Current inventory

| Model | Path | Status |
|---|---|---|
| Physical fan (product) | `public/assets/models/hero-fan.glb` | present (existing, reused as-is) |
| Butterfly | `public/assets/models/showroom/butterfly.glb` | present |
| Butterfly (alternative) | `public/assets/models/showroom/butterfly-alt.glb` | present (backup) |
| Perfume bottle | `public/assets/models/showroom/perfume.glb` | present |
| Brand emblem (DK Unique logo) | `public/assets/models/showroom/emblem.glb` | **to provide** |
| Sneaker | `public/assets/models/showroom/sneaker.glb` | **to provide** |
| Diamond | `public/assets/models/showroom/diamond.glb` | **to provide** |
| Beverage bottle | `public/assets/models/showroom/beverage.glb` | **to provide** |
| Smartphone | `public/assets/models/showroom/smartphone.glb` | optional |
| Headphones | `public/assets/models/showroom/headphones.glb` | optional |
| Football | `public/assets/models/showroom/football.glb` | optional |
| Sports car | `public/assets/models/showroom/sports-car.glb` | optional |
| Luxury handbag | `public/assets/models/showroom/handbag.glb` | optional |
| Miniature storefront | `public/assets/models/showroom/storefront.glb` | optional |
| Concert stage | `public/assets/models/showroom/concert-stage.glb` | optional |
| Digital character | `public/assets/models/showroom/character.glb` | optional |
| Flower / peacock feather | `public/assets/models/showroom/flower.glb` | optional |

## Model requirements

- **Format:** glTF 2.0 `.glb`, Y-up, scale in metres, centered origin (or the
  loader re-centres it automatically).
- **Object-level animation only.** Transitions between models (collapse,
  dissolves, ribbons, materialisation, screen movement) are implemented in the
  website — do **not** bake those into the GLB.
- **Butterfly:** a single looping wing-flap clip named `flap` that animates the
  rotation of two nodes named `wing_left` and `wing_right` (as the current
  `butterfly.glb` already does). The website plays this clip independently of
  scroll.
- **Other showcase models:** static geometry is fine. Rotation, float, scale,
  position and entrance/exit are all website-controlled.

## Size budget

Keep each showroom model under **2 MB** when reasonable. If a model is larger,
optimise it with:

```
npm run models:optimize
```

(uses `@gltf-transform/cli` — Draco/Meshopt geometry compression and KTX2
texture compression) and verify with `npm run models:check`.
