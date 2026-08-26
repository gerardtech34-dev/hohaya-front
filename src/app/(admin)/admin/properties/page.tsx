"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as adminApi from "@/lib/api/admin";
import * as propertiesApi from "@/lib/api/properties";
import { formatPrix } from "@/lib/format";
import { LoadingState } from "@/components/ui/loading-state";
import { ButtonLink } from "@/components/ui/button-link";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

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
      <h1 className="font-heading text-2xl font-bold">Annonces en attente de vérification</h1>
      {isLoading ? (
        <LoadingState />
      ) : !data || data.data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <Building2 className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Aucune annonce en attente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.data.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
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
