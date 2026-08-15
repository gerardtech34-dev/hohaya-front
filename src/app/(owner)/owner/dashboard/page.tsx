"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import * as propertiesApi from "@/lib/api/properties";
import * as abonnementsApi from "@/lib/api/abonnements";
import * as ownerVisitesApi from "@/lib/api/owner-visites";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function OwnerDashboardPage() {
  const properties = useQuery({ queryKey: ["my-properties"], queryFn: () => propertiesApi.myProperties() });
  const abonnement = useQuery({ queryKey: ["abonnement-actif"], queryFn: abonnementsApi.actif });
  const visites = useQuery({ queryKey: ["visites-recues"], queryFn: ownerVisitesApi.visitesRecues });

  const actives = properties.data?.data.filter((p) => p.status === "disponible").length ?? 0;
  const enAttente = visites.data?.data.filter((v) => v.status === "en_attente").length ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Vue d&apos;ensemble</h1>

      {!abonnement.isLoading && !abonnement.data && (
        <Alert>
          <AlertTitle>Aucun abonnement actif</AlertTitle>
          <AlertDescription>
            Souscrivez à un abonnement pour publier vos annonces.{" "}
            <Link href="/owner/abonnement" className="underline">
              Voir les tarifs
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Annonces actives</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{actives}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Visites en attente</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{enAttente}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Abonnement</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-medium capitalize">
            {abonnement.data ? abonnement.data.type : "Inactif"}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
