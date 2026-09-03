import { apiFetch } from "@/lib/api/client";
import type { User } from "@/lib/types";

export type AuthResult = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
};

export type RegisterResult =
  | { requires_login_code: true; email: string | null }
  | { requires_email_verification: true; email: string | null };

export function register(payload: {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  role: "owner" | "seeker";
}) {
  return apiFetch<RegisterResult>("/auth/register", { method: "POST", body: payload, auth: false });
}

export type LoginResult = AuthResult | { two_factor_required: true; user_id: number };

export function login(payload: { email?: string; phone?: string; password: string }) {
  return apiFetch<LoginResult>("/auth/login", { method: "POST", body: payload, auth: false });
}

export function requestLoginCode(email: string) {
  return apiFetch<null>("/auth/login-code/request", { method: "POST", body: { email }, auth: false });
}

export function verifyLoginCode(email: string, code: string) {
  return apiFetch<AuthResult>("/auth/login-code/verify", {
    method: "POST",
    body: { email, code },
    auth: false,
  });
}

export function verifyTwoFactor(userId: number, code: string) {
  return apiFetch<AuthResult>("/auth/2fa/verify", {
    method: "POST",
    body: { user_id: userId, code },
    auth: false,
  });
}

export function updateTwoFactorSetting(enabled: boolean) {
  return apiFetch<{ two_factor_enabled: boolean }>("/user/settings/2fa", {
    method: "PATCH",
    body: { enabled },
  });
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
  return apiFetch<AuthResult>(`/auth/verify-email/${id}/${hash}${params}`, { auth: false });
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
