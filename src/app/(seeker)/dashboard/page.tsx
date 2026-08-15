"use client";

import { useQuery } from "@tanstack/react-query";
import { mesFavoris, mesVisites } from "@/lib/api/chercheur";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SeekerDashboardPage() {
  const favoris = useQuery({ queryKey: ["favoris"], queryFn: mesFavoris });
  const visites = useQuery({ queryKey: ["visites"], queryFn: mesVisites });

  const visitesAVenir =
    visites.data?.data.filter((v) => v.status === "confirmée" || v.status === "en_attente").length ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Bonjour 👋</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Favoris</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{favoris.data?.total ?? "—"}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Visites à venir</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{visitesAVenir}</CardContent>
        </Card>
      </div>
    </div>
  );
}
