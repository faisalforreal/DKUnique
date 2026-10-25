import Link from "next/link";
import { copy } from "@/content/copy";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-paper text-ink">
      <h1 className="font-mono text-4xl mb-4">{copy.notFound.heading}</h1>
      <p className="text-muted mb-8 max-w-md">{copy.notFound.body}</p>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="px-5 py-2.5 bg-ink text-paper text-sm font-medium hover:underline rounded-[2px]"
        >
          {copy.notFound.homeLink}
        </Link>
        <Link
          href="/products"
          className="px-5 py-2.5 border border-ink text-ink text-sm font-medium hover:underline rounded-[2px]"
        >
          {copy.notFound.productsLink}
        </Link>
      </div>
    </main>
  );
}
