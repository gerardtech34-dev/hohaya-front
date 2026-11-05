"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import * as propertiesApi from "@/lib/api/properties";
import { handleApiError } from "@/lib/api/apply-errors";
import type { Property } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field-error";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  title: z.string().min(4, "Titre requis"),
  description: z.string().min(10, "Description trop courte"),
  indications_acces: z.string().optional(),
  quartier: z.string().optional(),
  ville: z.string().min(2, "Ville requise"),
  pays: z.string().optional(),
  lien_maps: z.string().url("Lien invalide").optional().or(z.literal("")),
  prix_loyer: z.number().min(5000, "Le loyer doit être au moins 5 000 FCFA"),
  type_logement: z.string().min(1, "Type requis"),
  condition: z.string().min(1, "État du logement requis"),
  nb_avance: z.number().int().min(0),
  caution_mois: z.number().int().min(0),
  nb_pieces: z.number().int().min(1),
  eau_courante: z.boolean(),
  electricite: z.boolean(),
  gardien: z.boolean(),
  parking: z.boolean(),
  meuble: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

// v1 recentrée "logement étudiant" : uniquement "chambre à louer" pour l'instant.
// Studio/maison/appartement/villa/duplex mis en standby, pas supprimés — réactiver ici si le scope s'élargit.
const TYPES = ["chambre"];

const VILLES_BENIN = [
  "Cotonou", "Porto-Novo", "Parakou", "Abomey-Calavi", "Djougou",
  "Bohicon", "Kandi", "Lokossa", "Ouidah", "Natitingou",
  "Abomey", "Cové", "Dogbo", "Sakété", "Pobè",
  "Comè", "Aplahoué", "Dassa-Zoumè", "Savè", "Nikki",
  "Banikoara", "Malanville", "Tchaourou", "Péhunco",
];
// const TYPES_HORS_SCOPE_V1 = ["studio", "maison", "appartement", "villa", "duplex"];

const CHECKBOXES: { key: keyof FormValues; label: string }[] = [
  { key: "eau_courante", label: "Eau courante" },
  { key: "electricite", label: "Électricité" },
  { key: "gardien", label: "Gardien" },
  { key: "parking", label: "Parking" },
  { key: "meuble", label: "Meublé" },
];

export function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: property
      ? {
          title: property.title,
          description: property.description,
          indications_acces: property.indications_acces ?? "",
          quartier: property.quartier ?? "",
          ville: property.ville ?? "",
          pays: property.pays ?? "",
          lien_maps: property.lien_maps ?? "",
          prix_loyer: property.prix_loyer,
          type_logement: property.type_logement,
          condition: property.condition ?? "",
          nb_avance: property.nb_avance,
          caution_mois: property.caution_mois ?? 0,
          nb_pieces: property.nb_pieces,
          eau_courante: property.eau_courante,
          electricite: property.electricite,
          gardien: property.gardien,
          parking: property.parking,
          meuble: property.meuble,
        }
      : {
          type_logement: TYPES[0],
          nb_avance: 1,
          nb_pieces: 1,
          caution_mois: 0,
          eau_courante: false,
          electricite: false,
          gardien: false,
          parking: false,
          meuble: false,
        },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const payload = { ...values, devise: "XOF" };
      if (property) {
        await propertiesApi.update(property.id, payload);
        toast.success("Annonce mise à jour.");
        router.push(`/owner/properties/${property.id}/edit`);
      } else {
        const created = await propertiesApi.create(payload);
        toast.success("Annonce créée, ajoutez vos photos.");
        router.push(`/owner/properties/${created.id}/edit`);
      }
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-heading font-semibold">Informations générales</h2>
        <div className="space-y-1.5">
          <Label htmlFor="title">Titre de l&apos;annonce</Label>
          <Input id="title" {...register("title")} />
          <FieldError message={errors.title?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={5} {...register("description")} />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="indications_acces">Indications d&apos;accès</Label>
          <Textarea id="indications_acces" rows={2} {...register("indications_acces")} />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-heading font-semibold">Localisation</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Ville</Label>
            <Select value={watch("ville")} onValueChange={(v) => setValue("ville", v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une ville" />
              </SelectTrigger>
              <SelectContent>
                {VILLES_BENIN.map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.ville?.message} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quartier">Quartier</Label>
            <Input id="quartier" {...register("quartier")} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lien_maps">Lien Google Maps (optionnel)</Label>
          <Input
            id="lien_maps"
            placeholder="https://maps.app.goo.gl/..."
            {...register("lien_maps")}
          />
          <FieldError message={errors.lien_maps?.message} />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-heading font-semibold">Prix &amp; caractéristiques</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="prix_loyer">Loyer mensuel (FCFA)</Label>
            <Input id="prix_loyer" type="number" step="any" placeholder="Min. 5 000" {...register("prix_loyer", { valueAsNumber: true })} />
            <FieldError message={errors.prix_loyer?.message} />
          </div>
          <div className="space-y-1.5">
            <Label>Devise</Label>
            <div className="flex h-9 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
              XOF (Franc CFA)
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Type de logement</Label>
            <Select value={watch("type_logement")} onValueChange={(v) => setValue("type_logement", v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError message={errors.type_logement?.message} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="condition">État du logement</Label>
          <Input id="condition" placeholder="Ex: Bon état, Neuf, À rénover..." {...register("condition")} />
          <FieldError message={errors.condition?.message} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="nb_pieces">Pièces</Label>
            <Input id="nb_pieces" type="number" {...register("nb_pieces", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nb_avance">Avance (mois)</Label>
            <Input id="nb_avance" type="number" {...register("nb_avance", { valueAsNumber: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="caution_mois">Caution (mois)</Label>
            <Input id="caution_mois" type="number" min="0" {...register("caution_mois", { valueAsNumber: true })} />
            <p className="text-xs text-muted-foreground">Exprimée en nombre de mois de loyer</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-heading font-semibold">Équipements</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CHECKBOXES.map((c) => (
            <label key={c.key} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={watch(c.key) as boolean}
                onCheckedChange={(checked) => setValue(c.key, checked === true)}
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Enregistrement..." : property ? "Enregistrer" : "Créer l'annonce"}
      </Button>
    </form>
  );
}
