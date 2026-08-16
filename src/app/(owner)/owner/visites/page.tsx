"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as ownerVisitesApi from "@/lib/api/owner-visites";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

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
      <h1 className="text-2xl font-semibold">Visites reçues</h1>
      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : visites.length === 0 ? (
        <p className="text-muted-foreground">Aucune demande de visite pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {visites.map((v) => (
            <div key={v.id} className="space-y-2 rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">{v.property?.title ?? "Annonce"}</p>
                  <p className="text-xs text-muted-foreground">
                    {v.chercheur?.name} {v.chercheur?.phone ? `· ${v.chercheur.phone}` : ""}
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {v.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Souhaitée le {v.date_souhaitee}</p>
              {v.message && <p className="text-sm text-muted-foreground">&ldquo;{v.message}&rdquo;</p>}
              {v.status === "en_attente" && (
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
