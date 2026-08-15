import { apiFetch } from "@/lib/api/client";

export function store(payload: {
  motif: string;
  description: string;
  type_signalement: string;
  id_property?: number;
  id_user_signale?: number;
}) {
  return apiFetch<null>("/signalements", { method: "POST", body: payload });
}
