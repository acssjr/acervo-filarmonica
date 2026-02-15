"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import Storage from "@lib/storage";

interface ShareCartItem {
  parteId: string | number;
  parteName: string;
  partituraTitle: string;
  downloadUrl: string;
}

interface UIContextType {
  theme: string;
  themeMode: string;
  setThemeMode: (mode: string) => void;
  toast: { message: string; type: string } | null;
  showToast: (message: string, type?: string) => void;
  clearToast: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  selectedSheet: any;
  setSelectedSheet: (sheet: any) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  shareCart: ShareCartItem[];
  showShareCart: boolean;
  setShowShareCart: (show: boolean) => void;
  addToShareCart: (item: ShareCartItem) => void;
  removeFromShareCart: (parteId: string | number) => void;
  clearShareCart: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within UIProvider");
  }
  return context;
};

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState(() =>
    Storage.get<string>("themeMode", "system")
  );

  const getEffectiveTheme = useCallback(() => {
    if (typeof window === "undefined") return "light";
    if (themeMode === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return themeMode;
  }, [themeMode]);

  const [theme, setTheme] = useState(getEffectiveTheme);

  const [toast, setToast] = useState<{ message: string; type: string } | null>(
    null
  );
  const showToast = useCallback(
    (message: string, type = "success") => setToast({ message, type }),
    []
  );
  const clearToast = useCallback(() => setToast(null), []);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const [shareCart, setShareCart] = useState<ShareCartItem[]>([]);
  const [showShareCart, setShowShareCart] = useState(false);

  const addToShareCart = useCallback((item: ShareCartItem) => {
    setShareCart((prev) => {
      if (prev.some((i) => i.parteId === item.parteId)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromShareCart = useCallback((parteId: string | number) => {
    setShareCart((prev) => prev.filter((i) => i.parteId !== parteId));
  }, []);

  const clearShareCart = useCallback(() => {
    setShareCart([]);
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      if (typeof window === "undefined") return;
      const effectiveTheme =
        themeMode === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : themeMode;
      setTheme(effectiveTheme);
    };
    updateTheme();

    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateTheme);
      return () => mediaQuery.removeEventListener("change", updateTheme);
    }
  }, [themeMode]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    Storage.set("themeMode", themeMode);
  }, [themeMode]);

  return (
    <UIContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        toast,
        showToast,
        clearToast,
        sidebarCollapsed,
        setSidebarCollapsed,
        selectedSheet,
        setSelectedSheet,
        showNotifications,
        setShowNotifications,
        shareCart,
        showShareCart,
        setShowShareCart,
        addToShareCart,
        removeFromShareCart,
        clearShareCart,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export default UIContext;
