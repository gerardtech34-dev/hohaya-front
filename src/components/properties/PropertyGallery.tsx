"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Home, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { PropertyMedia } from "@/lib/types";
import { cn } from "@/lib/utils";

function proxyVideoUrl(url: string): string {
  // Passe les vidéos via le proxy Next.js pour supporter les range requests
  try {
    const u = new URL(url);
    if (u.pathname.startsWith("/storage/")) {
      return `/api/storage${u.pathname.replace("/storage", "")}`;
    }
  } catch {}
  return url;
}

export function PropertyGallery({ images = [], videos = [] }: { images?: PropertyMedia[]; videos?: PropertyMedia[] }) {
  const media = [
    ...images.map((i) => ({ ...i, type: "image" as const })),
    ...videos.map((v) => ({ ...v, type: "video" as const, url: proxyVideoUrl(v.url) })),
  ];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % media.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + media.length) % media.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, media.length]);

  if (media.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
        <Home size={56} strokeWidth={1.5} />
      </div>
    );
  }

  const current = media[active];

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="relative block aspect-video w-full cursor-zoom-in overflow-hidden rounded-2xl bg-muted"
      >
        {current.type === "video" ? (
          <video src={current.url} className="h-full w-full object-cover" muted playsInline preload="metadata" />
        ) : (
          <Image src={current.url} alt="" fill className="object-cover" unoptimized />
        )}
        {current.type === "video" && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex size-14 items-center justify-center rounded-full bg-white/90">
              <Play size={24} className="ml-0.5 fill-foreground text-foreground" />
            </span>
          </span>
        )}
      </button>

      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {media.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setActive(idx)}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition",
                idx === active ? "border-primary" : "border-transparent opacity-80 hover:opacity-100"
              )}
            >
              {m.type === "video" ? (
                <>
                  <video src={m.url} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play size={16} className="fill-white text-white" />
                  </span>
                </>
              ) : (
                <Image src={m.url} alt="" fill className="object-cover" unoptimized />
              )}
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95">
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Fermer"
            className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={22} />
          </button>

          <div className="relative flex flex-1 items-center justify-center px-4 py-16 sm:px-16">
            {media.length > 1 && (
              <button
                type="button"
                onClick={() => setActive((i) => (i - 1 + media.length) % media.length)}
                aria-label="Précédent"
                className="absolute left-2 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {current.type === "video" ? (
              <video src={current.url} className="max-h-full max-w-full" controls autoPlay playsInline />
            ) : (
              <div className="relative h-full w-full">
                <Image src={current.url} alt="" fill className="object-contain" unoptimized />
              </div>
            )}

            {media.length > 1 && (
              <button
                type="button"
                onClick={() => setActive((i) => (i + 1) % media.length)}
                aria-label="Suivant"
                className="absolute right-2 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>

          {media.length > 1 && (
            <p className="pb-6 text-center text-sm text-white/70">
              {active + 1} / {media.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
