import { apiFetch } from "@/lib/api/client";
import type { Paginated } from "@/lib/types";

export type Locataire = {
  id: number;
  locataire: { id: number; nom: string; email: string | null; phone: string | null };
  property: { id: number; title: string; ville: string } | null;
  proprietaire: { id: number; nom: string } | null;
  montant: number;
  devise: string;
  paye_le: string | null;
};

export function mesLocataires() {
  return apiFetch<Paginated<Locataire>>("/owner/locataires");
}

export function tousLesLocataires() {
  return apiFetch<Paginated<Locataire>>("/admin/locataires");
}
