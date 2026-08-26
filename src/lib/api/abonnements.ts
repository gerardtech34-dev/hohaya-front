import { apiFetch } from "@/lib/api/client";
import type { Abonnement, Paginated, TarifAbonnement } from "@/lib/types";

export type InitierAbonnementResult = {
  abonnement: Abonnement;
  paiement_id: number;
  montant: number;
  devise: string;
  fedapay_public_key: string;
  sandbox: boolean;
  instructions: string;
};

export function tarifs() {
  return apiFetch<TarifAbonnement[]>("/abonnements/tarifs", { auth: false });
}

export function actif() {
  return apiFetch<Abonnement | null>("/abonnements/actif");
}

export function historique() {
  return apiFetch<Paginated<Abonnement>>("/abonnements/historique");
}

export function initier(payload: { type: string }) {
  return apiFetch<InitierAbonnementResult>("/abonnements/initier", { method: "POST", body: payload });
}

export function confirmer(payload: { paiement_id: number; transaction_id: string }) {
  return apiFetch<{ message: string }>("/abonnements/confirmer", { method: "POST", body: payload });
}
