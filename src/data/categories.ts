import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-fans",
    slug: "3d-holographic-fans",
    name: "3D Holographic Fans",
    description:
      "Spinning LED fans that show floating 3D images, logos and video. 14 cm to 100 cm.",
    image: {
      src: "/assets/products/fan-42cm/main.webp",
      alt: "3D Holographic Fans",
      width: 500,
      height: 500,
    },
    featured: true,
    sortOrder: 1,
  },
  {
    id: "cat-displays",
    slug: "holographic-display",
    name: "Holographic Displays",
    description: "Hologram boxes and display fans, including 86 inch models.",
    image: {
      src: "/assets/products/hologram-display-box/main.webp",
      alt: "Holographic Displays",
      width: 500,
      height: 500,
    },
    featured: true,
    sortOrder: 2,
  },
  {
    id: "cat-projectors",
    slug: "led-projector",
    name: "LED Projectors",
    description:
      "Portable and Android LED projectors for offices, classrooms and home use.",
    image: {
      src: "/assets/products/projector-digicast-dcx/main.webp",
      alt: "LED Projectors",
      width: 500,
      height: 500,
    },
    featured: true,
    sortOrder: 3,
  },
  {
    id: "cat-logo-projectors",
    slug: "logo-projectors",
    name: "Logo Projectors",
    description:
      "Project a logo or message on a wall or floor. 15 W to 60 W.",
    image: {
      src: "/assets/products/logo-projector-50w/main.webp",
      alt: "Logo Projectors",
      width: 500,
      height: 500,
    },
    featured: true,
    sortOrder: 4,
  },
  {
    id: "cat-rental",
    slug: "rental",
    name: "Rental",
    description: "Hologram fans, projectors and LED screens for your event.",
    image: {
      src: "/assets/products/rental-hologram-fan/main.webp",
      alt: "Rental Equipment",
      width: 500,
      height: 500,
    },
    featured: true,
    sortOrder: 5,
  },
  {
    id: "cat-more",
    slug: "more-products",
    name: "More Products",
    description:
      "LED displays, digital standees, LED wristbands, a humanoid robot and more.",
    image: {
      src: "/assets/products/humanoid-robot-1400/main.webp",
      alt: "More Products",
      width: 500,
      height: 500,
    },
    featured: true,
    sortOrder: 6,
  },
];
