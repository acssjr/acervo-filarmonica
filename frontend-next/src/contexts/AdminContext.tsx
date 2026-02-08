"use client";

import { createContext, useContext } from "react";

interface AdminStats {
  musicos_ativos?: number;
  total_partituras?: number;
  total_downloads?: number;
  total_categorias?: number;
  top_partituras?: Array<{
    id: number;
    titulo: string;
    compositor: string;
    downloads: number;
  }>;
  [key: string]: unknown;
}

interface AdminContextType {
  stats: AdminStats;
  loading: boolean;
  activeSection: string;
  navigateToSection: (section: string) => void;
  refreshStats: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};

export default AdminContext;
