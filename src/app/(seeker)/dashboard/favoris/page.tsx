"use client";

import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { mesFavoris } from "@/lib/api/chercheur";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { ButtonLink } from "@/components/ui/button-link";
import { LoadingState } from "@/components/ui/loading-state";

export default function FavorisPage() {
  const { data, isLoading } = useQuery({ queryKey: ["favoris"], queryFn: mesFavoris });
  const favoris = data?.data.filter((f) => f.property) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Mes favoris</h1>
      {isLoading ? (
        <LoadingState />
      ) : favoris.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <Heart className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Vous n&apos;avez pas encore de favoris.</p>
          <ButtonLink href="/listings" size="sm">
            Parcourir les annonces
          </ButtonLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoris.map((f) => (
            <PropertyCard key={f.id} property={f.property!} isFavori />
          ))}
        </div>
      )}
    </div>
  );
}
