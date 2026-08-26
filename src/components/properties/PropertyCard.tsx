import Link from "next/link";
import Image from "next/image";
import { Home, BedDouble, MapPin } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatPrix } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { FavoriButton } from "@/components/properties/FavoriButton";

export function PropertyCard({ property, isFavori = false }: { property: Property; isFavori?: boolean }) {
  const image = property.images?.find((i) => i.is_principale)?.url ?? property.images?.[0]?.url;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
      <Link href={`/listings/${property.id}`}>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={property.title}
              fill
              className="object-cover transition group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
              <Home size={40} strokeWidth={1.5} />
            </div>
          )}
        </div>
      </Link>
      <div className="absolute left-2 top-2">
        {property.is_verified && (
          <Badge variant="secondary" className="shadow-sm">
            Vérifiée
          </Badge>
        )}
      </div>
      <div className="absolute right-2 top-2">
        <FavoriButton propertyId={property.id} initial={isFavori} />
      </div>
      <div className="space-y-1.5 p-3">
        <h3 className="line-clamp-1 font-heading font-medium">{property.title}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex min-w-0 flex-1 items-center gap-1">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{[property.quartier, property.ville].filter(Boolean).join(", ")}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <BedDouble size={13} />
            {property.nb_pieces}
          </span>
        </div>
        <p className="truncate text-xs capitalize text-muted-foreground">{property.type_logement}</p>
        <p className="truncate font-semibold text-primary">
          {formatPrix(property.prix_loyer, property.devise)}{" "}
          <span className="text-xs font-normal text-muted-foreground sm:text-sm">/ mois</span>
        </p>
      </div>
    </div>
  );
}
