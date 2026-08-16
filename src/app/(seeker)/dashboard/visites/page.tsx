"use client";

import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { annulerVisite, mesVisites } from "@/lib/api/chercheur";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function VisitesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["visites"], queryFn: mesVisites });
  const visites = data?.data ?? [];

  const cancel = useMutation({
    mutationFn: annulerVisite,
    onSuccess: () => {
      toast.success("Visite annulée.");
      queryClient.invalidateQueries({ queryKey: ["visites"] });
    },
    onError: () => toast.error("Impossible d'annuler cette visite."),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mes visites</h1>
      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : visites.length === 0 ? (
        <p className="text-muted-foreground">Aucune demande de visite pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {visites.map((v) => (
            <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
              <div className="min-w-0">
                <p className="font-medium">{v.property?.title ?? "Annonce"}</p>
                <p className="text-sm text-muted-foreground">
                  {v.date_souhaitee ?? "Date à confirmer"}
                </p>
                {v.note_proprietaire && (
                  <p className="text-sm text-muted-foreground">Réponse : {v.note_proprietaire}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {v.status}
                </Badge>
                {v.status === "en_attente" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => cancel.mutate(v.id)}
                    disabled={cancel.isPending}
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
