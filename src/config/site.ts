export interface SiteConfig {
  name: string;
  tagline: string;
  establishedYear: number;
  establishedText: string;
  entityType: string;
  owner: {
    name: string;
    role: string;
  };
  address: {
    line1: string;
    area: string;
    district: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    full: string;
  };
  visitNote: string;
  gstNumber: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  social: {
    instagram: string;
    instagramHandle: string;
  };
  maps: {
    embedUrl: string;
    directionsUrl: string;
  };
  flags: {
    showPrices: boolean;
    showTrustBadges: boolean;
    offersInPersonDemo: boolean;
    reviewMode: boolean;
  };
}

const fullAddress =
  "B-46, DDA Sheds, Okhla Industrial Estate Phase 2, South East Delhi, New Delhi - 110020, Delhi, India";

const rawPhone = process.env.NEXT_PUBLIC_PHONE || "+91 79485 48724";
const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP || "+91 79485 48724";
const rawEmail = process.env.NEXT_PUBLIC_EMAIL || "";

export const siteConfig: SiteConfig = {
  name: "DK Unique Production",
  tagline: "3D holographic fans, display boxes, LED and logo projectors",
  establishedYear: 2020,
  establishedText: "Since 2020",
  entityType: "Proprietorship",
  owner: {
    name: "Devendra Jain",
    role: "CEO",
  },
  address: {
    line1: "B-46, DDA Sheds",
    area: "Okhla Industrial Estate Phase 2",
    district: "South East Delhi",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110020",
    country: "India",
    full: fullAddress,
  },
  visitNote: "Please call before visiting.",
  gstNumber: "07AUBPJ9261D1ZR",
  phone: rawPhone.replace(/\s+/g, ""),
  phoneDisplay: rawPhone,
  whatsapp: rawWhatsApp.replace(/[^0-9]/g, ""),
  whatsappDisplay: rawWhatsApp,
  email: rawEmail,
  social: {
    instagram: "https://www.instagram.com/dkunique.376/",
    instagramHandle: "@dkunique.376",
  },
  maps: {
    embedUrl:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.518641477755!2d77.27137937550889!3d28.524141975724508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce14e7a8345c9%3A0xe54e38e1262ec617!2sDDA%20Sheds%20Okhla%20Phase%202!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      fullAddress
    )}`,
  },
  flags: {
    showPrices: true,
    showTrustBadges: false,
    offersInPersonDemo: false,
    reviewMode: process.env.NEXT_PUBLIC_REVIEW_MODE === "true",
  },
};
