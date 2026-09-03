"use client";

import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as adminApi from "@/lib/api/admin";
import * as propertiesApi from "@/lib/api/properties";
import { formatPrix } from "@/lib/format";
import { LoadingState } from "@/components/ui/loading-state";
import { ButtonLink } from "@/components/ui/button-link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import { Building2, Home, MapPin, BedDouble, Trash2, Ban, CheckCircle2 } from "lucide-react";
import type { Property } from "@/lib/types";

function PropertyAdminCard({
  p,
  onVerify,
  onSuspend,
  onDelete,
  busy,
}: {
  p: Property;
  onVerify: () => void;
  onSuspend: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const image = p.media_principal?.url ?? p.images?.[0]?.url;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {image ? (
          <Image src={image} alt={p.title} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
            <Home size={36} strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute left-2 top-2">
          <Badge variant={p.is_verified ? "secondary" : "outline"} className="bg-card shadow-sm">
            {p.is_verified ? "Publiée" : "Suspendue"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 font-heading font-medium">{p.title}</h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {[p.quartier, p.ville].filter(Boolean).join(", ") || "—"}
          </span>
          <span className="flex items-center gap-1">
            <BedDouble size={13} /> {p.nb_pieces} pièce{p.nb_pieces > 1 ? "s" : ""}
          </span>
          <span className="capitalize">{p.type_logement}</span>
        </div>

        <p className="font-semibold text-primary">{formatPrix(p.prix_loyer, p.devise)} / mois</p>

        <p className="text-xs text-muted-foreground">
          Publié par{" "}
          <span className="font-medium text-foreground">{p.proprietaire?.name ?? "Propriétaire inconnu"}</span>
          {p.proprietaire?.phone ? ` · ${p.proprietaire.phone}` : ""}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <ButtonLink href={`/listings/${p.id}`} variant="outline" size="sm">
            Voir
          </ButtonLink>
          {p.is_verified ? (
            <Button size="sm" variant="outline" onClick={onSuspend} disabled={busy} className="gap-1.5">
              <Ban size={14} /> Suspendre
            </Button>
          ) : (
            <Button size="sm" onClick={onVerify} disabled={busy} className="gap-1.5">
              <CheckCircle2 size={14} /> Publier
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            disabled={busy}
            className="ml-auto gap-1.5"
          >
            <Trash2 size={14} /> Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPropertiesPage() {
  const queryClient = useQueryClient();
  const confirmDelete = useConfirmDialog();

  const all = useQuery({
    queryKey: ["admin-properties-all"],
    queryFn: () => adminApi.toutesLesAnnonces(),
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-properties-pending"] });
    queryClient.invalidateQueries({ queryKey: ["admin-properties-all"] });
  };

  const verify = useMutation({
    mutationFn: (id: number) => propertiesApi.verify(id, true),
    onSuccess: () => {
      toast.success("Annonce publiée.");
      invalidateAll();
    },
    onError: () => toast.error("Impossible de valider cette annonce."),
  });

  const suspend = useMutation({
    mutationFn: (id: number) => propertiesApi.verify(id, false),
    onSuccess: () => {
      toast.success("Annonce suspendue.");
      invalidateAll();
    },
    onError: () => toast.error("Impossible de suspendre cette annonce."),
  });

  const remove = useMutation({
    mutationFn: (id: number) => propertiesApi.remove(id),
    onSuccess: () => {
      toast.success("Annonce supprimée définitivement.");
      confirmDelete.close();
      invalidateAll();
    },
    onError: () => toast.error("Impossible de supprimer cette annonce."),
  });

  const busy = verify.isPending || suspend.isPending || remove.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Annonces</h1>
        <p className="text-sm text-muted-foreground">
          Publication automatique : chaque nouvelle annonce est visible immédiatement. Vous pouvez la
          suspendre ou la supprimer à tout moment.
        </p>
      </div>

      {all.isLoading ? (
        <LoadingState />
      ) : !all.data || all.data.data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <Building2 className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Aucune annonce pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {all.data.data.map((p) => (
            <PropertyAdminCard
              key={p.id}
              p={p}
              busy={busy}
              onVerify={() => verify.mutate(p.id)}
              onSuspend={() => suspend.mutate(p.id)}
              onDelete={() => confirmDelete.ask(p.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete.target !== null}
        onOpenChange={(open) => !open && confirmDelete.close()}
        title="Supprimer cette annonce ?"
        description="L'annonce et tous ses médias seront supprimés définitivement. Cette action est irréversible."
        onConfirm={() => confirmDelete.target && remove.mutate(confirmDelete.target)}
        loading={remove.isPending}
      />
    </div>
  );
}
