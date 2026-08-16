import { PropertyCard } from "@/components/properties/PropertyCard";
import { HeroSearch } from "@/components/home/HeroSearch";
import { BrowseCities } from "@/components/home/BrowseCities";
import * as propertiesApi from "@/lib/api/properties";

export default async function HomePage() {
  const result = await propertiesApi.list({ page: 1, per_page: 24 }).catch(() => null);
  const properties = result?.data ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-muted/50 to-background px-4 pb-10 pt-12 sm:pt-16">
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          <h1 className="font-heading text-3xl font-bold leading-tight text-balance sm:text-4xl lg:text-5xl">
            Trouve <span className="text-primary">une maison à louer</span> pour ta rentrée
          </h1>
          <div className="mx-auto max-w-2xl text-left">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Grille d'annonces — directement sous le hero, sans titre de section */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-[1440px]">
          {properties.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Aucune annonce disponible pour le moment.
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

      {/* Parcourir par ville */}
      <BrowseCities />
    </div>
  );
}
