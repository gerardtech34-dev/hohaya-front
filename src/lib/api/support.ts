import { apiFetch } from "@/lib/api/client";
import type { Paginated, SupportTicket } from "@/lib/types";

export function listTickets() {
  return apiFetch<Paginated<SupportTicket>>("/support/tickets");
}

export function createTicket(payload: {
  sujet: string;
  message: string;
  categorie: string;
  canal_preference?: string;
  telephone_contact?: string;
}) {
  return apiFetch<SupportTicket>("/support/tickets", { method: "POST", body: payload });
}

export function respondTicket(id: number, reponse: string) {
  return apiFetch<SupportTicket>(`/support/tickets/${id}/respond`, { method: "POST", body: { reponse } });
}

export function closeTicket(id: number) {
  return apiFetch<SupportTicket>(`/support/tickets/${id}/close`, { method: "PATCH" });
}
