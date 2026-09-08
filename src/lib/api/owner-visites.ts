import { apiFetch } from "@/lib/api/client";
import type { Paginated, Visite } from "@/lib/types";

export function visitesRecues() {
  return apiFetch<Paginated<Visite>>("/owner/visites");
}

export function repondreVisite(id: number, payload: { status: "confirmée" | "refusée"; note_proprietaire?: string }) {
  return apiFetch<Visite>(`/owner/visites/${id}/repondre`, { method: "PATCH", body: payload });
}

export type ChercheurInteresse = {
  id: number;
  chercheur: { id: number; nom: string; email: string | null; phone: string | null };
  property: { id: number; title: string; ville: string; media_principal: { url: string } | null };
  debloque_le: string;
};

export function chercheursInteresses() {
  return apiFetch<Paginated<ChercheurInteresse>>("/owner/contacts-debloques");
}

export function proposerVisite(payload: {
  id_property: number;
  id_chercheur: number;
  date_souhaitee: string;
  message?: string;
}) {
  return apiFetch<Visite>("/owner/visites", { method: "POST", body: payload });
}
