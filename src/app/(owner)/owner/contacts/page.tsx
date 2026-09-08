"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Contact, Home, CalendarPlus } from "lucide-react";
import * as ownerVisitesApi from "@/lib/api/owner-visites";
import type { ChercheurInteresse } from "@/lib/api/owner-visites";
import { handleApiError } from "@/lib/api/apply-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/ui/loading-state";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function ProposerVisiteDialog({
  target,
  onClose,
}: {
  target: ChercheurInteresse | null;
  onClose: () => void;
}) {
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const propose = useMutation({
    mutationFn: () =>
      ownerVisitesApi.proposerVisite({
        id_property: target!.property.id,
        id_chercheur: target!.chercheur.id,
        date_souhaitee: date.replace("T", " ") + ":00",
        message: message || undefined,
      }),
    onSuccess: () => {
      toast.success("Visite proposée. Le chercheur va être notifié.");
      setDate("");
      setMessage("");
      onClose();
    },
    onError: (error) => handleApiError(error),
  });

  return (
    <Dialog open={!!target} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Proposer une visite à {target?.chercheur.nom}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Date proposée</Label>
            <Input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <div>
            <Label htmlFor="message">Message (optionnel)</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (!date) {
                toast.error("Merci d'indiquer une date.");
                return;
              }
              propose.mutate();
            }}
            disabled={propose.isPending}
          >
            {propose.isPending ? "Envoi..." : "Proposer la visite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OwnerContactsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["owner-chercheurs-interesses"],
    queryFn: ownerVisitesApi.chercheursInteresses,
  });
  const [target, setTarget] = useState<ChercheurInteresse | null>(null);
  const chercheurs = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Chercheurs intéressés</h1>
        <p className="text-sm text-muted-foreground">
          Chercheurs ayant débloqué votre contact sur l&apos;une de vos annonces.
        </p>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : chercheurs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
          <Contact className="text-muted-foreground" size={28} />
          <p className="text-sm text-muted-foreground">Aucun chercheur n&apos;a encore débloqué votre contact.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {chercheurs.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {c.property.media_principal ? (
                    <Image
                      src={c.property.media_principal.url}
                      alt={c.property.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Home size={18} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium">{c.chercheur.nom}</p>
                  <p className="text-sm text-muted-foreground">
                    {c.chercheur.phone ?? c.chercheur.email ?? "—"}
                  </p>
                  <Link href={`/listings/${c.property.id}`} className="text-xs text-primary hover:underline">
                    {c.property.title}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Débloqué le {c.debloque_le}</span>
                <Button size="sm" onClick={() => setTarget(c)} className="gap-1.5">
                  <CalendarPlus size={14} /> Proposer une visite
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProposerVisiteDialog target={target} onClose={() => setTarget(null)} />
    </div>
  );
}
