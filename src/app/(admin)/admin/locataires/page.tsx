"use client";

import { useQuery } from "@tanstack/react-query";
import * as locatairesApi from "@/lib/api/locataires";
import { formatPrix } from "@/lib/format";
import { LoadingState } from "@/components/ui/loading-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users2 } from "lucide-react";

export default function AdminLocatairesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-locataires"], queryFn: locatairesApi.tousLesLocataires });
  const locataires = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Locataires</h1>
        <p className="text-sm text-muted-foreground">
          Tous les chercheurs ayant réservé et payé l&apos;avance d&apos;un logement sur la plateforme.
        </p>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : locataires.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <Users2 className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Aucun locataire pour le moment.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Locataire</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Logement</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead className="text-right">Avance payée</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locataires.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {l.locataire.nom?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium">{l.locataire.nom}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {l.locataire.email ?? l.locataire.phone ?? "—"}
                  </TableCell>
                  <TableCell>{l.property?.title ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{l.proprietaire?.nom ?? "—"}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatPrix(l.montant, l.devise)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {l.paye_le ?? "—"}
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
