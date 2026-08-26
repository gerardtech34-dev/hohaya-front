"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/lib/api/auth";
import { clearToken, getToken, setRole, setTokens } from "@/lib/auth/token";
import type { Role, User } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  login: (payload: { email?: string; phone?: string; password: string }) => Promise<User>;
  register: (payload: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    role: "owner" | "seeker";
  }) => Promise<User>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function extractRole(user: User): Role | null {
  return (user.roles?.[0] as Role) ?? null;
}

function redirectForRole(role: Role | null) {
  if (role === "owner") return "/owner/dashboard";
  if (role === "admin") return "/admin";
  return "/dashboard";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshMe = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me);
      const role = extractRole(me);
      if (role) setRole(role);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
    refreshMe();
  }, []);

  const login: AuthContextValue["login"] = async (payload) => {
    const result = await authApi.login(payload);
    setTokens(result.access_token, result.refresh_token);
    const role = extractRole(result.user);
    if (role) setRole(role);
    setUser(result.user);
    router.push(redirectForRole(role));
    return result.user;
  };

  const register: AuthContextValue["register"] = async (payload) => {
    const result = await authApi.register(payload);
    setTokens(result.access_token, result.refresh_token);
    const role = extractRole(result.user);
    if (role) setRole(role);
    setUser(result.user);
    router.push(redirectForRole(role));
    return result.user;
  };

  const logout = async () => {
    clearToken();
    setUser(null);
    router.push("/login");
    authApi.logout().catch(() => {
      // token already invalid, ignore
    });
  };

  const role = user ? extractRole(user) : null;

  return (
    <AuthContext.Provider value={{ user, role, isLoading, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
