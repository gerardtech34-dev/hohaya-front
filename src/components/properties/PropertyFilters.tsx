"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const TYPES = ["studio", "appartement", "maison", "chambre", "villa", "duplex"];

function useFilterState() {
  const searchParams = useSearchParams();
  return useState<Record<string, string>>({
    ville: searchParams.get("ville") ?? "",
    commune: searchParams.get("commune") ?? "",
    type_logement: searchParams.get("type_logement") ?? "",
    prix_min: searchParams.get("prix_min") ?? "",
    prix_max: searchParams.get("prix_max") ?? "",
  });
}

function FilterFields({
  values,
  setValues,
}: {
  values: Record<string, string>;
  setValues: (updater: (v: Record<string, string>) => Record<string, string>) => void;
}) {
  return (
    <>
      <Input
        placeholder="Ville"
        value={values.ville}
        onChange={(e) => setValues((v) => ({ ...v, ville: e.target.value }))}
      />
      <Input
        placeholder="Commune"
        value={values.commune}
        onChange={(e) => setValues((v) => ({ ...v, commune: e.target.value }))}
      />
      <Select
        value={values.type_logement}
        onValueChange={(v) => setValues((s) => ({ ...s, type_logement: v ?? "" }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Type de logement" />
        </SelectTrigger>
        <SelectContent>
          {TYPES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        placeholder="Prix min"
        value={values.prix_min}
        onChange={(e) => setValues((v) => ({ ...v, prix_min: e.target.value }))}
      />
      <Input
        type="number"
        placeholder="Prix max"
        value={values.prix_max}
        onChange={(e) => setValues((v) => ({ ...v, prix_max: e.target.value }))}
      />
    </>
  );
}

export function PropertyFilters() {
  const router = useRouter();
  const [values, setValues] = useFilterState();
  const [open, setOpen] = useState(false);

  const submit = () => {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setOpen(false);
    router.push(`/annonces?${params.toString()}`);
  };

  return (
    <>
      {/* Desktop : filtres en ligne */}
      <div className="hidden rounded-2xl border border-border bg-card p-4 md:grid md:grid-cols-6 md:gap-3">
        <FilterFields values={values} setValues={setValues} />
        <Button onClick={submit}>Rechercher</Button>
      </div>

      {/* Mobile : bouton qui ouvre un tiroir de filtres */}
      <div className="md:hidden">
        <Button variant="outline" className="w-full gap-2" onClick={() => setOpen(true)}>
          <SlidersHorizontal size={16} />
          Filtrer les annonces
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="md:hidden">
          <SheetHeader>
            <SheetTitle>Filtrer les annonces</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 px-4 pb-4">
            <FilterFields values={values} setValues={setValues} />
            <Button onClick={submit} className="w-full">
              Voir les résultats
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
