"use client";

import { type ReactNode } from "react";
import { AuthProvider } from "@contexts/AuthContext";
import { DataProvider } from "@contexts/DataContext";
import { UIProvider } from "@contexts/UIContext";
import { NotificationProvider } from "@contexts/NotificationContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        <UIProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </UIProvider>
      </DataProvider>
    </AuthProvider>
  );
}
