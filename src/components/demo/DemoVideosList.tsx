"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { DemoVideo } from "@/types";

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

export function DemoVideosList({ videos }: { videos: DemoVideo[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {videos.map((video) => (
        <div key={video.id} className="space-y-2">
          <VideoFacade
            youtubeId={video.youtubeId}
            title={video.title}
            thumbnailUrl={video.thumbnailUrl}
          />
          <p className="font-mono text-xs text-muted">
            {video.title} — Unedited footage of unit in motion.
          </p>
        </div>
      ))}
    </div>
  );
}
