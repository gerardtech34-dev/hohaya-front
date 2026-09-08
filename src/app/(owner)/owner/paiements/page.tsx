"use client";

import { useQuery } from "@tanstack/react-query";
import * as paiementsApi from "@/lib/api/paiements";
import * as ownerRevenusApi from "@/lib/api/owner-revenus";
import { formatPrix } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ButtonLink } from "@/components/ui/button-link";
import { Wallet, Coins } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  succès: "Réussi",
  échoué: "Échoué",
};

const STATUS_VARIANTS: Record<string, "secondary" | "outline" | "destructive"> = {
  en_attente: "outline",
  succès: "secondary",
  échoué: "destructive",
};

function MesGains() {
  const { data, isLoading } = useQuery({
    queryKey: ["owner-revenus-contacts"],
    queryFn: ownerRevenusApi.revenusContacts,
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-2">
          <Coins size={18} className="text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total gagné sur les déblocages de contact</p>
            <p className="font-heading text-xl font-bold">
              {isLoading ? "…" : formatPrix(data?.total_gagne ?? 0)}
            </p>
          </div>
        </div>
      </div>

      {!isLoading && data && data.paiements.data.length > 0 && (
        <div className="space-y-2">
          {data.paiements.data.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl border border-border bg-card p-3 text-sm">
              <span className="min-w-0 truncate">{p.property?.title ?? "Annonce"}</span>
              <span className="font-medium text-primary">+{formatPrix(p.part_proprietaire ?? 0, p.devise)}</span>
              <span className="text-xs text-muted-foreground">(sur {formatPrix(p.montant, p.devise)} total)</span>
              <span className="ml-auto text-muted-foreground">
                {p.paye_le ? p.paye_le : new Date(p.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OwnerPaiementsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["paiements"], queryFn: () => paiementsApi.list(1) });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-3 font-heading text-2xl font-bold">Mes gains</h1>
        <MesGains />
      </div>

      <div>
        <h2 className="mb-3 font-heading text-xl font-bold">Mes paiements (abonnements)</h2>
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
              <div key={p.id} className="rounded-2xl border border-border bg-card p-3 text-sm">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="capitalize">{p.type}</span>
                  <span className="font-medium">{formatPrix(p.montant, p.devise)}</span>
                  <Badge variant={STATUS_VARIANTS[p.status] ?? "secondary"}>
                    {STATUS_LABELS[p.status] ?? p.status}
                  </Badge>
                  <span className="text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("fr-FR")}
                  </span>
                  {p.status === "échoué" && (
                    <ButtonLink href="/owner/abonnement" size="sm" variant="outline" className="ml-auto">
                      Réessayer
                    </ButtonLink>
                  )}
                </div>
                {p.status === "succès" && p.fedapay_transaction_id && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Reçu envoyé par FedaPay à votre email · Transaction #{p.fedapay_transaction_id}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
