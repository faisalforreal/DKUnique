import Link from "next/link";
import { siteConfig } from "@/config/site";
import { copy } from "@/content/copy";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="w-full bg-stage text-paper border-t border-line/20 pt-16 pb-24 md:pb-16">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-line/20">
          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-5 space-y-4">
            <Logo inverted />
            <p className="text-sm text-paper/70 font-body max-w-sm">
              {siteConfig.tagline}. Based in Okhla, New Delhi.
            </p>
            <div className="pt-2">
              <span className="font-mono text-xs uppercase tracking-wider text-paper/50 block">
                Registration
              </span>
              <span className="font-mono text-sm text-paper/90">
                {copy.footer.gst}
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-paper/50 block">
              Catalog & Services
            </span>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-paper/80 hover:text-signal transition-colors"
                >
                  {copy.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  href="/rental"
                  className="text-paper/80 hover:text-signal transition-colors"
                >
                  {copy.nav.rental}
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="text-paper/80 hover:text-signal transition-colors"
                >
                  {copy.nav.demo}
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-paper/80 hover:text-signal transition-colors"
                >
                  {copy.nav.gallery}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-paper/80 hover:text-signal transition-colors"
                >
                  {copy.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-paper/80 hover:text-signal transition-colors"
                >
                  {copy.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Address */}
          <div className="md:col-span-4 space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-paper/50 block">
              Contact & Location
            </span>
            <address className="not-italic text-sm text-paper/80 space-y-2 font-body">
              <p>{siteConfig.address.full}</p>
              <p className="pt-1">
                <span className="text-paper/50 font-mono text-xs block">Phone:</span>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-paper hover:text-signal font-mono text-sm"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </p>
              {siteConfig.email && (
                <p className="pt-1">
                  <span className="text-paper/50 font-mono text-xs block">Email:</span>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-paper hover:text-signal font-mono text-sm"
                  >
                    {siteConfig.email}
                  </a>
                </p>
              )}
              <p className="pt-1">
                <span className="text-paper/50 font-mono text-xs block">Instagram:</span>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper hover:text-signal font-mono text-sm"
                >
                  {siteConfig.social.instagramHandle}
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar: Rights */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-paper/50">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {copy.footer.allRightsReserved}
          </p>
          <p className="text-paper/40">
            {siteConfig.entityType} • {siteConfig.establishedText}
          </p>
        </div>
      </div>
    </footer>
  );
}
