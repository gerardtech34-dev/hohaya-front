import { apiFetch } from "@/lib/api/client";
import type { Paginated, Property } from "@/lib/types";

export type PropertyFilters = {
  pays?: string;
  ville?: string;
  commune?: string;
  quartier?: string;
  type_logement?: string;
  prix_min?: number;
  prix_max?: number;
  nb_pieces?: number;
  meuble?: boolean;
  page?: number;
  per_page?: number;
};

export function list(filters: PropertyFilters = {}) {
  return apiFetch<Paginated<Property>>("/properties", { auth: false, params: filters });
}

export function get(id: number | string) {
  return apiFetch<Property>(`/properties/${id}`, { auth: false });
}

export function myProperties(page = 1) {
  return apiFetch<Paginated<Property>>("/properties/my", { params: { page } });
}

export function create(payload: Partial<Property>) {
  return apiFetch<Property>("/properties", { method: "POST", body: payload });
}

export function update(id: number, payload: Partial<Property>) {
  return apiFetch<Property>(`/properties/${id}`, { method: "PUT", body: payload });
}

export function remove(id: number) {
  return apiFetch<null>(`/properties/${id}`, { method: "DELETE" });
}

export function changeStatus(id: number, status: string) {
  return apiFetch<Property>(`/properties/${id}/status`, { method: "PATCH", body: { status } });
}

export function verify(id: number, isVerified: boolean) {
  return apiFetch<Property>(`/properties/${id}/verify`, {
    method: "PATCH",
    body: { is_verified: isVerified },
  });
}
