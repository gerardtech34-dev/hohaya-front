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
import { LoadingState } from "@/components/ui/loading-state";
import { Badge } from "@/components/ui/badge";
import { KeyRound } from "lucide-react";

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
    onError: () => toast.error("Impossible de mettre à jour le statut."),
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

      <div className="space-y-1.5">
        <Label htmlFor={`montant-${tarif.type}`}>Montant (FCFA)</Label>
        <Input
          id={`montant-${tarif.type}`}
          type="number"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Actuel : {formatPrix(tarif.montant, tarif.devise)}</p>
      </div>

      <div className="space-y-1.5">
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

function DeblocagePrixEditor() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: adminApi.settings });
  const [montant, setMontant] = useState("");

  const save = useMutation({
    mutationFn: () => adminApi.updateDeblocagePrix(Number(montant)),
    onSuccess: (res) => {
      toast.success("Prix mis à jour.");
      setMontant(String(res.deblocage_contact_prix));
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: () => toast.error("Impossible de mettre à jour ce prix."),
  });

  const current = data?.deblocage_contact_prix ?? 0;

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <div>
        <h2 className="flex items-center gap-2 font-heading font-semibold">
          <KeyRound size={17} className="text-primary" />
          Déblocage de contact
        </h2>
        <p className="text-xs text-muted-foreground">
          Prix payé par un chercheur pour obtenir les coordonnées d&apos;un propriétaire.
        </p>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="deblocage-prix">Montant (FCFA)</Label>
          <Input
            id="deblocage-prix"
            type="number"
            value={montant || String(current)}
            onChange={(e) => setMontant(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Actuel : {formatPrix(current)}</p>
        </div>
      )}

      <Button onClick={() => save.mutate()} disabled={save.isPending || isLoading}>
        {save.isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
}

function DeblocagePartHohayaEditor() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: adminApi.settings });
  const [pourcentage, setPourcentage] = useState("");

  const save = useMutation({
    mutationFn: () => adminApi.updateDeblocagePartHohaya(Number(pourcentage)),
    onSuccess: (res) => {
      toast.success("Répartition mise à jour.");
      setPourcentage(String(res.deblocage_part_hohaya_pourcentage));
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: () => toast.error("Impossible de mettre à jour la répartition."),
  });

  const current = data?.deblocage_part_hohaya_pourcentage ?? 50;

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <div>
        <h2 className="flex items-center gap-2 font-heading font-semibold">
          <KeyRound size={17} className="text-primary" />
          Répartition du paiement de déblocage
        </h2>
        <p className="text-xs text-muted-foreground">
          Part (%) du montant de déblocage de contact qui revient à Hohaya — le reste revient au propriétaire.
        </p>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="deblocage-part-hohaya">Part Hohaya (%)</Label>
          <Input
            id="deblocage-part-hohaya"
            type="number"
            min={0}
            max={100}
            value={pourcentage || String(current)}
            onChange={(e) => setPourcentage(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Actuel : {current}% Hohaya / {100 - current}% propriétaire
          </p>
        </div>
      )}

      <Button onClick={() => save.mutate()} disabled={save.isPending || isLoading}>
        {save.isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
}

function EssaisGratuitsEditor() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: adminApi.settings });
  const [nombre, setNombre] = useState("");

  const save = useMutation({
    mutationFn: () => adminApi.updateDeblocageEssaisGratuits(Number(nombre)),
    onSuccess: (res) => {
      toast.success("Nombre d'essais gratuits mis à jour.");
      setNombre(String(res.deblocage_essais_gratuits));
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: () => toast.error("Impossible de mettre à jour ce réglage."),
  });

  const current = data?.deblocage_essais_gratuits ?? 3;

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <div>
        <h2 className="flex items-center gap-2 font-heading font-semibold">
          <KeyRound size={17} className="text-primary" />
          Déblocages gratuits par chercheur
        </h2>
        <p className="text-xs text-muted-foreground">
          Nombre de déblocages de contact gratuits (sans paiement) accordés à chaque chercheur avant
          que le paiement ne soit exigé.
        </p>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="essais-gratuits">Nombre d&apos;essais gratuits</Label>
          <Input
            id="essais-gratuits"
            type="number"
            min={0}
            value={nombre || String(current)}
            onChange={(e) => setNombre(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Actuel : {current}</p>
        </div>
      )}

      <Button onClick={() => save.mutate()} disabled={save.isPending || isLoading}>
        {save.isPending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
}

function AbonnementRequisEditor() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-settings"], queryFn: adminApi.settings });

  const toggle = useMutation({
    mutationFn: (requis: boolean) => adminApi.updateAbonnementRequis(requis),
    onSuccess: () => {
      toast.success("Réglage mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: () => toast.error("Impossible de mettre à jour ce réglage."),
  });

  const requis = data?.abonnement_requis ?? true;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:col-span-2">
      <div>
        <h2 className="font-heading font-semibold">Abonnement obligatoire pour publier</h2>
        <p className="text-xs text-muted-foreground">
          Si désactivé, les propriétaires peuvent publier des annonces sans avoir souscrit à un
          abonnement, quel qu&apos;il soit (y compris le plan Gratuit).
        </p>
      </div>
      {isLoading ? (
        <LoadingState />
      ) : (
        <Switch checked={requis} onCheckedChange={(checked) => toggle.mutate(checked === true)} disabled={toggle.isPending} />
      )}
    </div>
  );
}

export default function AdminTarifsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-tarifs"], queryFn: adminApi.tarifsAdmin });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Tarifs</h1>
        <p className="text-sm text-muted-foreground">
          Ajustez les montants proposés aux propriétaires et aux chercheurs. Les changements sont
          visibles immédiatement sur le site.
        </p>
      </div>

      <div>
        <h2 className="mb-3 font-heading font-semibold">Abonnements propriétaires</h2>
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AbonnementRequisEditor />
            {data?.map((t) => (
              <TarifEditor key={t.type} tarif={t} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-heading font-semibold">Contacts chercheurs</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DeblocagePrixEditor />
          <DeblocagePartHohayaEditor />
          <EssaisGratuitsEditor />
        </div>
      </div>
    </div>
  );
}
