"use client";

import { useQuery } from "@tanstack/react-query";
import * as adminApi from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const dashboard = useQuery({ queryKey: ["admin-dashboard"], queryFn: adminApi.dashboard });
  const revenus = useQuery({ queryKey: ["admin-revenus"], queryFn: adminApi.revenusMensuels });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {dashboard.isLoading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.entries(dashboard.data ?? {}).map(([key, value]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-sm capitalize text-muted-foreground">
                  {key.replace(/_/g, " ")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{value}</CardContent>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h2 className="mb-3 font-medium">Revenus mensuels</h2>
        {revenus.isLoading ? (
          <Skeleton className="h-40 w-full rounded-xl" />
        ) : !revenus.data || revenus.data.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune donnée disponible.</p>
        ) : (
          <div className="space-y-2 rounded-xl border p-4">
            {revenus.data.map((r) => (
              <div key={r.mois} className="flex items-center justify-between text-sm">
                <span>{r.mois}</span>
                <div className="flex flex-1 items-center gap-2 px-4">
                  <div
                    className="h-2 rounded bg-primary"
                    style={{
                      width: `${Math.min(100, (r.total / Math.max(...revenus.data.map((d) => d.total), 1)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="font-medium">{r.total.toLocaleString("fr-FR")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
