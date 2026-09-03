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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// v1 recentrée "logement étudiant" : cf. PropertyForm.tsx pour le detail du standby.
const TYPES = ["chambre"];

type FilterValues = {
  country: string;
  city: string;
  district: string;
  type: string;
  min_price: string;
  max_price: string;
};

function useFilterState() {
  const searchParams = useSearchParams();
  return useState<FilterValues>({
    country: searchParams.get("country") ?? "",
    city: searchParams.get("city") ?? "",
    district: searchParams.get("district") ?? "",
    type: searchParams.get("type") ?? "",
    min_price: searchParams.get("min_price") ?? "",
    max_price: searchParams.get("max_price") ?? "",
  });
}

function FilterFields({
  values,
  setValues,
}: {
  values: FilterValues;
  setValues: (updater: (v: FilterValues) => FilterValues) => void;
}) {
  return (
    <>
      <div>
        <Input
          placeholder="Pays"
          value={values.country}
          onChange={(e) => setValues((v) => ({ ...v, country: e.target.value }))}
        />
      </div>
      <div>
        <Input
          placeholder="Ville"
          value={values.city}
          onChange={(e) => setValues((v) => ({ ...v, city: e.target.value }))}
        />
      </div>
      <div>
        <Input
          placeholder="Quartier"
          value={values.district}
          onChange={(e) => setValues((v) => ({ ...v, district: e.target.value }))}
        />
      </div>
      <Select
        value={values.type}
        onValueChange={(v) => setValues((s) => ({ ...s, type: v ?? "" }))}
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
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          placeholder="Prix min"
          value={values.min_price}
          onChange={(e) => setValues((v) => ({ ...v, min_price: e.target.value }))}
        />
        <Input
          type="number"
          placeholder="Prix max"
          value={values.max_price}
          onChange={(e) => setValues((v) => ({ ...v, max_price: e.target.value }))}
        />
      </div>
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
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className="shrink-0 gap-2 rounded-full">
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filtres</span>
          </Button>
        }
      />
      <PopoverContent align="end" className="w-[min(20rem,calc(100vw-2rem))] space-y-3 p-4">
        <FilterFields values={values} setValues={setValues} />
        <Button onClick={submit} className="w-full">
          Voir les résultats
        </Button>
      </PopoverContent>
    </Popover>
  );
}
