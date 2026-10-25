import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getDemoVideos } from "@/lib/data";
import { copy } from "@/content/copy";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { DemoVideosList } from "@/components/demo/DemoVideosList";
import { DemoForm } from "@/components/forms/DemoForm";
import { OrganizationJsonLd, VideoJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Product Demos | DK Unique Production",
  description: copy.demo.body,
};

export default async function DemoPage() {
  const videos = await getDemoVideos();

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <OrganizationJsonLd />
      {videos.map((video) => (
        <VideoJsonLd
          key={video.id}
          video={video}
        />
      ))}

      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <span className="text-ink font-medium">Demo</span>
        </div>

        {/* Section 1: Videos */}
        <section className="space-y-6">
          <div className="border-b border-line pb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-muted uppercase tracking-wider">
                01 / Video Demos
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
              {copy.demo.heading}
            </h1>
            <p className="font-body text-base text-muted mt-2 max-w-xl">
              {copy.demo.body}
            </p>
          </div>

          <DemoVideosList videos={videos} />
        </section>

        {/* Section 2: Booking Form */}
        <section className="space-y-6 pt-6 border-t border-line">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">
              02 / Schedule a Live Demonstration
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink tracking-tight mt-1">
              {copy.forms.demo.title}
            </h2>
            <p className="font-body text-sm text-muted mt-1">
              Choose between a video call or visit our Okhla industrial facility in person.
            </p>
          </div>

          <div className="max-w-2xl">
            <DemoForm />
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomBar />
    </div>
  );
}
