import type { Metadata, Viewport } from "next";
import { Archivo, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";

const fontArchivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["600", "700", "800"],
});

const fontPublicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

const fontIbmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F3F1EC",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "DK Unique Production | 3D Holographic Fans & Display Equipment",
    template: "%s | DK Unique Production",
  },
  description:
    "Trader and supplier of 3D holographic fans, hologram display boxes, LED projectors and logo projectors based in Okhla, New Delhi.",
  robots: {
    index: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
    follow: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontArchivo.variable} ${fontPublicSans.variable} ${fontIbmPlexMono.variable}`}
    >
      <body className="bg-paper text-ink font-body antialiased selection:bg-signal selection:text-ink">
        {children}
      </body>
    </html>
  );
}
