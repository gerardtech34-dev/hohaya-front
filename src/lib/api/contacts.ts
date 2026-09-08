import { apiFetch } from "@/lib/api/client";
import type { AccessContact, Paginated } from "@/lib/types";

export type ContactPaymentIntent = {
  paiement_id: number;
  montant: number;
  devise: string;
  property_id: number;
  property_title: string;
  fedapay_public_key: string;
  sandbox: boolean;
  instructions: string;
};

export type ContactInfo = {
  access: true;
  nouveau: boolean;
  property_id: number;
  property_title: string;
  lien_maps: string | null;
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

export type GuestInitierResult = InitierContactResult & {
  access_token: string;
  refresh_token: string;
};

export function guestInitier(payload: { property_id: number; name: string; email: string; phone: string }) {
  return apiFetch<GuestInitierResult>("/contacts/guest-initier", {
    method: "POST",
    body: payload,
  });
}

export type ConfirmerContactResult = ContactInfo | { pending: true; message: string };

export function confirmer(payload: { paiement_id: number; transaction_id: string }) {
  return apiFetch<ConfirmerContactResult>("/contacts/confirmer", { method: "POST", body: payload });
}

export function historique() {
  return apiFetch<Paginated<AccessContact>>("/contacts/historique");
}
