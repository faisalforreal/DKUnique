import Link from "next/link";
import { siteConfig } from "@/config/site";

interface LogoProps {
  className?: string;
  inverted?: boolean;
}

export function Logo({ className = "", inverted = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex flex-col leading-none tracking-tight focus-visible:outline-2 focus-visible:outline-signal ${className}`}
      aria-label={`${siteConfig.name} - Home`}
    >
      <span
        className={`font-display font-extrabold text-xl tracking-tight uppercase ${
          inverted ? "text-paper" : "text-ink"
        }`}
      >
        DK UNIQUE
      </span>
      <span
        className={`font-mono text-[10px] tracking-widest uppercase mt-0.5 ${
          inverted ? "text-paper/70" : "text-muted"
        }`}
      >
        Production
      </span>
    </Link>
  );
}
