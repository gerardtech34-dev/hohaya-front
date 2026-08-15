import { apiFetch } from "@/lib/api/client";
import type { Paginated, Visite } from "@/lib/types";

export function visitesRecues() {
  return apiFetch<Paginated<Visite>>("/owner/visites");
}

export function repondreVisite(id: number, payload: { status: "confirmée" | "refusée"; note_proprietaire?: string }) {
  return apiFetch<Visite>(`/owner/visites/${id}/repondre`, { method: "PATCH", body: payload });
}
