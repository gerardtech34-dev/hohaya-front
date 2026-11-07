"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as mediaApi from "@/lib/api/property-media";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { Trash2, Image as ImageIcon, Play } from "lucide-react";
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
} from "@/components/ui/dialog";

const ZONES = [
  { value: "salon", label: "Salon" },
  { value: "cuisine", label: "Cuisine" },
  { value: "chambre_principale", label: "Chambre principale" },
  { value: "chambre_2", label: "Chambre 2" },
  { value: "salle_de_bain", label: "Salle de bain" },
  { value: "toilettes", label: "Toilettes" },
  { value: "facade_exterieure", label: "Façade extérieure" },
  { value: "cour", label: "Cour" },
  { value: "parking", label: "Parking" },
  { value: "balcon", label: "Balcon" },
  { value: "terrasse", label: "Terrasse" },
  { value: "autre", label: "Autre" },
];

const VIDEO_MAX_MB = 40;
const VIDEO_MAX_BYTES = VIDEO_MAX_MB * 1024 * 1024;

export function MediaManager({ propertyId }: { propertyId: number }) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [zone, setZone] = useState("salon");
  const isVideo = pendingFile?.type.startsWith("video") ?? false;
  const { data, isLoading } = useQuery({
    queryKey: ["property-medias", propertyId],
    queryFn: () => mediaApi.list(propertyId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["property-medias", propertyId] });

  const upload = useMutation({
    mutationFn: () =>
      mediaApi.upload(propertyId, pendingFile!, {
        type: pendingFile!.type.startsWith("video") ? "video" : "image",
        zone,
      }),
    onSuccess: () => {
      toast.success("Média ajouté.");
      setPendingFile(null);
      invalidate();
    },
    onError: () => toast.error("Échec de l'upload."),
  });

  const confirm = useConfirmDialog();

  const remove = useMutation({
    mutationFn: (mediaId: number) => mediaApi.remove(propertyId, mediaId),
    onSuccess: () => {
      toast.success("Média supprimé.");
      invalidate();
      confirm.close();
    },
    onError: () => toast.error("Impossible de supprimer ce média."),
  });

  const setPrincipal = useMutation({
    mutationFn: (mediaId: number) => mediaApi.setPrincipal(propertyId, mediaId),
    onSuccess: () => {
      toast.success("Image principale définie.");
      invalidate();
    },
    onError: () => toast.error("Impossible de définir cette image comme principale."),
  });

  const moveMedia = useMutation({
    mutationFn: (orderedIds: number[]) => mediaApi.reorder(propertyId, orderedIds),
    onSuccess: invalidate,
    onError: () => toast.error("Impossible de réordonner les médias."),
  });

  const medias = data ?? [];

  const move = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= medias.length) return;
    const order = medias.map((m) => m.id);
    [order[index], order[newIndex]] = [order[newIndex], order[index]];
    moveMedia.mutate(order);
  };

  const hasImage = medias.some((m) => m.type === "image");

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
      {!isLoading && !hasImage && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
          ⚠️ Votre annonce n&apos;est pas encore visible. Ajoutez au moins une photo pour la publier.
        </div>
      )}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold">Photos &amp; vidéos</h2>
        <Button size="sm" onClick={() => fileRef.current?.click()}>
          Ajouter un média
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.type.startsWith("video") && file.size > VIDEO_MAX_BYTES) {
              toast.error(`La vidéo dépasse la taille maximale autorisée (${VIDEO_MAX_MB} Mo). Veuillez en choisir une plus légère.`);
              e.target.value = "";
              return;
            }
            setPendingFile(file);
            e.target.value = "";
          }}
        />
      </div>

      <Dialog open={!!pendingFile} onOpenChange={(open) => !open && setPendingFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter ce média</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{pendingFile?.name}</p>
            {isVideo && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800/40 dark:bg-blue-900/20 dark:text-blue-200">
                📹 Taille maximale : <strong>{VIDEO_MAX_MB} Mo</strong>. Formats acceptés : MP4, MOV, WebM. La vidéo sera lisible par les visiteurs dans le détail de l&apos;annonce.
              </div>
            )}
            <Select value={zone} onValueChange={(v) => setZone(v ?? "salon")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                {ZONES.map((z) => (
                  <SelectItem key={z.value} value={z.value}>
                    {z.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={() => upload.mutate()} disabled={upload.isPending}>
              {upload.isPending ? "Envoi..." : "Uploader"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <LoadingState />
      ) : medias.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border p-6 text-center">
          <ImageIcon className="text-muted-foreground" size={24} />
          <p className="text-sm text-muted-foreground">Aucun média pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {medias.map((m, idx) => (
            <div key={m.id} className="space-y-1">
              <div
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border-2",
                  m.is_principale ? "border-primary" : "border-transparent"
                )}
              >
                {m.type === "video" ? (
                  <div className="relative h-full w-full bg-black">
                    <video src={m.url} className="h-full w-full object-cover" preload="metadata" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play size={20} className="fill-white text-white" />
                    </span>
                  </div>
                ) : (
                  <Image src={m.url} alt="" fill className="object-cover" unoptimized />
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                <Button size="xs" variant="outline" onClick={() => move(idx, -1)} disabled={idx === 0}>
                  ↑
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => move(idx, 1)}
                  disabled={idx === medias.length - 1}
                >
                  ↓
                </Button>
                {!m.is_principale && m.type === "image" && (
                  <Button size="xs" variant="outline" onClick={() => setPrincipal.mutate(m.id)}>
                    Principale
                  </Button>
                )}
                <button
                  type="button"
                  aria-label="Supprimer ce média"
                  onClick={() => confirm.ask(m.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-destructive transition hover:bg-destructive/10"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirm.target !== null}
        onOpenChange={(open) => !open && confirm.close()}
        title="Supprimer ce média ?"
        description="Cette action est irréversible."
        loading={remove.isPending}
        onConfirm={() => confirm.target && remove.mutate(confirm.target)}
      />
    </div>
  );
}
