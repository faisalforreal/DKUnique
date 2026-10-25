import { siteConfig } from "@/config/site";
import type { SiteSettings } from "@/types";

export async function getSiteSettings(): Promise<SiteSettings> {
  return {
    name: siteConfig.name,
    phone: siteConfig.phoneDisplay,
    whatsapp: siteConfig.whatsappDisplay,
    email: siteConfig.email || undefined,
    address: siteConfig.address.full,
    gst: siteConfig.gstNumber,
  };
}
