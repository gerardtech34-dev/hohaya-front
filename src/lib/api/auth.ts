import { apiFetch } from "@/lib/api/client";
import type { User } from "@/lib/types";

export type AuthResult = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
};

export function register(payload: {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  password_confirmation: string;
  role: "owner" | "seeker";
}) {
  return apiFetch<AuthResult>("/auth/register", { method: "POST", body: payload, auth: false });
}

export function login(payload: { email?: string; phone?: string; password: string }) {
  return apiFetch<AuthResult>("/auth/login", { method: "POST", body: payload, auth: false });
}

export function forgotPassword(payload: { email: string }) {
  return apiFetch<null>("/auth/forgot-password", { method: "POST", body: payload, auth: false });
}

export function resetPassword(payload: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  return apiFetch<null>("/auth/reset-password", { method: "POST", body: payload, auth: false });
}

export function verifyEmail(id: string, hash: string, params: string) {
  return apiFetch<null>(`/auth/verify-email/${id}/${hash}${params}`, { auth: false });
}

export function me() {
  return apiFetch<User>("/auth/me");
}

export function logout() {
  return apiFetch<null>("/auth/logout", { method: "POST" });
}

export function logoutAll() {
  return apiFetch<null>("/auth/logout-all", { method: "POST" });
}

export function resendVerification() {
  return apiFetch<null>("/auth/resend-verification", { method: "POST" });
}
