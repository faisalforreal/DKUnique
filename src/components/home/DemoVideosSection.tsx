"use client";

import React, { useState } from "react";
import Image from "next/image";
import { copy } from "@/content/copy";
import { demoVideos } from "@/data/demo-videos";
import { Button } from "@/components/ui/Button";

function VideoFacade({
  youtubeId,
  title,
  thumbnailUrl,
}: {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-[2px] overflow-hidden border border-line">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsPlaying(true)}
      className="group relative w-full aspect-video bg-neutral-900 rounded-[2px] overflow-hidden border border-line cursor-pointer select-none"
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {/* Click-to-load play button facade */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-ink text-paper border border-paper/40 flex items-center justify-center rounded-[2px] group-hover:scale-105 transition-transform">
          <span className="font-mono text-xl ml-1">▶</span>
        </div>
      </div>
      <div className="absolute bottom-3 left-3 bg-ink/80 text-paper font-mono text-xs px-2 py-1 rounded-[2px]">
        {title}
      </div>
    </div>
  );
}

export function DemoVideosSection() {
  return (
    <section id="demo-videos" className="w-full bg-paper text-ink py-20 border-b border-line">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-10 border-b border-line pb-4">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-muted">03</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink">
              {copy.demo.heading}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="font-body text-sm text-muted max-w-md hidden sm:block">
              {copy.demo.body}
            </p>
            <Button variant="primary" href="/demo" size="sm">
              {copy.demo.button}
            </Button>
          </div>
        </div>

        {/* 2 Large Video Facades Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {demoVideos.map((video) => (
            <VideoFacade
              key={video.id}
              youtubeId={video.youtubeId}
              title={video.title}
              thumbnailUrl={video.thumbnailUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
