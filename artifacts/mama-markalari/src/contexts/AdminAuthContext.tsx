import { createContext, useContext, useState, ReactNode } from "react";
import { useAdminLogin, setAuthTokenGetter } from "@workspace/api-client-react";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);
const STORAGE_KEY = "iyipet_admin_auth";
const TOKEN_KEY = "iyipet_admin_token";

setAuthTokenGetter(() => localStorage.getItem(TOKEN_KEY));

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });
  const loginMutation = useAdminLogin();

  const login = async (username: string, password: string) => {
    try {
      const res = await loginMutation.mutateAsync({ data: { username, password } });
      if (res.success) {
        localStorage.setItem(STORAGE_KEY, "true");
        if (res.token) localStorage.setItem(TOKEN_KEY, res.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be inside AdminAuthProvider");
  return ctx;
}
