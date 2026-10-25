import type { Metadata } from "next";
import { Studio } from "./StudioClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioPage() {
  return <Studio />;
}
