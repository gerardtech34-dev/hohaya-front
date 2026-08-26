import { apiFetch } from "@/lib/api/client";

export type ReservationPaymentIntent = {
  paiement_id: number;
  montant: number;
  devise: string;
  property_id: number;
  property_title: string;
  nb_avance: number;
  fedapay_public_key: string;
  sandbox: boolean;
  instructions: string;
};

export type ReservationConfirmed = {
  property_id: number;
  property_title: string;
  message: string;
};

export type GuestReservationResult = ReservationPaymentIntent & {
  access_token: string;
  refresh_token: string;
};

export function initier(propertyId: number) {
  return apiFetch<ReservationPaymentIntent>("/reservations/initier", {
    method: "POST",
    body: { property_id: propertyId },
  });
}

export function guestInitier(payload: { property_id: number; name: string; email: string; phone: string }) {
  return apiFetch<GuestReservationResult>("/reservations/guest-initier", {
    method: "POST",
    body: payload,
  });
}

export type ConfirmerReservationResult = ReservationConfirmed | { pending: true; message: string };

export function confirmer(payload: { paiement_id: number; transaction_id: string }) {
  return apiFetch<ConfirmerReservationResult>("/reservations/confirmer", { method: "POST", body: payload });
}
