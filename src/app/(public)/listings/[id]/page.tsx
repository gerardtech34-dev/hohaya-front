import { notFound } from "next/navigation";
import * as propertiesApi from "@/lib/api/properties";
import { formatPrix } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { UnlockContact } from "@/components/properties/UnlockContact";
import { RequestVisitDialog } from "@/components/properties/RequestVisitDialog";

const EQUIPEMENTS: { key: "eau_courante" | "electricite" | "gardien" | "parking" | "meuble"; label: string }[] = [
  { key: "eau_courante", label: "Eau courante" },
  { key: "electricite", label: "Électricité" },
  { key: "gardien", label: "Gardien" },
  { key: "parking", label: "Parking" },
  { key: "meuble", label: "Meublé" },
];

export default async function AnnonceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await propertiesApi.get(id).catch(() => null);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PropertyGallery images={property.images ?? []} />

          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-heading text-2xl font-bold">{property.title}</h1>
              {property.is_verified && <Badge variant="secondary">Annonce vérifiée</Badge>}
            </div>
            <p className="text-muted-foreground">
              {[property.quartier, property.commune, property.ville, property.pays].filter(Boolean).join(", ")}
            </p>
          </div>

          <p className="whitespace-pre-line leading-relaxed">{property.description}</p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {EQUIPEMENTS.filter((eq) => property[eq.key]).map((eq) => (
              <Badge key={eq.key} variant="outline">
                {eq.label}
              </Badge>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-3 font-heading font-semibold">Caractéristiques</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Type</dt>
                <dd className="capitalize">{property.type_logement}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Pièces</dt>
                <dd>{property.nb_pieces}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Avance</dt>
                <dd>{property.nb_avance} mois</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Caution électricité</dt>
                <dd>{formatPrix(property.caution_electricite, property.devise)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Caution eau</dt>
                <dd>{formatPrix(property.caution_eau, property.devise)}</dd>
              </div>
            </dl>
          </div>

          {property.indications_acces && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <h2 className="mb-2 font-heading font-semibold">Comment y accéder</h2>
              <p className="text-sm text-muted-foreground">{property.indications_acces}</p>
            </div>
          )}
        </div>

        <aside>
          <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-24">
            <p className="font-heading text-2xl font-bold text-primary">
              {formatPrix(property.prix_loyer, property.devise)}
              <span className="text-sm font-normal text-muted-foreground"> / mois</span>
            </p>
            <div className="space-y-3">
              <UnlockContact propertyId={property.id} />
              <RequestVisitDialog propertyId={property.id} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
