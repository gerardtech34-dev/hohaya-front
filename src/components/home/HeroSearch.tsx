"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TYPES = [
  { value: "studio", label: "Studio" },
  { value: "appartement", label: "Appartement" },
  { value: "maison", label: "Maison" },
  { value: "chambre", label: "Chambre" },
  { value: "villa", label: "Villa" },
  { value: "duplex", label: "Duplex" },
];

export function HeroSearch() {
  const router = useRouter();
  const [ville, setVille] = useState("");
  const [type, setType] = useState("");

  const submit = () => {
    const params = new URLSearchParams();
    if (ville) params.set("ville", ville);
    if (type) params.set("type_logement", type);
    router.push(`/annonces${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3">
        <Search size={18} className="shrink-0 text-muted-foreground" />
        <Input
          placeholder="Ville, quartier, près de mon école..."
          value={ville}
          onChange={(e) => setVille(e.target.value)}
          className="border-0 px-0 shadow-none focus-visible:ring-0"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
      </div>
      <Select value={type} onValueChange={(v) => setType(v ?? "")}>
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Type de bien" />
        </SelectTrigger>
        <SelectContent>
          {TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={submit} className="sm:px-6">
        Rechercher
      </Button>
    </div>
  );
}
