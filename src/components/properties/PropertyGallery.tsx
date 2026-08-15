"use client";

import { useState } from "react";
import Image from "next/image";
import { Home } from "lucide-react";
import type { PropertyMedia } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PropertyGallery({ images }: { images: PropertyMedia[] }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
        <Home size={56} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
        <Image src={images[active].url} alt="" fill className="object-cover" unoptimized />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActive(idx)}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition",
                idx === active ? "border-primary" : "border-transparent opacity-80 hover:opacity-100"
              )}
            >
              <Image src={img.url} alt="" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
