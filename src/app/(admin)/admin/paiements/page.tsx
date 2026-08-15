"use client";

import { useQuery } from "@tanstack/react-query";
import * as adminApi from "@/lib/api/admin";
import { formatPrix } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminPaiementsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-paiements"], queryFn: () => adminApi.paiements(1) });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Paiements</h1>
        <Button
          variant="outline"
          onClick={() =>
            adminApi.exportPaiements().catch(() => {
              /* toast handled by caller if needed */
            })
          }
        >
          Exporter en CSV
        </Button>
      </div>
      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.user?.name ?? "—"}</TableCell>
                  <TableCell className="capitalize">{p.type}</TableCell>
                  <TableCell>{formatPrix(p.montant, p.devise)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(p.created_at).toLocaleDateString("fr-FR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
