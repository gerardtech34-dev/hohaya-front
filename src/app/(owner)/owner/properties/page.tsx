"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as propertiesApi from "@/lib/api/properties";
import { formatPrix } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import { Building2, Home, Pencil, Trash2, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = ["disponible", "loué", "suspendu"];

export default function OwnerPropertiesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["my-properties"], queryFn: () => propertiesApi.myProperties() });
  const properties = data?.data ?? [];
  const confirm = useConfirmDialog();

  const remove = useMutation({
    mutationFn: propertiesApi.remove,
    onSuccess: () => {
      toast.success("Annonce supprimée.");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      confirm.close();
    },
    onError: () => toast.error("Suppression impossible."),
  });

  const changeStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => propertiesApi.changeStatus(id, status),
    onSuccess: () => {
      toast.success("Statut mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
    },
    onError: () => toast.error("Impossible de changer le statut."),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Mes annonces</h1>
        <ButtonLink href="/owner/properties/new">Publier une annonce</ButtonLink>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <Building2 className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Vous n&apos;avez pas encore publié d&apos;annonce.</p>
          <ButtonLink href="/owner/properties/new" size="sm">
            Publier une annonce
          </ButtonLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => {
            const image = p.images?.find((i) => i.is_principale)?.url ?? p.images?.[0]?.url;
            return (
              <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  {image ? (
                    <Image src={image} alt={p.title} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50 text-muted-foreground">
                      <Home size={40} strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="absolute left-2 top-2">
                    {p.is_verified ? (
                      <Badge variant="secondary" className="shadow-sm">Vérifiée</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-card shadow-sm">En attente</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="line-clamp-1 font-heading font-medium">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatPrix(p.prix_loyer, p.devise)} / mois · {p.ville}
                    </p>
                  </div>

                  <Select
                    value={p.status}
                    onValueChange={(status) => status && changeStatus.mutate({ id: p.id, status })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-end gap-1 border-t border-border pt-3">
                    <Link
                      href={`/listings/${p.id}`}
                      target="_blank"
                      aria-label="Voir l'annonce"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-blue-500 transition hover:bg-blue-500/10"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/owner/properties/${p.id}/edit`}
                      aria-label="Éditer l'annonce"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-amber-500 transition hover:bg-amber-500/10"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      type="button"
                      aria-label="Supprimer l'annonce"
                      onClick={() => confirm.ask(p.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-destructive transition hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirm.target !== null}
        onOpenChange={(open) => !open && confirm.close()}
        title="Supprimer cette annonce ?"
        description="Cette action est irréversible et retirera l'annonce du site."
        loading={remove.isPending}
        onConfirm={() => confirm.target && remove.mutate(confirm.target)}
      />
    </div>
  );
}
