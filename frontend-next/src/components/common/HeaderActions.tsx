"use client";

import { useUI } from "@contexts/UIContext";
import { useNotifications } from "@contexts/NotificationContext";
import { Icons } from "@constants/icons";
import { useMediaQuery } from "@hooks/useMediaQuery";
import ThemeSelector from "./ThemeSelector";
import AdminToggle from "./AdminToggle";

interface HeaderActionsProps {
  inDarkHeader?: boolean;
}

const HeaderActions = ({ inDarkHeader = false }: HeaderActionsProps) => {
  const { setShowNotifications } = useUI();
  const { unreadCount } = useNotifications();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) return null;

  const darkHeaderStyles = {
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#F4E4BC",
  };

  const normalStyles = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
  };

  const buttonStyles = inDarkHeader ? darkHeaderStyles : normalStyles;

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <ThemeSelector inDarkHeader={inDarkHeader} compact />
      <button
        className="btn-hover"
        onClick={() => setShowNotifications(true)}
        aria-label={unreadCount > 0 ? `Notificações (${unreadCount} não lidas)` : "Notificações"}
        style={{
          width: "36px", height: "36px", borderRadius: "10px",
          ...buttonStyles,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
        }}
      >
        <div style={{ width: "18px", height: "18px" }}><Icons.Bell /></div>
        {unreadCount > 0 && (
          <div style={{
            position: "absolute", top: "-4px", right: "-4px",
            minWidth: "16px", height: "16px", padding: "0 4px",
            borderRadius: "8px", background: "#E74C3C", color: "#fff",
            fontSize: "10px", fontWeight: "700", fontFamily: "var(--font-sans)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </button>
      <AdminToggle />
    </div>
  );
};

export default HeaderActions;
