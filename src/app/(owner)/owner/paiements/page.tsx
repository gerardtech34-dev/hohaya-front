"use client";

import { useQuery } from "@tanstack/react-query";
import * as paiementsApi from "@/lib/api/paiements";
import { formatPrix } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { Wallet } from "lucide-react";

export default function OwnerPaiementsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["paiements"], queryFn: () => paiementsApi.list(1) });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Mes paiements</h1>
      {isLoading ? (
        <LoadingState />
      ) : !data || data.data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <Wallet className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Aucun paiement pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.data.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-border bg-card p-3 text-sm">
              <span className="capitalize">{p.type}</span>
              <span className="font-medium">{formatPrix(p.montant, p.devise)}</span>
              <Badge variant="secondary" className="capitalize">
                {p.status}
              </Badge>
              <span className="ml-auto text-muted-foreground">
                {new Date(p.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
