"use client";

import React, { useState } from "react";
import type { Category, Product } from "@/types";
import type { FanSizeEntry } from "@/lib/data/products";
import { CanvasManager } from "@/components/three/CanvasManager";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { SizesSection } from "@/components/home/SizesSection";
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
  fanSizes: FanSizeEntry[];
}

export function HomeClient({
  categories,
  popularFans,
  fanSizes,
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
          {/* Hero Section */}
          <HeroSection onOpenQuoteModal={() => handleOpenQuote()} />

          {/* How It Works Scroll Storytelling */}
          <HowItWorksSection />

          {/* Sizes Scale Sequence */}
          <SizesSection
            models={fanSizes}
            onSelectModelQuote={(name) => handleOpenQuote(name)}
          />

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
