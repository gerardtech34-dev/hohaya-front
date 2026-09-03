"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, CalendarClock } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import * as abonnementsApi from "@/lib/api/abonnements";
import { formatPrix } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { FedaPayButton } from "@/components/payments/FedaPayButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INCLUS = [
  "Publication illimitée d'annonces",
  "Photos et vidéos haute qualité",
  "Mise en relation directe avec les étudiants",
  "Support prioritaire",
];

const POPULAIRE = "trimestriel";

export default function OwnerAbonnementPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const tarifs = useQuery({ queryKey: ["tarifs"], queryFn: abonnementsApi.tarifs });
  const actif = useQuery({ queryKey: ["abonnement-actif"], queryFn: abonnementsApi.actif });
  const historique = useQuery({ queryKey: ["abonnement-historique"], queryFn: abonnementsApi.historique });
  const [intent, setIntent] = useState<abonnementsApi.InitierAbonnementResult | null>(null);

  const initier = useMutation({
    mutationFn: abonnementsApi.initier,
    onSuccess: (res) => setIntent(res),
    onError: () => toast.error("Impossible d'initier l'abonnement."),
  });

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["abonnement-actif"] });
    queryClient.invalidateQueries({ queryKey: ["abonnement-historique"] });
  };

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold">Abonnement</h1>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 flex items-center gap-2 font-heading font-semibold">
          <CalendarClock size={18} className="text-primary" />
          Statut actuel
        </h2>
        {actif.isLoading ? (
          <LoadingState />
        ) : actif.data ? (
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{actif.data.type_label}</Badge>
            <span className="text-sm text-muted-foreground">
              Expire le {actif.data.date_fin} ({actif.data.jours_restants} jours restants)
            </span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun abonnement actif.</p>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-heading font-semibold">Tarifs disponibles</h2>
        {tarifs.isLoading ? (
          <LoadingState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tarifs.data?.map((t) => {
              const isPopular = t.type === POPULAIRE;
              return (
                <div
                  key={t.type}
                  className={cn(
                    "relative flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm",
                    isPopular ? "border-primary ring-2 ring-primary" : "border-border"
                  )}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Le plus populaire</Badge>
                  )}
                  <h3 className="font-heading text-lg font-semibold">{t.label}</h3>
                  <p className="font-heading text-3xl font-bold text-primary">
                    {formatPrix(t.montant, t.devise)}
                  </p>
                  {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
                  <ul className="space-y-2 text-sm">
                    {INCLUS.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check size={16} className="mt-0.5 shrink-0 text-secondary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {intent?.abonnement.type === t.type ? (
                    <FedaPayButton
                      amount={intent.montant}
                      publicKey={intent.fedapay_public_key}
                      sandbox={intent.sandbox}
                      label="Payer maintenant"
                      autoOpen
                      customer={{
                        firstname: user?.name?.split(" ")[0] || undefined,
                        lastname: user?.name?.split(" ").slice(1).join(" ") || undefined,
                        email: user?.email || undefined,
                        phone: user?.phone || undefined,
                      }}
                      onSuccess={async (transactionId) => {
                        try {
                          await abonnementsApi.confirmer({
                            paiement_id: intent.paiement_id,
                            transaction_id: transactionId,
                          });
                          toast.success("Abonnement activé !");
                          setIntent(null);
                          refreshAll();
                        } catch {
                          toast.error("La confirmation a échoué.");
                        }
                      }}
                    />
                  ) : (
                    <Button
                      className="mt-auto w-full"
                      variant={isPopular ? "default" : "outline"}
                      onClick={() => initier.mutate({ type: t.type })}
                      disabled={initier.isPending}
                    >
                      {initier.isPending ? "Chargement..." : "Souscrire"}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-heading font-semibold">Historique</h2>
        {historique.data && historique.data.data.length > 0 ? (
          <div className="space-y-2">
            {historique.data.data.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card p-3 text-sm">
                <span>{a.type_label}</span>
                <span className="text-muted-foreground">{formatPrix(a.montant, a.devise)}</span>
                <Badge variant="secondary" className="capitalize">
                  {a.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun historique.</p>
        )}
      </div>
    </div>
  );
}
