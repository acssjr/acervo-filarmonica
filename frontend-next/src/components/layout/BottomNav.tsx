"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useUI } from "@contexts/UIContext";
import { Icons } from "@constants/icons";

interface BottomNavProps {
  activeTab: string;
}

const BottomNav = ({ activeTab }: BottomNavProps) => {
  const router = useRouter();
  const { theme, showNotifications } = useUI();
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const isMobile = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  const isHiding = showNotifications && isMobile;

  useEffect(() => {
    if (!isMobile) return;
    const initialHeight = window.innerHeight;
    const handleResize = () => {
      const heightDiff = initialHeight - (window.visualViewport?.height ?? window.innerHeight);
      setKeyboardOpen(heightDiff > 150);
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      return () => window.visualViewport?.removeEventListener("resize", handleResize);
    } else {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isMobile]);

  const tabs = [
    { id: "home", path: "/", icon: Icons.Home, label: "Início" },
    { id: "repertorio", path: "/repertorio", icon: Icons.ListMusic, label: "Repertório" },
    { id: "search", path: "/buscar", icon: Icons.Search, label: "Buscar", isCenter: true },
    { id: "favorites", path: "/favoritos", icon: Icons.Heart, label: "Favoritos" },
    { id: "profile", path: "/perfil", icon: Icons.User, label: "Perfil" },
  ];

  const isDark = theme === "dark";
  const shouldHide = isHiding || keyboardOpen;

  return (
    <nav className="mobile-only" style={{ position: 'fixed', bottom: '16px', left: '50%', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '12px 8px', zIndex: 999, width: 'calc(100% - 32px)', maxWidth: '420px', borderRadius: '28px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), inset 0 0.5px 0 rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.08)', transition: 'transform 0.3s ease, opacity 0.3s ease', background: isDark ? 'rgba(72, 20, 21, 0.85)' : 'rgba(92, 26, 27, 0.88)', transform: shouldHide ? 'translateX(-50%) translateY(100px)' : 'translateX(-50%) translateY(0)', opacity: shouldHide ? 0 : 1, pointerEvents: shouldHide ? 'none' : 'auto' }}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        if (tab.isCenter) {
          return (
            <motion.button key={tab.id} data-walkthrough="search" aria-label={tab.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, #D4AF37 0%, #AA8C2C 100%)', border: 'none', color: '#3D1518', cursor: 'pointer', width: '62px', height: '62px', borderRadius: '50%', boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)', flexShrink: 0 }} onClick={() => router.push(tab.path)} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <div style={{ width: '28px', height: '28px' }}><tab.icon filled /></div>
            </motion.button>
          );
        }
        return (
          <motion.button key={tab.id} data-nav={tab.id} aria-label={tab.label} aria-current={isActive ? "page" : undefined} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', borderRadius: '12px', minWidth: '56px', position: 'relative', boxSizing: 'border-box', color: isActive ? '#F4E4BC' : 'rgba(255, 255, 255, 0.7)' }} onClick={() => router.push(tab.path)} whileTap={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            {isActive && <motion.div layoutId="bottomNavIndicator" style={{ position: 'absolute', inset: 0, background: 'rgba(244, 228, 188, 0.15)', borderRadius: '12px', zIndex: 0 }} transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
            <motion.div style={{ width: '22px', height: '22px', position: 'relative', zIndex: 1 }} animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -2 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <tab.icon filled={isActive} />
            </motion.div>
            <motion.span style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.2px', position: 'relative', zIndex: 1 }} animate={{ opacity: isActive ? 1 : 0.7, scale: isActive ? 1.05 : 1 }} transition={{ duration: 0.2 }}>
              {tab.label}
            </motion.span>
          </motion.button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
