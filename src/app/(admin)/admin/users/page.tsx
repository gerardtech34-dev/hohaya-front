"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as adminApi from "@/lib/api/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, ShieldCheck, ShieldOff, Trash2, RotateCcw, Search } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  seeker: "Chercheur",
  owner: "Propriétaire",
  admin: "Administrateur",
};

function roleLabel(role?: string) {
  if (!role) return "—";
  return ROLE_LABELS[role] ?? role;
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: () => adminApi.users({ search }),
  });
  const confirm = useConfirmDialog();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  const verify = useMutation({
    mutationFn: ({ id, isVerified }: { id: number; isVerified: boolean }) =>
      adminApi.verifierProprietaire(id, isVerified),
    onSuccess: () => {
      toast.success("Statut de vérification mis à jour.");
      invalidate();
    },
    onError: () => toast.error("Impossible de mettre à jour la vérification."),
  });

  const suspend = useMutation({
    mutationFn: ({ id, suspendre }: { id: number; suspendre: boolean }) =>
      adminApi.toggleSuspension(id, suspendre),
    onSuccess: () => {
      toast.success("Statut mis à jour.");
      invalidate();
      confirm.close();
    },
    onError: () => toast.error("Impossible de mettre à jour le statut."),
  });

  const exportUsers = async () => {
    try {
      await adminApi.exportUsers();
    } catch {
      toast.error("Export impossible.");
    }
  };

  const targetUser = data?.data.find((u) => u.id === confirm.target);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold">Utilisateurs</h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 sm:w-64"
            />
          </div>
          <Button variant="outline" onClick={exportUsers}>
            Exporter CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : !data || data.data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <Users className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Aucun utilisateur trouvé.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email ?? u.phone}</TableCell>
                  <TableCell>{roleLabel(u.roles?.[0])}</TableCell>
                  <TableCell>
                    {u.deleted_at ? (
                      <Badge variant="destructive">Suspendu</Badge>
                    ) : u.is_verified ? (
                      <Badge variant="secondary">Vérifié</Badge>
                    ) : (
                      <Badge variant="outline">Non vérifié</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {u.roles?.[0] === "owner" && !u.deleted_at && (
                        <button
                          type="button"
                          aria-label={u.is_verified ? "Retirer la vérification" : "Vérifier"}
                          title={u.is_verified ? "Retirer la vérification" : "Vérifier"}
                          onClick={() => verify.mutate({ id: u.id, isVerified: !u.is_verified })}
                          disabled={verify.isPending}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-sky-500 transition hover:bg-sky-500/10 disabled:opacity-50"
                        >
                          {u.is_verified ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                        </button>
                      )}
                      {u.deleted_at ? (
                        <button
                          type="button"
                          aria-label="Réactiver"
                          title="Réactiver"
                          onClick={() => suspend.mutate({ id: u.id, suspendre: false })}
                          disabled={suspend.isPending}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-500 transition hover:bg-emerald-500/10 disabled:opacity-50"
                        >
                          <RotateCcw size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          aria-label="Suspendre"
                          title="Suspendre"
                          onClick={() => confirm.ask(u.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-destructive transition hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={confirm.target !== null}
        onOpenChange={(open) => !open && confirm.close()}
        title="Suspendre ce compte ?"
        description={`${targetUser?.name ?? "Cet utilisateur"} ne pourra plus se connecter jusqu'à réactivation.`}
        confirmLabel="Suspendre"
        loading={suspend.isPending}
        onConfirm={() => confirm.target && suspend.mutate({ id: confirm.target, suspendre: true })}
      />
    </div>
  );
}
