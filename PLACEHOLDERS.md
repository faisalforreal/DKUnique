# Unconfirmed Items & Discrepancies Log (PLACEHOLDERS.md)

This living document catalogs every missing data point, unverified specification, and listing discrepancy discovered in DK Unique Production's IndiaMART catalog and historical data. **The business owner (Devendra Jain) must confirm these items before final production launch.**

---

## 1. Contact & Business Information
| Item | Current Fallback / State | Owner Action Required |
|---|---|---|
| **Phone / WhatsApp Number** | `+91 79485 48724` | Confirm if this is Mr. Devendra Jain's direct commercial number or an IndiaMART-routed virtual number. |
| **Email Address** | None listed (`NEXT_PUBLIC_EMAIL` left empty; mailto links hidden) | Provide official business email address for lead notifications and footer. |
| **Google Maps Embed** | Generic Okhla Industrial Area Phase 2 coordinates | Provide verified Google Maps Share -> Embed URL for B-46 DDA Sheds unit. |
| **Walk-in Policy** | "Please call before visiting." | Confirm whether B-46 DDA Sheds has a walk-in demonstration showroom or is an industrial workshop requiring appointments. |
| **Logo Artwork** | Typographic wordmark ("DK UNIQUE Production") | Provide vector SVG logo asset (can be dropped into `/public/assets/brand/logo.svg`). |

---

## 2. Product Specification & Pricing Conflicts

### 2.1 3D Holographic Fans
- **14 cm 2-Blade Fan (`fan-14cm-2-blade`):** Power rating is listed as **50 W** in main table, but sub-table describes consumption as **6–10 W**. Flagged on site.
- **42 cm Fan (`fan-42cm`):** Current IndiaMART listing quotes **₹3,000**, while earlier cached catalog indicated **₹2,800 (black)**. Flagged on site.
- **52 cm Fan (`fan-52cm`):** Catalog image filename reads `"42cm 4 blade"`. Flagged on site.
- **65 cm Fan Wall (`fan-65cm-wall`):** Specification lists **12 blades**, while description body states **4 blades**. Flagged on site.
- **70 cm Fan (`fan-70cm`):** Minimum Order Quantity (MOQ) is missing from source listing. Set to null (`"MOQ: ask us"` in UI).
- **100 cm Fan (`fan-100cm`):** Image filename indicates `"4 blade"`.
- **LED Counts across all fans:** Source listing claims **576 LEDs** identically across 42cm, 46cm, 52cm, 60cm, 65cm, 70cm, 80cm, and 100cm models. Flagged on site.
- **Unpublished Entries:** Two spec-less entries on old site (*"3d Hologram Fan"* at ₹2,000 and *"3d Hologram Fan On Rent"* at ₹5,000) have been excluded from the catalog due to complete absence of technical details.

### 2.2 Holographic Displays
- **Projector Holographic Display Fan (35 cm, cylindrical):** Specification text was copied verbatim from the 65 cm fan wall listing in the source catalog.
- **86 Inch Cylindrical Display:** Quoted at **₹7,99,000**, almost identical to the rectangular display at **₹7,99,999**. Confirm whether cylindrical housing incurs different manufacturing costs.
- **3D Hologram Display (Holobox):** Listed under category *"holographic film"* on IndiaMART. Categorized under Holographic Displays.

### 2.3 LED Projectors
- **Digicast Android Portable Projector:** Brightness listed as **5000 lm** in header and **4500 lm** in description.
- **B1 Mini Smart Projector:** Brightness listed as **700 lm** in header and **750 lm** in body.
- **B1 Digicast Mini Projector:** Dimensions published as **144x124x100 cm**, which is physically impossible for a pocket/mini projector.
- **Entry-level Projector Lumens:** Models priced at ₹10,000–₹13,999 claim 5,000 lumens (marketing lumen ratings common in budget projectors). Kept as published and flagged.
- **Epson Digital Projector & Used Projector:** Quoted at ₹15,000 with zero technical specifications provided on source listing.

### 2.4 Logo Projectors
- **15W Logo Projector:** Secondary source quotes 1,300 lm brightness. Unverified.
- **60W Logo Projector:** Secondary source quotes 4,000 lm brightness and dimensions 24x22x17 cm. Unverified.

### 2.5 Rental Services
- **3D Hologram Fan Rental:** Listed at ₹5,000 per piece, but time unit (per day vs per event) is omitted.
- **12x8 Feet LED Screen Rental:** Listed at ₹5,000 per unit, but duration (per day / per event) and pixel pitch are omitted.

### 2.6 Unpriced / Unspecified Items
The following items exist in the catalog with null prices and no specifications:
- AI Photobooth
- Upright Video Gaming Machine
- Coin Operated Claw Machine
- 12mm Silicone Wristbands
- Capsule Toy Ball
- 20mm Printed Lanyard
- Humanoid Service Robot for Interactive Display
- Indoor LED Video Wall
- Boxing Arcade Game Machine

*These are excluded from the homepage and listed only under "More products".*
