import { clearToken, getRefreshToken, getToken, setTokens } from "@/lib/auth/token";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string | null;
};

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  isFormData?: boolean;
  auth?: boolean;
  params?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(API_URL.replace(/\/$/, "") + "/" + path.replace(/^\//, ""));
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = fetch(buildUrl("/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const json = await res.json();
        if (json?.data?.access_token && json?.data?.refresh_token) {
          setTokens(json.data.access_token, json.data.refresh_token);
          return true;
        }
        return false;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function performFetch(path: string, options: RequestOptions): Promise<Response> {
  const { method = "GET", body, isFormData = false, auth = true, params } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (!isFormData) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  return fetch(buildUrl(path, params), {
    method,
    headers,
    body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
    cache: "no-store",
  });
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let res = await performFetch(path, options);

  if (res.status === 401 && options.auth !== false && path !== "/auth/refresh" && path !== "/auth/login") {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      res = await performFetch(path, options);
    }
  }

  let json: ApiResponse<T> | undefined;
  try {
    json = await res.json();
  } catch {
    json = undefined;
  }

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
    throw new ApiError("Session expirée, veuillez vous reconnecter.", 401);
  }

  if (!res.ok) {
    const message = json?.message ?? "Une erreur est survenue.";
    const data = json?.data as unknown;
    const errors =
      data && typeof data === "object" && "errors" in data
        ? (data as { errors?: Record<string, string[]> }).errors
        : (json as unknown as { errors?: Record<string, string[]> })?.errors;
    throw new ApiError(message, res.status, errors);
  }

  // "data" peut légitimement valoir null (ex: pas d'abonnement actif) — ne retomber sur
  // l'enveloppe complète que si la clé "data" est absente, pas si elle vaut null.
  if (json && typeof json === "object" && "data" in json) {
    return json.data as T;
  }
  return json as T;
}

export async function apiDownload(path: string): Promise<Blob> {
  const token = getToken();
  const res = await fetch(buildUrl(path), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new ApiError("Téléchargement impossible.", res.status);
  return res.blob();
}
