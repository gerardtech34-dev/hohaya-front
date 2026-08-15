import { apiFetch } from "@/lib/api/client";
import type { Paginated, Paiement } from "@/lib/types";

export function list(page = 1) {
  return apiFetch<Paginated<Paiement>>("/paiements", { params: { page } });
}
