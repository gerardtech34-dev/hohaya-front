"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as propertiesApi from "@/lib/api/properties";
import { formatPrix } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

  const remove = useMutation({
    mutationFn: propertiesApi.remove,
    onSuccess: () => {
      toast.success("Annonce supprimée.");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
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
        <h1 className="text-2xl font-semibold">Mes annonces</h1>
        <ButtonLink href="/owner/properties/new">Publier une annonce</ButtonLink>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : properties.length === 0 ? (
        <p className="text-muted-foreground">Vous n&apos;avez pas encore publié d&apos;annonce.</p>
      ) : (
        <div className="space-y-3">
          {properties.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrix(p.prix_loyer, p.devise)} / mois · {p.ville}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {p.is_verified ? (
                  <Badge variant="secondary">Vérifiée</Badge>
                ) : (
                  <Badge variant="outline">En attente de vérification</Badge>
                )}
                <Select
                  value={p.status}
                  onValueChange={(status) => status && changeStatus.mutate({ id: p.id, status })}
                >
                  <SelectTrigger className="w-36">
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
                <ButtonLink variant="outline" size="sm" href={`/owner/properties/${p.id}/edit`}>
                  Éditer
                </ButtonLink>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => remove.mutate(p.id)}
                  disabled={remove.isPending}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
