import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getServices } from "@/lib/data";
import { copy } from "@/content/copy";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { RentalForm } from "@/components/forms/RentalForm";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Rental Equipment | DK Unique Production",
  description: copy.rental.body,
};

export default async function RentalPage() {
  const services = await getServices();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <OrganizationJsonLd />
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">Rental</span>
        </div>

        {/* Section 1: Header */}
        <div className="border-b border-line pb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">
              01 / Rental Equipment
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            {copy.rental.heading}
          </h1>
          <p className="font-body text-base text-muted mt-2 max-w-xl">
            {copy.rental.body}
          </p>
        </div>

        {/* Section 2: Equipment Catalog */}
        <section className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="border border-line bg-paper rounded-[2px] flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full bg-neutral-100 border-b border-line">
                    <Image
                      src={service.image.src}
                      alt={service.image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-ink">
                        {service.name}
                      </h3>
                      <p className="font-body text-xs text-muted mt-1">
                        {service.description}
                      </p>
                    </div>

                    {/* Spec table */}
                    <div className="border-t border-line pt-3">
                      <table className="w-full text-left font-mono text-xs">
                        <tbody>
                          {service.specs.map((spec, idx) => (
                            <tr key={idx} className="border-b border-line/50 last:border-0">
                              <td className="py-1 text-muted pr-2">{spec.label}</td>
                              <td className="py-1 text-ink font-medium text-right">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-line/40 bg-black/[0.01]">
                  <div className="pt-3 pb-2 flex items-baseline justify-between">
                    <span className="font-mono text-xs text-muted">Approx. rate</span>
                    <span className="font-mono text-sm font-semibold text-ink">
                      {service.priceApprox !== null
                        ? `₹${service.priceApprox.toLocaleString("en-IN")}${
                            service.priceUnit ? ` / ${service.priceUnit}` : ""
                          }`
                        : "Ask for quote"}
                    </span>
                  </div>
                  {service.flagged && (
                    <p className="font-mono text-[11px] text-muted italic">
                      * Rate may vary based on event location and duration.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Booking & Enquiry Form */}
        <section id="rental-form" className="space-y-6 pt-6 border-t border-line">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">
              02 / Request an Event Quote
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink tracking-tight mt-1">
              {copy.forms.rental.title}
            </h2>
            <p className="font-body text-sm text-muted mt-1">
              Share your event dates, city, and unit requirements. We will check availability and return a confirmed quote.
            </p>
          </div>

          <div className="max-w-2xl">
            <RentalForm />
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
