import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { copy } from "@/content/copy";
import { formatInr } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface PopularFansTableProps {
  fans: Product[];
  onOpenQuoteModal: (productName: string) => void;
}

export function PopularFansTable({
  fans,
  onOpenQuoteModal,
}: PopularFansTableProps) {
  return (
    <section className="w-full bg-paper text-ink py-20 border-b border-line">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8 border-b border-line pb-4">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-muted">02</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink">
              {copy.popularFans.heading}
            </h2>
          </div>
          <p className="font-mono text-xs text-muted max-w-md">
            {copy.popularFans.note}
          </p>
        </div>

        {/* Datasheet Table */}
        <div className="overflow-x-auto border border-line bg-paper rounded-[2px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-black/[0.02] font-mono text-xs text-muted uppercase tracking-wider">
                <th className="py-3 px-4 w-16">Photo</th>
                <th className="py-3 px-4">{copy.popularFans.columns.model}</th>
                <th className="py-3 px-4">{copy.popularFans.columns.moq}</th>
                <th className="py-3 px-4">{copy.popularFans.columns.price}</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {fans.map((fan) => (
                <tr
                  key={fan.id}
                  className="hover:bg-black/[0.02] transition-colors"
                >
                  {/* Thumbnail */}
                  <td className="py-3 px-4">
                    <div className="relative w-12 h-12 bg-neutral-200 border border-line rounded-[2px] overflow-hidden flex-shrink-0">
                      {fan.images[0] ? (
                        <Image
                          src={fan.images[0].src}
                          alt={fan.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-[9px] text-muted text-center p-1">
                          No Photo
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Model Name & Detail Link */}
                  <td className="py-3 px-4">
                    <Link
                      href={`/products/${fan.categorySlug}/${fan.slug}`}
                      className="font-body font-semibold text-sm sm:text-base text-ink hover:underline block"
                    >
                      {fan.name}
                    </Link>
                    <span className="font-mono text-xs text-muted">
                      {fan.sizeCm ? `${fan.sizeCm} cm diameter` : ""}
                    </span>
                  </td>

                  {/* MOQ */}
                  <td className="py-3 px-4 font-mono text-sm text-ink">
                    {fan.moq !== null ? `${fan.moq} Piece` : "Ask us"}
                  </td>

                  {/* Approx Price */}
                  <td className="py-3 px-4 font-mono text-sm text-ink font-semibold">
                    {formatInr(fan.priceApprox)}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onOpenQuoteModal(fan.name)}
                    >
                      {copy.popularFans.columns.action}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View All Fans Link */}
        <div className="pt-8 flex justify-end">
          <Link
            href="/products/3d-holographic-fans"
            className="font-mono text-xs sm:text-sm text-ink font-semibold hover:underline flex items-center gap-2"
          >
            {copy.popularFans.viewAll} →
          </Link>
        </div>
      </div>
    </section>
  );
}
