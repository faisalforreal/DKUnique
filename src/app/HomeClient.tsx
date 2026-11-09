"use client";

import React, { useState } from "react";
import type { Category, Product } from "@/types";
import type { FanSizeEntry } from "@/lib/data/products";
import { CanvasManager } from "@/components/three/CanvasManager";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { ShowroomExperience } from "@/components/home/ShowroomExperience";
import { HolographicShowcaseSection } from "@/components/home/HolographicShowcaseSection";
import { CategoriesIndex } from "@/components/home/CategoriesIndex";
import { PopularFansTable } from "@/components/home/PopularFansTable";
import { DemoVideosSection } from "@/components/home/DemoVideosSection";
import { RentalSection } from "@/components/home/RentalSection";
import { FindUsSection } from "@/components/home/FindUsSection";
import { ClosingCallSection } from "@/components/home/ClosingCallSection";
import { QuoteModal } from "@/components/forms/QuoteModal";

interface HomeClientProps {
  categories: Category[];
  popularFans: Product[];
  fanSizes?: FanSizeEntry[];
}

export function HomeClient({
  categories,
  popularFans,
}: HomeClientProps) {
  // Quote Modal State
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteProductName, setQuoteProductName] = useState<string | undefined>();

  const handleOpenQuote = (productName?: string) => {
    setQuoteProductName(productName);
    setQuoteModalOpen(true);
  };

  return (
    <CanvasManager>
      {/* Main UI Layout */}
      <div className="relative flex min-h-screen flex-col bg-paper">
        <Navbar onOpenQuoteModal={() => handleOpenQuote()} />

        <main className="flex-1">
          {/* Scroll-driven 3D holographic showroom */}
          <ShowroomExperience onOpenQuoteModal={() => handleOpenQuote()} />

          {/* Holographic content gallery */}
          <HolographicShowcaseSection />

          {/* 01 What We Supply */}
          <CategoriesIndex categories={categories} />

          {/* 02 Popular Fans Datasheet */}
          <PopularFansTable
            fans={popularFans}
            onOpenQuoteModal={(name) => handleOpenQuote(name)}
          />

          {/* 03 See Them Running */}
          <DemoVideosSection />

          {/* 04 Need One for an Event? */}
          <RentalSection />

          {/* 05 Find Us */}
          <FindUsSection />

          {/* Closing Call */}
          <ClosingCallSection onOpenQuoteModal={() => handleOpenQuote()} />
        </main>

        <Footer />
        <MobileBottomBar onOpenQuoteModal={() => handleOpenQuote()} />

        <QuoteModal
          open={quoteModalOpen}
          onOpenChange={setQuoteModalOpen}
          productName={quoteProductName}
        />
      </div>
    </CanvasManager>
  );
}
