"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as adminApi from "@/lib/api/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { Flag } from "lucide-react";

export default function AdminSignalementsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-signalements"], queryFn: adminApi.signalements });

  const treat = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => adminApi.treatSignalement(id, status),
    onSuccess: () => {
      toast.success("Signalement traité.");
      queryClient.invalidateQueries({ queryKey: ["admin-signalements"] });
    },
    onError: () => toast.error("Impossible de traiter ce signalement."),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Signalements</h1>
      {isLoading ? (
        <LoadingState />
      ) : !data || data.data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <Flag className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Aucun signalement.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.data.map((s) => (
            <div key={s.id} className="space-y-2 rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium capitalize">{s.motif}</p>
                  <p className="text-xs text-muted-foreground capitalize">{s.type_signalement}</p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {s.status}
                </Badge>
              </div>
              {s.description && <p className="text-sm text-muted-foreground">{s.description}</p>}
              {s.property && <p className="text-xs text-muted-foreground">Annonce : {s.property.title}</p>}
              {!["traité", "rejeté"].includes(s.status) && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => treat.mutate({ id: s.id, status: "traité" })}>
                    Marquer comme traité
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => treat.mutate({ id: s.id, status: "rejeté" })}>
                    Rejeter
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
