"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

function HeroSearchInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ville, setVille] = useState(searchParams.get("city") ?? "");

  const submit = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (ville) {
      params.set("city", ville);
    } else {
      params.delete("city");
    }
    router.push(`/listings${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="flex items-center gap-2 rounded-full border-2 border-primary/30 bg-card p-2 shadow-sm transition focus-within:border-primary sm:gap-3 sm:p-2.5">
      <Search size={20} className="ml-3 shrink-0 text-muted-foreground" />
      <input
        placeholder="Recherche par école, ville ou quartier..."
        value={ville}
        onChange={(e) => setVille(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className="w-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base"
      />
      <button
        onClick={submit}
        className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover sm:px-7"
      >
        Chercher
      </button>
    </div>
  );
}

export function HeroSearch() {
  return (
    <Suspense
      fallback={
        <div className="h-[52px] w-full animate-pulse rounded-full border-2 border-primary/30 bg-card sm:h-[60px]" />
      }
    >
      <HeroSearchInner />
    </Suspense>
  );
}
