import { apiFetch } from "@/lib/api/client";
import type { AccessContact, Paginated } from "@/lib/types";

export type ContactPaymentIntent = {
  paiement_id: number;
  montant: number;
  devise: string;
  property_id: number;
  property_title: string;
  kkiapay_public_key: string;
  sandbox: boolean;
  instructions: string;
};

export type ContactInfo = {
  access: true;
  property_id: number;
  property_title: string;
  proprietaire: { nom: string; telephone: string | null; email: string | null };
  message: string;
};

export type InitierContactResult = ContactPaymentIntent | ContactInfo;

export function initier(propertyId: number) {
  return apiFetch<InitierContactResult>("/contacts/initier", {
    method: "POST",
    body: { property_id: propertyId },
  });
}

export function confirmer(payload: { paiement_id: number; transaction_id: string }) {
  return apiFetch<ContactInfo>("/contacts/confirmer", { method: "POST", body: payload });
}

export function historique() {
  return apiFetch<Paginated<AccessContact>>("/contacts/historique");
}
