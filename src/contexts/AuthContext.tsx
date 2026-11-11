"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Public demo account. example.com is a reserved documentation domain. */
const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "demo123";

/**
 * Earlier walkthrough login. Still accepted so existing instructions keep working.
 * The login screen and README advertise the example.com account above.
 */
const LEGACY_DEMO_USERNAME = "mithun";
const LEGACY_DEMO_PASSWORD = "1234";

function credentialsMatch(username: string, password: string): boolean {
  if (username === DEMO_EMAIL && password === DEMO_PASSWORD) return true;
  if (username === LEGACY_DEMO_USERNAME && password === LEGACY_DEMO_PASSWORD) return true;
  return false;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("sovos_user");
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Client-side demo check only. Not a real identity provider.
    if (credentialsMatch(username, password)) {
      setIsAuthenticated(true);
      setUser(username);
      localStorage.setItem("sovos_user", username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("sovos_user");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
