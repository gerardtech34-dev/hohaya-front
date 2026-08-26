"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as supportApi from "@/lib/api/support";
import { handleApiError } from "@/lib/api/apply-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { Headset } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CATEGORIES = ["technique", "facturation", "logement", "fraude", "general"];

export function SupportTickets() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["support-tickets"], queryFn: supportApi.listTickets });
  const tickets = data?.data ?? [];
  const [open, setOpen] = useState(false);
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [categorie, setCategorie] = useState("general");

  const create = useMutation({
    mutationFn: supportApi.createTicket,
    onSuccess: () => {
      toast.success("Ticket créé.");
      setOpen(false);
      setSujet("");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
    onError: (error) => handleApiError(error),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Support</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button>Nouveau ticket</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau ticket de support</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Sujet" value={sujet} onChange={(e) => setSujet(e.target.value)} />
              <Select value={categorie} onValueChange={(v) => setCategorie(v ?? "general")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Décrivez votre problème"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={() => create.mutate({ sujet, message, categorie })}
                disabled={!sujet || !message || create.isPending}
              >
                {create.isPending ? "Envoi..." : "Envoyer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <Headset className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Aucun ticket pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{t.sujet}</p>
                <Badge variant={t.status === "fermé" ? "secondary" : "default"} className="capitalize">
                  {t.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t.message}</p>
              {t.reponse_admin && (
                <div className="mt-3 space-y-1 border-t pt-3">
                  <p className="text-sm">
                    <span className="font-medium">Support :</span> {t.reponse_admin}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
