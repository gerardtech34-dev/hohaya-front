"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as ownerVisitesApi from "@/lib/api/owner-visites";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { Textarea } from "@/components/ui/textarea";
import { CalendarX2 } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  en_attente: "border-accent/40 bg-accent/10 text-accent-foreground",
  confirmée: "border-secondary/40 bg-secondary/10 text-secondary",
  refusée: "border-destructive/40 bg-destructive/10 text-destructive",
  annulée: "border-border bg-muted text-muted-foreground",
};

export default function OwnerVisitesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["visites-recues"], queryFn: ownerVisitesApi.visitesRecues });
  const visites = data?.data ?? [];
  const [notes, setNotes] = useState<Record<number, string>>({});

  const repondre = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "confirmée" | "refusée" }) =>
      ownerVisitesApi.repondreVisite(id, { status, note_proprietaire: notes[id] }),
    onSuccess: () => {
      toast.success("Réponse envoyée.");
      queryClient.invalidateQueries({ queryKey: ["visites-recues"] });
    },
    onError: () => toast.error("Impossible d'envoyer la réponse."),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Visites reçues</h1>
      {isLoading ? (
        <LoadingState />
      ) : visites.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <CalendarX2 className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Aucune demande de visite pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visites.map((v) => (
            <div key={v.id} className="space-y-2 rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">{v.property?.title ?? "Annonce"}</p>
                  <p className="text-xs text-muted-foreground">
                    {v.chercheur?.name} {v.chercheur?.phone ? `· ${v.chercheur.phone}` : ""}
                  </p>
                </div>
                <Badge className={`capitalize ${STATUS_STYLES[v.status] ?? ""}`} variant="outline">
                  {v.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {v.proposee_par === "proprietaire" ? "Date proposée par vous" : "Souhaitée"} le {v.date_souhaitee}
              </p>
              {v.message && <p className="text-sm text-muted-foreground">&ldquo;{v.message}&rdquo;</p>}
              {v.status === "en_attente" && v.proposee_par === "chercheur" && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Note (horaire proposé, message...)"
                    value={notes[v.id] ?? ""}
                    onChange={(e) => setNotes((r) => ({ ...r, [v.id]: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => repondre.mutate({ id: v.id, status: "confirmée" })}>
                      Accepter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => repondre.mutate({ id: v.id, status: "refusée" })}
                    >
                      Refuser
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
