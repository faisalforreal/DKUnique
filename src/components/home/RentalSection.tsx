import React from "react";
import Image from "next/image";
import { copy } from "@/content/copy";
import { Button } from "@/components/ui/Button";

export function RentalSection() {
  return (
    <section className="w-full bg-paper text-ink py-20 border-b border-line">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-baseline gap-4 mb-10 border-b border-line pb-4">
          <span className="font-mono text-sm text-muted">04</span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink">
            {copy.rental.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Half-width Photo */}
          <div className="md:col-span-6 relative aspect-video md:aspect-[4/3] bg-neutral-200 border border-line rounded-[2px] overflow-hidden">
            <Image
              src="/assets/products/rental-hologram-fan/main.webp"
              alt="Hologram Fan Rental"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Half-width Text Block */}
          <div className="md:col-span-6 flex flex-col justify-center space-y-6">
            <p className="font-body text-lg sm:text-xl text-ink leading-relaxed">
              {copy.rental.body}
            </p>

            <div className="pt-2">
              <Button variant="primary" size="lg" href="/rental">
                {copy.rental.button}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
