const TOKEN_KEY = "hohaya_token";
const REFRESH_KEY = "hohaya_refresh_token";
const ROLE_KEY = "hohaya_role";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  document.cookie = `${TOKEN_KEY}=${accessToken}; path=/; max-age=2592000; samesite=lax`;
}

export function setRole(role: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
  document.cookie = `${ROLE_KEY}=${role}; path=/; max-age=2592000; samesite=lax`;
}

export function getRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ROLE_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
  document.cookie = `${ROLE_KEY}=; path=/; max-age=0`;
}
