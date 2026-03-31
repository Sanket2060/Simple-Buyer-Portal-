import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AuthUser } from "../types";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from "../lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

const USER_KEY = "bp_user";

const loadPersistedUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(loadPersistedUser);
  const [token, setToken] = useState<string | null>(getStoredToken);

  const login = useCallback((user: AuthUser, token: string) => {
    setUser(user);
    setToken(token);
    setStoredToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearStoredToken();
    localStorage.removeItem(USER_KEY);
  }, []);

  // Listen for 401 events dispatched by the axios interceptor
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("bp:unauthorized", handler);
    return () => window.removeEventListener("bp:unauthorized", handler);
  }, [logout]);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
};
