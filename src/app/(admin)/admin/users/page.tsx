"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as adminApi from "@/lib/api/admin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search],
    queryFn: () => adminApi.users({ search }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-users"] });

  const verify = useMutation({
    mutationFn: ({ id, isVerified }: { id: number; isVerified: boolean }) =>
      adminApi.verifierProprietaire(id, isVerified),
    onSuccess: () => {
      toast.success("Statut de vérification mis à jour.");
      invalidate();
    },
  });

  const suspend = useMutation({
    mutationFn: ({ id, suspendre }: { id: number; suspendre: boolean }) =>
      adminApi.toggleSuspension(id, suspendre),
    onSuccess: () => {
      toast.success("Statut mis à jour.");
      invalidate();
    },
  });

  const exportUsers = async () => {
    try {
      await adminApi.exportUsers();
    } catch {
      toast.error("Export impossible.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Utilisateurs</h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <Button variant="outline" onClick={exportUsers}>
            Exporter CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email ?? u.phone}</TableCell>
                  <TableCell className="capitalize">{u.roles?.[0] ?? "—"}</TableCell>
                  <TableCell>
                    {u.is_verified ? (
                      <Badge variant="secondary">Vérifié</Badge>
                    ) : (
                      <Badge variant="outline">Non vérifié</Badge>
                    )}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2 text-right">
                    {u.roles?.[0] === "owner" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => verify.mutate({ id: u.id, isVerified: !u.is_verified })}
                      >
                        {u.is_verified ? "Retirer vérif." : "Vérifier"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => suspend.mutate({ id: u.id, suspendre: true })}
                    >
                      Suspendre
                    </Button>
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
