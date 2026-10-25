import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "srv-fan-rental",
    slug: "rental-hologram-fan",
    name: "3D Hologram Fan Rental",
    category: "rental",
    description:
      "65 cm round fan for events and exhibitions. Wall or ceiling mount with Wi-Fi control.",
    specs: [
      { label: "Diameter", value: "65 cm" },
      { label: "Mount Type", value: "Wall or ceiling mount" },
      { label: "Connectivity", value: "Wi-Fi" },
      { label: "Voltage", value: "24 V DC" },
      { label: "Video Wall Support", value: "2x6 ft and 4x6 ft configurations" },
    ],
    priceApprox: 5000,
    priceUnit: "Piece",
    flagged: true,
    flagNotes: ["Time unit not stated on listing (daily vs event rate unknown)."],
    image: {
      src: "/assets/products/rental-hologram-fan/main.webp",
      alt: "3D Hologram Fan Rental",
      width: 500,
      height: 500,
    },
  },
  {
    id: "srv-projector-rental",
    slug: "rental-projector",
    name: "Projector Rental",
    category: "rental",
    description: "High brightness projector rental with projection screen included.",
    specs: [
      { label: "Brightness", value: "5001 - 8000 lm" },
      { label: "Screen", value: "Included" },
      { label: "Rental Period", value: "Daily" },
    ],
    priceApprox: 15000,
    priceUnit: "Day",
    flagged: false,
    flagNotes: [],
    image: {
      src: "/assets/products/projector-digicast-dcx/main.webp",
      alt: "Projector Rental",
      width: 500,
      height: 500,
    },
  },
  {
    id: "srv-led-screen-rental",
    slug: "rental-led-screen",
    name: "12x8 Feet LED Screen Rental",
    category: "rental",
    description: "12x8 feet LED video screen for indoor and outdoor events.",
    specs: [
      { label: "Size", value: "12x8 Feet" },
    ],
    priceApprox: 5000,
    priceUnit: "Unit",
    flagged: true,
    flagNotes: ["Time unit and technical resolution not stated on listing."],
    image: {
      src: "/assets/products/led-display-32/main.webp",
      alt: "12x8 Feet LED Screen Rental",
      width: 500,
      height: 500,
    },
  },
];
