import React from "react";
import { siteConfig } from "@/config/site";
import type { Product, DemoVideo } from "@/types";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.tagline,
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.line1,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.pincode,
      addressCountry: "IN",
    },
    founder: {
      "@type": "Person",
      name: siteConfig.owner.name,
      jobTitle: siteConfig.owner.role,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0] ? `${siteUrl}${product.images[0].src}` : undefined,
    sku: product.slug,
    offers: product.priceApprox
      ? {
          "@type": "Offer",
          priceCurrency: "INR",
          price: product.priceApprox,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function VideoJsonLd({ video }: { video: DemoVideo }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: `Demonstration video for visual display technology by ${siteConfig.name}`,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: "2024-01-01T08:00:00+05:30",
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
