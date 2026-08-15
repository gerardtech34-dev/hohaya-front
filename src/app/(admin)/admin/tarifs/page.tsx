"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as adminApi from "@/lib/api/admin";
import type { AdminTarifAbonnement } from "@/lib/types";
import { formatPrix } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const LABELS: Record<string, string> = {
  mensuel: "1 mois",
  trimestriel: "3 mois",
  semestriel: "6 mois",
  annuel: "1 an",
};

function TarifEditor({ tarif }: { tarif: AdminTarifAbonnement }) {
  const queryClient = useQueryClient();
  const [montant, setMontant] = useState(String(tarif.montant));
  const [description, setDescription] = useState(tarif.description ?? "");

  const save = useMutation({
    mutationFn: () =>
      adminApi.updateTarif(tarif.type, { montant: Number(montant), description }),
    onSuccess: () => {
      toast.success("Tarif mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["admin-tarifs"] });
    },
    onError: () => toast.error("Impossible de mettre à jour ce tarif."),
  });

  const toggleActif = useMutation({
    mutationFn: (is_actif: boolean) => adminApi.updateTarif(tarif.type, { is_actif }),
    onSuccess: () => {
      toast.success("Statut mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["admin-tarifs"] });
    },
  });

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-semibold capitalize">{tarif.type}</h2>
          <p className="text-xs text-muted-foreground">{LABELS[tarif.type] ?? tarif.type}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={tarif.is_actif ? "secondary" : "outline"}>
            {tarif.is_actif ? "Actif" : "Inactif"}
          </Badge>
          <Switch
            checked={tarif.is_actif}
            onCheckedChange={(checked) => toggleActif.mutate(checked === true)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`montant-${tarif.type}`}>Montant (XOF)</Label>
          <Input
            id={`montant-${tarif.type}`}
            type="number"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
          />
        </div>
        <div className="flex items-end pb-2 text-sm text-muted-foreground">
          Actuel : {formatPrix(tarif.montant, tarif.devise)}
        </div>
      </div>

      <div>
        <Label htmlFor={`description-${tarif.type}`}>Description</Label>
        <Textarea
          id={`description-${tarif.type}`}
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <Button onClick={() => save.mutate()} disabled={save.isPending}>
        {save.isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
}

export default function AdminTarifsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-tarifs"], queryFn: adminApi.tarifsAdmin });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tarifs d&apos;abonnement</h1>
        <p className="text-sm text-muted-foreground">
          Ajustez les montants proposés aux propriétaires. Les changements sont visibles
          immédiatement sur la page publique Tarifs (si le tarif est actif).
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data?.map((t) => (
            <TarifEditor key={t.type} tarif={t} />
          ))}
        </div>
      )}
    </div>
  );
}
