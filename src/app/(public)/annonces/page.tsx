import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import * as propertiesApi from "@/lib/api/properties";

export const metadata = { title: "Annonces" };

type SearchParams = {
  ville?: string;
  commune?: string;
  quartier?: string;
  type_logement?: string;
  prix_min?: string;
  prix_max?: string;
  page?: string;
};

export default async function AnnoncesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const result = await propertiesApi
    .list({
      ville: params.ville,
      commune: params.commune,
      quartier: params.quartier,
      type_logement: params.type_logement,
      prix_min: params.prix_min ? Number(params.prix_min) : undefined,
      prix_max: params.prix_max ? Number(params.prix_max) : undefined,
      page: params.page ? Number(params.page) : undefined,
    })
    .catch(() => null);

  const properties = result?.data ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:py-10">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">Toutes les annonces</h1>
        <p className="text-sm text-muted-foreground">
          {result ? `${result.total} annonce${result.total > 1 ? "s" : ""} disponible${result.total > 1 ? "s" : ""}` : ""}
        </p>
      </div>
      <PropertyFilters />
      {properties.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          Aucune annonce ne correspond à votre recherche.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
