import { apiFetch } from "@/lib/api/client";
import type { Paginated, Paiement } from "@/lib/types";

export type RevenusContacts = {
  total_gagne: number;
  paiements: Paginated<Paiement>;
};

export function revenusContacts() {
  return apiFetch<RevenusContacts>("/owner/revenus-contacts");
}
