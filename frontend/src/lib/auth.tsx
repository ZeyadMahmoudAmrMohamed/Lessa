import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Role } from "./mock-data";
import { apiFetch, ApiError } from "./api";

export interface AuthUser {
  sub: string;
  phone: string;
  role: Role;
  name: string;
  window_id?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (phone: string, password: string) => Promise<AuthUser>;
  register: (
    full_name: string,
    phone: string,
    password: string,
  ) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split(".");
    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    // atob gives a binary string; re-encode each byte as %xx then URI-decode to get proper UTF-8
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function buildUser(
  token: string,
  fallback: { id: string; role: string; name: string },
  windowId?: string,
): AuthUser {
  const payload = decodeJwtPayload(token);
  const sub = (payload?.sub as string) ?? fallback.id;
  const role = ((payload?.app_metadata as Record<string, unknown>)?.role as Role) ?? (fallback.role as Role);
  const name =
    ((payload?.user_metadata as Record<string, unknown>)?.full_name as string) ??
    fallback.name;
  const phone =
    ((payload?.user_metadata as Record<string, unknown>)?.phone as string) ?? "";

  return { sub, phone, role, name, window_id: windowId };
}

async function fetchStaffWindowId(token: string): Promise<string | undefined> {
  try {
    const data = await apiFetch<{ window: { id: string } | null }>(
      "/api/staff/my-window",
    );
    return data.window?.id ?? undefined;
  } catch {
    return undefined;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lessa_token");
    if (stored) {
      const payload = decodeJwtPayload(stored);
      if (payload) {
        const role = (payload.app_metadata as Record<string, unknown>)
          ?.role as Role;
        const name =
          ((payload.user_metadata as Record<string, unknown>)
            ?.full_name as string) ?? "";
        const phone =
          ((payload.user_metadata as Record<string, unknown>)
            ?.phone as string) ?? "";
        const built: AuthUser = {
          sub: payload.sub as string,
          phone,
          role,
          name,
        };
        setToken(stored);
        setUser(built);
        // Restore window_id for staff from localStorage cache
        const cachedWindowId = localStorage.getItem("lessa_window_id");
        if (role === "staff" && cachedWindowId) {
          setUser({ ...built, window_id: cachedWindowId });
        }
      }
    }
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    const resp = await apiFetch<{ token: string; user: { id: string; role: string; name: string } }>(
      "/api/auth/login",
      { method: "POST", body: { phone, password }, auth: false },
    );

    const { token: t, user: u } = resp;
    localStorage.setItem("lessa_token", t);
    setToken(t);

    let windowId: string | undefined;
    if (u.role === "staff") {
      // Fetch assigned window before building user so window_id is ready
      windowId = await fetchStaffWindowId(t);
      if (windowId) localStorage.setItem("lessa_window_id", windowId);
    }

    const built = buildUser(t, u, windowId);
    setUser(built);
    return built;
  }, []);

  const register = useCallback(
    async (full_name: string, phone: string, password: string) => {
      const resp = await apiFetch<{ token: string; user: { id: string; role: string; name: string } }>(
        "/api/auth/register",
        { method: "POST", body: { full_name, phone, password }, auth: false },
      );

      const { token: t, user: u } = resp;
      localStorage.setItem("lessa_token", t);
      setToken(t);

      const built = buildUser(t, u);
      setUser(built);
      return built;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("lessa_token");
    localStorage.removeItem("lessa_window_id");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, login, register, logout }),
    [user, token, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

export function roleHome(role: Role): string {
  switch (role) {
    case "citizen":
      return "/citizen/dashboard";
    case "staff":
      return "/staff/queue";
    case "supervisor":
      return "/supervisor/dashboard";
    case "admin":
      return "/admin/dashboard";
  }
}
