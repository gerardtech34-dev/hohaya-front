"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as adminApi from "@/lib/api/admin";
import * as propertiesApi from "@/lib/api/properties";
import { formatPrix } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { ButtonLink } from "@/components/ui/button-link";
import { Button } from "@/components/ui/button";

export default function AdminPropertiesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-properties-pending"],
    queryFn: adminApi.annoncesEnAttente,
  });

  const verify = useMutation({
    mutationFn: (id: number) => propertiesApi.verify(id, true),
    onSuccess: () => {
      toast.success("Annonce validée.");
      queryClient.invalidateQueries({ queryKey: ["admin-properties-pending"] });
    },
    onError: () => toast.error("Impossible de valider cette annonce."),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Annonces en attente de vérification</h1>
      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : !data || data.data.length === 0 ? (
        <p className="text-muted-foreground">Aucune annonce en attente.</p>
      ) : (
        <div className="space-y-3">
          {data.data.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
              <div className="min-w-0">
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrix(p.prix_loyer, p.devise)} / mois · {p.ville}
                </p>
              </div>
              <div className="flex gap-2">
                <ButtonLink href={`/listings/${p.id}`} variant="outline" size="sm">
                  Voir l&apos;annonce
                </ButtonLink>
                <Button size="sm" onClick={() => verify.mutate(p.id)} disabled={verify.isPending}>
                  Valider
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
