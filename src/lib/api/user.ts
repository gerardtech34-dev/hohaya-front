import { apiFetch } from "@/lib/api/client";
import type { User } from "@/lib/types";

export function getProfile() {
  return apiFetch<User>("/user/profile");
}

export function updateProfile(payload: Partial<Pick<User, "name" | "email" | "phone" | "adress">>) {
  return apiFetch<User>("/user/profile", { method: "PUT", body: payload });
}

export function uploadAvatar(file: File) {
  const form = new FormData();
  form.append("avatar", file);
  return apiFetch<User>("/user/avatar", { method: "POST", body: form, isFormData: true });
}

export function deleteAvatar() {
  return apiFetch<null>("/user/avatar", { method: "DELETE" });
}

export function deleteAccount() {
  return apiFetch<null>("/user/account", { method: "DELETE" });
}

export function restoreAccount(id: number) {
  return apiFetch<null>(`/user/restore/${id}`, { method: "POST" });
}
