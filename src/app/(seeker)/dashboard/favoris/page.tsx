"use client";

import { useQuery } from "@tanstack/react-query";
import { mesFavoris } from "@/lib/api/chercheur";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavorisPage() {
  const { data, isLoading } = useQuery({ queryKey: ["favoris"], queryFn: mesFavoris });
  const favoris = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mes favoris</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : favoris.length === 0 ? (
        <p className="text-muted-foreground">Vous n&apos;avez pas encore de favoris.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoris
            .filter((f) => f.property)
            .map((f) => (
              <PropertyCard key={f.id} property={f.property!} />
            ))}
        </div>
      )}
    </div>
  );
}
