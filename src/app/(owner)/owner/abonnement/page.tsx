"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as abonnementsApi from "@/lib/api/abonnements";
import { formatPrix } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { KKiaPayButton } from "@/components/payments/KKiaPayButton";
import { Button } from "@/components/ui/button";

export default function OwnerAbonnementPage() {
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
      <h1 className="text-2xl font-semibold">Abonnement</h1>

      <Card>
        <CardHeader>
          <CardTitle>Statut actuel</CardTitle>
        </CardHeader>
        <CardContent>
          {actif.isLoading ? (
            <Skeleton className="h-6 w-32" />
          ) : actif.data ? (
            <div className="flex items-center gap-3">
              <Badge>{actif.data.type_label}</Badge>
              <span className="text-sm text-muted-foreground">
                Expire le {actif.data.date_fin} ({actif.data.jours_restants} jours restants)
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun abonnement actif.</p>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 font-medium">Tarifs disponibles</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {tarifs.data?.map((t) => (
            <Card key={t.type}>
              <CardHeader>
                <CardTitle>{t.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-2xl font-bold">{formatPrix(t.montant, t.devise)}</p>
                {intent?.abonnement.type === t.type ? (
                  <KKiaPayButton
                    amount={intent.montant}
                    publicKey={intent.kkiapay_public_key}
                    sandbox={intent.sandbox}
                    label="Payer maintenant"
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
                  <Button className="w-full" onClick={() => initier.mutate({ type: t.type })} disabled={initier.isPending}>
                    Souscrire
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-medium">Historique</h2>
        {historique.data && historique.data.data.length > 0 ? (
          <div className="space-y-2">
            {historique.data.data.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-sm">
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
