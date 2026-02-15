"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@contexts/AuthContext";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { BREAKPOINTS } from "@constants/config";
import DesktopLayout from "@components/layout/DesktopLayout";
import BottomNav from "@components/layout/BottomNav";

// SSR-safe hydration guard: returns false on server, true after mount
const emptySubscribe = () => () => {};
function useHasMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

// Map pathname to tab ID for navigation highlighting
function getActiveTab(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/repertorio")) return "repertorio";
  if (pathname.startsWith("/buscar")) return "search";
  if (pathname.startsWith("/favoritos")) return "favorites";
  if (pathname.startsWith("/perfil")) return "profile";
  if (pathname.startsWith("/acervo")) return "library";
  if (pathname.startsWith("/generos")) return "genres";
  if (pathname.startsWith("/compositores")) return "composers";
  if (pathname.startsWith("/admin")) return "admin";
  return "home";
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.desktop}px)`);
  const mounted = useHasMounted();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (mounted && !user) {
      router.replace("/login");
    }
  }, [user, mounted, router]);

  // Show nothing while checking auth or before mount
  if (!mounted) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "var(--bg-primary)",
      }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--primary)",
          animation: "spin 0.8s linear infinite",
        }} />
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!user) {
    return null;
  }

  const activeTab = getActiveTab(pathname);

  return (
    <>
      <DesktopLayout activeTab={activeTab}>
        <div style={{ paddingBottom: isDesktop ? "0" : "100px" }}>
          {children}
        </div>
      </DesktopLayout>
      {!isDesktop && <BottomNav activeTab={activeTab} />}
    </>
  );
}
