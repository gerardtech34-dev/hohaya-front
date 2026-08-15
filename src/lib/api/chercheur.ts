import { apiFetch } from "@/lib/api/client";
import type { Favori, Paginated, Visite } from "@/lib/types";

export function toggleFavori(propertyId: number) {
  return apiFetch<{ favori: boolean; message: string }>(`/chercheur/favoris/${propertyId}`, {
    method: "POST",
  });
}

export function mesFavoris() {
  return apiFetch<Paginated<Favori>>("/chercheur/favoris");
}

export function demanderVisite(payload: { id_property: number; date_souhaitee: string; message?: string }) {
  return apiFetch<Visite>("/chercheur/visites", { method: "POST", body: payload });
}

export function mesVisites() {
  return apiFetch<Paginated<Visite>>("/chercheur/visites");
}

export function annulerVisite(id: number) {
  return apiFetch<Visite>(`/chercheur/visites/${id}/annuler`, { method: "PATCH" });
}
