import { Home } from "lucide-react";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { HeroSearch } from "@/components/home/HeroSearch";
import * as propertiesApi from "@/lib/api/properties";

export const metadata = { title: "Annonces" };

type SearchParams = {
  city?: string;
  commune?: string;
  district?: string;
  type?: string;
  min_price?: string;
  max_price?: string;
  page?: string;
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const result = await propertiesApi
    .list({
      ville: params.city,
      commune: params.commune,
      quartier: params.district,
      type_logement: params.type,
      prix_min: params.min_price ? Number(params.min_price) : undefined,
      prix_max: params.max_price ? Number(params.max_price) : undefined,
      page: params.page ? Number(params.page) : undefined,
      per_page: 24,
    })
    .catch(() => null);

  const properties = result?.data ?? [];

  return (
    <div>
      {/* Hero — même traitement que la landing */}
      <section className="bg-gradient-to-b from-muted/50 to-background px-4 pb-10 pt-12 sm:pt-16">
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
            Toutes les <span className="text-primary">maisons à louer</span>
          </h1>
          <div className="mx-auto flex max-w-2xl flex-col items-stretch gap-3 text-left sm:flex-row sm:items-center">
            <div className="flex-1">
              <HeroSearch />
            </div>
            <div className="flex justify-center sm:justify-start">
              <PropertyFilters />
            </div>
          </div>
          <p className="flex items-center justify-center gap-1.5 text-sm text-secondary">
            <Home size={16} />
            {result ? `${result.total} maison${result.total > 1 ? "s" : ""} vérifiée${result.total > 1 ? "s" : ""} disponible${result.total > 1 ? "s" : ""}` : "Annonces vérifiées avant publication"}
          </p>
        </div>
      </section>

      {/* Grille — directement sous le hero, sans titre de section */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-[1440px]">
          {properties.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Aucune annonce ne correspond à votre recherche.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
