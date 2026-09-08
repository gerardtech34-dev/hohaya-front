"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/lib/api/auth";
import { clearToken, getToken, setRole, setTokens } from "@/lib/auth/token";
import type { Role, User } from "@/lib/types";

type LoginOutcome = { status: "authenticated"; user: User } | { status: "two_factor_required"; userId: number };

type AuthContextValue = {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  login: (payload: { email?: string; phone?: string; password: string }) => Promise<LoginOutcome>;
  completeTwoFactor: (userId: number, code: string) => Promise<User>;
  loginByCode: (email: string, code: string) => Promise<User>;
  applyAuthResult: (result: authApi.AuthResult) => User;
  register: (payload: {
    name: string;
    email?: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    role: "owner" | "seeker";
  }) => Promise<authApi.RegisterResult>;
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

  const applyAuthResult = (result: authApi.AuthResult) => {
    setTokens(result.access_token, result.refresh_token);
    const role = extractRole(result.user);
    if (role) setRole(role);
    setUser(result.user);
    router.push(redirectForRole(role));
    return result.user;
  };

  const login: AuthContextValue["login"] = async (payload) => {
    const result = await authApi.login(payload);
    if ("two_factor_required" in result) {
      return { status: "two_factor_required", userId: result.user_id };
    }
    const user = applyAuthResult(result);
    return { status: "authenticated", user };
  };

  const completeTwoFactor: AuthContextValue["completeTwoFactor"] = async (userId, code) => {
    const result = await authApi.verifyTwoFactor(userId, code);
    return applyAuthResult(result);
  };

  const loginByCode: AuthContextValue["loginByCode"] = async (email, code) => {
    const result = await authApi.verifyLoginCode(email, code);
    return applyAuthResult(result);
  };

  const register: AuthContextValue["register"] = async (payload) => {
    return authApi.register(payload);
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
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        login,
        completeTwoFactor,
        loginByCode,
        applyAuthResult,
        register,
        logout,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
