"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as adminApi from "@/lib/api/admin";
import * as supportApi from "@/lib/api/support";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSupportPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-support"], queryFn: adminApi.supportTickets });
  const [messages, setMessages] = useState<Record<number, string>>({});

  const respond = useMutation({
    mutationFn: ({ id, message }: { id: number; message: string }) => supportApi.respondTicket(id, message),
    onSuccess: () => {
      toast.success("Réponse envoyée.");
      queryClient.invalidateQueries({ queryKey: ["admin-support"] });
    },
    onError: () => toast.error("Impossible d'envoyer la réponse."),
  });

  const close = useMutation({
    mutationFn: (id: number) => supportApi.closeTicket(id),
    onSuccess: () => {
      toast.success("Ticket fermé.");
      queryClient.invalidateQueries({ queryKey: ["admin-support"] });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Support</h1>
      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : !data || data.data.length === 0 ? (
        <p className="text-muted-foreground">Aucun ticket.</p>
      ) : (
        <div className="space-y-3">
          {data.data.map((t) => (
            <div key={t.id} className="space-y-2 rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">{t.sujet}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.utilisateur?.name} · {t.categorie}
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {t.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{t.message}</p>
              {t.reponse_admin && (
                <p className="text-sm">
                  <span className="font-medium">Réponse :</span> {t.reponse_admin}
                </p>
              )}
              {t.status !== "fermé" && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Répondre..."
                    value={messages[t.id] ?? ""}
                    onChange={(e) => setMessages((m) => ({ ...m, [t.id]: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => respond.mutate({ id: t.id, message: messages[t.id] ?? "" })}
                      disabled={!messages[t.id]}
                    >
                      Répondre
                    </Button>
                    <Button variant="outline" onClick={() => close.mutate(t.id)}>
                      Fermer
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
