import { apiFetch } from "@/lib/api/client";
import type { PropertyMedia } from "@/lib/types";

export type PropertyWithMedias = {
  id: number;
  title: string;
  media_principal: PropertyMedia | null;
  images: PropertyMedia[];
  videos: PropertyMedia[];
  total_medias: number;
};

export function list(propertyId: number) {
  return apiFetch<PropertyMedia[]>(`/properties/${propertyId}/medias`);
}

export function upload(
  propertyId: number,
  file: File,
  meta: { type: "image" | "video"; zone: string; description?: string; is_principale?: boolean }
) {
  const form = new FormData();
  form.append("fichier", file);
  form.append("type", meta.type);
  form.append("zone", meta.zone);
  if (meta.description) form.append("description", meta.description);
  if (meta.is_principale) form.append("is_principale", "1");
  return apiFetch<PropertyWithMedias>(`/properties/${propertyId}/medias`, {
    method: "POST",
    body: form,
    isFormData: true,
  });
}

export function remove(propertyId: number, mediaId: number) {
  return apiFetch<PropertyWithMedias>(`/properties/${propertyId}/medias/${mediaId}`, { method: "DELETE" });
}

export function setPrincipal(propertyId: number, mediaId: number) {
  return apiFetch<PropertyWithMedias>(`/properties/${propertyId}/medias/${mediaId}/principal`, {
    method: "POST",
  });
}

export function reorder(propertyId: number, orderedIds: number[]) {
  return apiFetch<PropertyWithMedias>(`/properties/${propertyId}/medias/reorder`, {
    method: "POST",
    body: { ordered_ids: orderedIds },
  });
}
