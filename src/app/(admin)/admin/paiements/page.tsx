"use client";

import { useQuery } from "@tanstack/react-query";
import * as adminApi from "@/lib/api/admin";
import { formatPrix } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet } from "lucide-react";
import { toast } from "sonner";

const STATUS_STYLES: Record<string, string> = {
  en_attente: "border-accent/40 bg-accent/10 text-accent-foreground",
  "succès": "border-secondary/40 bg-secondary/10 text-secondary",
  "échoué": "border-destructive/40 bg-destructive/10 text-destructive",
  "remboursé": "border-border bg-muted text-muted-foreground",
};

export default function AdminPaiementsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-paiements"], queryFn: () => adminApi.paiements(1) });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Paiements</h1>
        <Button
          variant="outline"
          onClick={() => adminApi.exportPaiements().catch(() => toast.error("Export impossible."))}
        >
          Exporter en CSV
        </Button>
      </div>
      {isLoading ? (
        <LoadingState />
      ) : !data || data.data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <Wallet className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Aucun paiement pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {p.user?.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <span className="font-medium">{p.user?.name ?? "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{p.type}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatPrix(p.montant, p.devise)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`capitalize ${STATUS_STYLES[p.status] ?? ""}`} variant="outline">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {new Date(p.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
