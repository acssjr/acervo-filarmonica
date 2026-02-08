"use client";

import type { ReactNode } from "react";
import { Icons } from "@constants/icons";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: ReactNode;
}

const Header = ({ title, subtitle, showBack, onBack, actions }: HeaderProps) => (
  <header style={{
    padding: "16px 20px",
    paddingTop: "max(env(safe-area-inset-top), 16px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      {showBack && (
        <button
          className="btn-hover"
          onClick={onBack}
          style={{
            width: "40px", height: "40px", borderRadius: "var(--radius-sm)",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            color: "var(--text-primary)",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
        >
          <div style={{ width: "20px", height: "20px" }}><Icons.Back /></div>
        </button>
      )}
      <div>
        <h1 style={{
          fontFamily: "Outfit, sans-serif",
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: "var(--text-primary)",
          fontSize: subtitle ? "28px" : "26px",
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "2px" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {actions && <div style={{ display: "flex", gap: "10px" }}>{actions}</div>}
  </header>
);

export default Header;
