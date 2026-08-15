"use client";

import { useQuery } from "@tanstack/react-query";
import * as paiementsApi from "@/lib/api/paiements";
import { formatPrix } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function OwnerPaiementsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["paiements"], queryFn: () => paiementsApi.list(1) });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mes paiements</h1>
      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : !data || data.data.length === 0 ? (
        <p className="text-muted-foreground">Aucun paiement pour le moment.</p>
      ) : (
        <div className="space-y-2">
          {data.data.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border p-3 text-sm">
              <span className="capitalize">{p.type}</span>
              <span>{formatPrix(p.montant, p.devise)}</span>
              <Badge variant="secondary" className="capitalize">
                {p.status}
              </Badge>
              <span className="text-muted-foreground">{new Date(p.created_at).toLocaleDateString("fr-FR")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
