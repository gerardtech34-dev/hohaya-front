"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarX2 } from "lucide-react";
import { annulerVisite, marquerVisiteRecue, mesVisites, repondreVisite } from "@/lib/api/chercheur";
import type { Visite } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { LoadingState } from "@/components/ui/loading-state";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUS_STYLES: Record<string, string> = {
  en_attente: "border-accent/40 bg-accent/10 text-accent-foreground",
  confirmée: "border-secondary/40 bg-secondary/10 text-secondary",
  reçue: "border-primary/40 bg-primary/10 text-primary",
  refusée: "border-destructive/40 bg-destructive/10 text-destructive",
  annulée: "border-border bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  confirmée: "Confirmée",
  reçue: "Visite faite",
  refusée: "Refusée",
  annulée: "Annulée",
};

export default function VisitesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["visites"], queryFn: mesVisites });
  const visites = data?.data ?? [];
  const [toCancel, setToCancel] = useState<Visite | null>(null);

  const cancel = useMutation({
    mutationFn: annulerVisite,
    onSuccess: () => {
      toast.success("Visite annulée.");
      queryClient.invalidateQueries({ queryKey: ["visites"] });
      setToCancel(null);
    },
    onError: () => toast.error("Impossible d'annuler cette visite."),
  });

  const respond = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "confirmée" | "refusée" }) => repondreVisite(id, status),
    onSuccess: () => {
      toast.success("Réponse envoyée.");
      queryClient.invalidateQueries({ queryKey: ["visites"] });
    },
    onError: () => toast.error("Impossible d'envoyer la réponse."),
  });

  const markDone = useMutation({
    mutationFn: (id: number) => marquerVisiteRecue(id),
    onSuccess: () => {
      toast.success("Visite marquée comme effectuée !");
      queryClient.invalidateQueries({ queryKey: ["visites"] });
    },
    onError: () => toast.error("Impossible de marquer cette visite."),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Mes visites</h1>
      {isLoading ? (
        <LoadingState />
      ) : visites.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <CalendarX2 className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Aucune demande de visite pour le moment.</p>
          <ButtonLink href="/listings" size="sm">
            Parcourir les annonces
          </ButtonLink>
        </div>
      ) : (
        <div className="space-y-3">
          {visites.map((v) => (
            <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="min-w-0">
                <Link href={`/listings/${v.property?.id ?? ""}`} className="font-medium hover:text-primary">
                  {v.property?.title ?? "Annonce"}
                </Link>
                <p className="text-sm text-muted-foreground">{v.date_souhaitee ?? "Date à confirmer"}</p>
                {v.proposee_par === "proprietaire" && v.status === "en_attente" && (
                  <p className="mt-1 text-sm text-primary">Le propriétaire propose cette date.</p>
                )}
                {v.note_proprietaire && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Réponse du propriétaire : {v.note_proprietaire}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`capitalize ${STATUS_STYLES[v.status] ?? ""}`} variant="outline">
                  {STATUS_LABELS[v.status] ?? v.status}
                </Badge>
                {v.status === "en_attente" && v.proposee_par === "proprietaire" ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => respond.mutate({ id: v.id, status: "confirmée" })}
                      disabled={respond.isPending}
                    >
                      Confirmer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => respond.mutate({ id: v.id, status: "refusée" })}
                      disabled={respond.isPending}
                    >
                      Refuser
                    </Button>
                  </>
                ) : v.status === "confirmée" ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => markDone.mutate(v.id)}
                      disabled={markDone.isPending}
                    >
                      J&apos;ai visité
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setToCancel(v)}>
                      Annuler
                    </Button>
                  </>
                ) : (
                  v.status === "en_attente" && (
                    <Button size="sm" variant="outline" onClick={() => setToCancel(v)}>
                      Annuler
                    </Button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!toCancel} onOpenChange={(open) => !open && setToCancel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler cette visite ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Votre demande de visite pour « {toCancel?.property?.title ?? "cette annonce"} » sera annulée.
            Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToCancel(null)}>
              Retour
            </Button>
            <Button
              variant="destructive"
              onClick={() => toCancel && cancel.mutate(toCancel.id)}
              disabled={cancel.isPending}
            >
              {cancel.isPending ? "Annulation..." : "Confirmer l'annulation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
