import { apiDownload, apiFetch } from "@/lib/api/client";
import type { AdminTarifAbonnement, AdminUser, Paginated, Paiement, Property, Signalement, SupportTicket } from "@/lib/types";

export type AdminDashboardStats = {
  users: { total: number; proprietaires: number; chercheurs: number; nouveaux_30j: number; verifies: number };
  properties: { total: number; disponibles: number; verifiees: number; en_attente: number; nouvelles_30j: number };
  abonnements: { actifs: number; expires_7j: number };
  revenus: {
    total: number;
    ce_mois: number;
    mois_dernier: number;
    part_hohaya_total: number;
    part_proprietaires_total: number;
  };
  support: { ouverts: number; en_cours: number };
  paiements: { en_attente: number; echoues_7j: number };
};

export function dashboard() {
  return apiFetch<AdminDashboardStats>("/admin/dashboard");
}

export function revenusMensuels() {
  return apiFetch<{ mois: string; montant: number }[]>("/admin/revenus/mensuel");
}

export function users(params: { page?: number; search?: string } = {}) {
  return apiFetch<Paginated<AdminUser>>("/admin/users", { params });
}

export function verifierProprietaire(id: number, isVerified: boolean) {
  return apiFetch<{ user_id: number; is_verified: boolean }>(`/admin/users/${id}/verify`, {
    method: "PATCH",
    body: { is_verified: isVerified },
  });
}

export function toggleSuspension(id: number, suspendre: boolean) {
  return apiFetch<{ user_id: number }>(`/admin/users/${id}/suspension`, {
    method: "PATCH",
    body: { suspendre },
  });
}

export function restoreUser(id: number) {
  return apiFetch<null>(`/admin/users/${id}/restore`, { method: "POST" });
}

export function annoncesEnAttente() {
  return apiFetch<Paginated<Property>>("/admin/properties/pending");
}

export function toutesLesAnnonces(page = 1) {
  return apiFetch<Paginated<Property>>("/admin/properties", { params: { page } });
}

export function paiements(page = 1) {
  return apiFetch<Paginated<Paiement>>("/admin/paiements", { params: { page } });
}

export function supportTickets() {
  return apiFetch<Paginated<SupportTicket>>("/admin/support/tickets");
}

export function signalements() {
  return apiFetch<Paginated<Signalement>>("/admin/signalements");
}

export function treatSignalement(id: number, status: string, noteAdmin?: string) {
  return apiFetch<Signalement>(`/admin/signalements/${id}/treat`, {
    method: "PATCH",
    body: { status, note_admin: noteAdmin },
  });
}

export function tarifsAdmin() {
  return apiFetch<AdminTarifAbonnement[]>("/admin/tarifs");
}

export function updateTarif(
  type: string,
  payload: { montant?: number; description?: string; is_actif?: boolean }
) {
  return apiFetch<AdminTarifAbonnement>(`/admin/tarifs/${type}`, { method: "PATCH", body: payload });
}

export function settings() {
  return apiFetch<{
    deblocage_contact_prix: number;
    deblocage_part_hohaya_pourcentage: number;
    deblocage_essais_gratuits: number;
    abonnement_requis: boolean;
  }>("/admin/settings");
}

export function updateDeblocagePrix(montant: number) {
  return apiFetch<{ deblocage_contact_prix: number }>("/admin/settings/deblocage-prix", {
    method: "PATCH",
    body: { montant },
  });
}

export function updateDeblocagePartHohaya(pourcentage: number) {
  return apiFetch<{ deblocage_part_hohaya_pourcentage: number }>(
    "/admin/settings/deblocage-part-hohaya",
    { method: "PATCH", body: { pourcentage } }
  );
}

export function updateDeblocageEssaisGratuits(nombre: number) {
  return apiFetch<{ deblocage_essais_gratuits: number }>(
    "/admin/settings/deblocage-essais-gratuits",
    { method: "PATCH", body: { nombre } }
  );
}

export function updateAbonnementRequis(requis: boolean) {
  return apiFetch<{ abonnement_requis: boolean }>(
    "/admin/settings/abonnement-requis",
    { method: "PATCH", body: { requis } }
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportPaiements() {
  const blob = await apiDownload("/admin/export/paiements");
  downloadBlob(blob, `hohaya_paiements_${Date.now()}.csv`);
}

export async function exportUsers() {
  const blob = await apiDownload("/admin/export/users");
  downloadBlob(blob, `hohaya_users_${Date.now()}.csv`);
}
