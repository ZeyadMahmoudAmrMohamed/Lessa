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

const MOCK_USERS: Record<string, { password: string; user: AuthUser }> = {
  "01012345678": {
    password: "pass1234",
    user: { sub: "citizen-001", phone: "01012345678", role: "citizen", name: "أحمد محمود" },
  },
  "01098765432": {
    password: "pass1234",
    user: {
      sub: "staff-001",
      phone: "01098765432",
      role: "staff",
      name: "مريم علي",
      window_id: "win-3",
    },
  },
  "01555000001": {
    password: "pass1234",
    user: { sub: "sup-001", phone: "01555000001", role: "supervisor", name: "خالد إبراهيم" },
  },
  "01000000001": {
    password: "pass1234",
    user: { sub: "admin-001", phone: "01000000001", role: "admin", name: "System Admin" },
  },
};

function encodeMockJwt(user: AuthUser): string {
  const payload = btoa(JSON.stringify(user));
  return `mock.${payload}.sig`;
}

function decodeMockJwt(token: string): AuthUser | null {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload)) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lessa_token");
    if (stored) {
      const decoded = decodeMockJwt(stored);
      if (decoded) {
        setToken(stored);
        setUser(decoded);
      }
    }
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const entry = MOCK_USERS[phone];
    if (!entry || entry.password !== password) {
      throw new Error("INVALID_CREDENTIALS");
    }
    const t = encodeMockJwt(entry.user);
    localStorage.setItem("lessa_token", t);
    setToken(t);
    setUser(entry.user);
    return entry.user;
  }, []);

  const register = useCallback(
    async (full_name: string, phone: string, password: string) => {
      await new Promise((r) => setTimeout(r, 400));
      if (MOCK_USERS[phone]) throw new Error("PHONE_ALREADY_EXISTS");
      const newUser: AuthUser = {
        sub: `citizen-${Date.now()}`,
        phone,
        role: "citizen",
        name: full_name,
      };
      MOCK_USERS[phone] = { password, user: newUser };
      const t = encodeMockJwt(newUser);
      localStorage.setItem("lessa_token", t);
      setToken(t);
      setUser(newUser);
      return newUser;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("lessa_token");
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
