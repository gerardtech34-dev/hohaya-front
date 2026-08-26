import { notFound } from "next/navigation";
import * as propertiesApi from "@/lib/api/properties";
import type { Property } from "@/lib/types";
import { formatPrix } from "@/lib/format";
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { UnlockContact } from "@/components/properties/UnlockContact";
import { ReserveButton } from "@/components/properties/ReserveButton";
import { Home, BedDouble, Wallet, Zap, Droplet, MapPin, Waves, ShieldCheck, Car, Sofa } from "lucide-react";

const EQUIPEMENTS: { key: "eau_courante" | "electricite" | "gardien" | "parking" | "meuble"; label: string; icon: typeof Zap }[] = [
  { key: "eau_courante", label: "Eau courante", icon: Waves },
  { key: "electricite", label: "Électricité", icon: Zap },
  { key: "gardien", label: "Gardien", icon: ShieldCheck },
  { key: "parking", label: "Parking", icon: Car },
  { key: "meuble", label: "Meublé", icon: Sofa },
];

const CARACTERISTIQUES = (property: Property) => [
  { label: "Type", value: <span className="capitalize">{property.type_logement}</span>, icon: Home },
  { label: "Pièces", value: property.nb_pieces, icon: BedDouble },
  { label: "Avance", value: `${property.nb_avance} mois`, icon: Wallet },
  { label: "Caution électricité", value: formatPrix(property.caution_electricite, property.devise), icon: Zap },
  { label: "Caution eau", value: formatPrix(property.caution_eau, property.devise), icon: Droplet },
];

export default async function AnnonceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await propertiesApi.get(id).catch(() => null);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PropertyGallery images={property.images ?? []} videos={property.videos ?? []} />

          <div>
            <h1 className="font-heading text-2xl font-bold">{property.title}</h1>
            <p className="text-muted-foreground">
              {[property.quartier, property.commune, property.ville, property.pays].filter(Boolean).join(", ")}
            </p>
          </div>

          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{property.description}</p>

          {property.status === "disponible" && (
            <div className="lg:hidden">
              <ReserveButton propertyId={property.id} />
            </div>
          )}

          {EQUIPEMENTS.some((eq) => property[eq.key]) && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-4 font-heading font-semibold">Équipements</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                {EQUIPEMENTS.filter((eq) => property[eq.key]).map((eq) => (
                  <div key={eq.key} className="flex items-center gap-2 text-sm">
                    <eq.icon className="shrink-0 text-primary" size={17} />
                    <span>{eq.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-4 font-heading font-semibold">Caractéristiques</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
              {CARACTERISTIQUES(property).map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <item.icon className="mt-0.5 shrink-0 text-primary" size={17} />
                  <div className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{item.label}</dt>
                    <dd className="font-medium leading-tight">{item.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {property.indications_acces && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="mb-3 flex items-center gap-2 font-heading font-semibold">
                <MapPin className="text-primary" size={18} />
                Comment y accéder
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {property.indications_acces}
              </p>
            </div>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-24">
            <p className="font-heading text-2xl font-bold text-primary">
              {formatPrix(property.prix_loyer, property.devise)}
              <span className="text-sm font-normal text-muted-foreground"> / mois</span>
            </p>
            <div className="space-y-3">
              <UnlockContact propertyId={property.id} />
              {property.status === "disponible" && <ReserveButton propertyId={property.id} />}
            </div>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden border-t border-border bg-card/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-hidden px-1 sm:gap-3">
          <p className="shrink-0 text-center font-heading text-base font-bold whitespace-nowrap text-primary sm:text-lg">
            {formatPrix(property.prix_loyer, property.devise)}
            <span className="block text-center text-xs font-normal text-muted-foreground">/ mois</span>
          </p>
          <div className="min-w-0 flex-1">
            <UnlockContact propertyId={property.id} compact />
          </div>
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}
