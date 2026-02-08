"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import Storage from "@lib/storage";
import { API, USE_API } from "@lib/api";

interface User {
  id: number;
  username: string;
  nome: string;
  is_admin: boolean;
  instrumento?: string;
  foto_url?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({
  children,
  onTokenExpired,
}: {
  children: ReactNode;
  onTokenExpired?: () => void;
}) => {
  const [user, setUser] = useState<User | null>(() =>
    Storage.get<User | null>("user", null)
  );

  const logout = useCallback(() => {
    API.logout();
    setUser(null);
    Storage.remove("user");
    Storage.remove("favorites");
    Storage.remove("authToken");
  }, []);

  useEffect(() => {
    API.setOnTokenExpired(() => {
      logout();
      if (onTokenExpired) onTokenExpired();
    });
    return () => {
      API.setOnTokenExpired(null);
    };
  }, [logout, onTokenExpired]);

  useEffect(() => {
    if (USE_API && API.isTokenExpired()) {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    Storage.set("user", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
