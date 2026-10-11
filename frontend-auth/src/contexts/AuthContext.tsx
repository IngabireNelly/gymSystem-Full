import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, clearToken, errorMessage, getToken, setToken, setUnauthorizedHandler } from "../api/client";
import { CurrentUser, Role, Session } from "../types/gym";

type LoginResult = {ok: true;role: Role;name: string;} | {ok: false;error: string;};

interface LoginResponse {
  token: string;
  role: Role;
  userId: string;
  name: string;
  email: string;
}

interface MeResponse {
  role: Role;
  userId: string;
  name: string;
  email: string;
}

interface AuthValue {
  session: Session | null;
  currentUser: CurrentUser | null;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

function toUser(u: MeResponse | LoginResponse): CurrentUser {
  return { id: u.userId, fullName: u.name, email: u.email, role: u.role };
}

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  // If a token is stored, we must confirm it with the server before deciding whether to show login.
  const [checking, setChecking] = useState(() => getToken() !== null);

  const logout = useCallback(() => {
    clearToken();
    setCurrentUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    if (!getToken()) return;
    api<MeResponse>("/auth/me").
    then((me) => setCurrentUser(toUser(me))).
    catch(() => clearToken()).
    finally(() => setChecking(false));
  }, []);

  const login = useCallback(async (identifier: string, password: string): Promise<LoginResult> => {
    try {
      const res = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: { identifier: identifier.trim(), password }
      });
      setToken(res.token);
      setCurrentUser(toUser(res));
      return { ok: true, role: res.role, name: res.name };
    } catch (e) {
      return { ok: false, error: errorMessage(e) };
    }
  }, []);

  const session = useMemo<Session | null>(
    () => (currentUser ? { role: currentUser.role, userId: currentUser.id } : null),
    [currentUser]
  );

  const value = useMemo(
    () => ({ session, currentUser, login, logout }),
    [session, currentUser, login, logout]
  );

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink/60">Loading…</p>
      </div>);

  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
