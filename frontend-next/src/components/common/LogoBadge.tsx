"use client";

import type { CSSProperties } from "react";

const VARIANTS = {
  dark: {
    background: "rgba(244, 228, 188, 0.15)",
    border: "2px solid rgba(244, 228, 188, 0.3)",
  },
  light: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
  },
} as const;

interface LogoBadgeProps {
  size?: number;
  variant?: keyof typeof VARIANTS;
  style?: CSSProperties;
}

const LogoBadge = ({ size = 38, variant = "dark", style = {} }: LogoBadgeProps) => {
  const v = VARIANTS[variant] || VARIANTS.dark;

  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: "50%",
      background: v.background, border: v.border,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, overflow: "hidden",
      padding: `${Math.round(size * 0.1)}px`, ...style
    }}>
      <img
        src="/assets/images/ui/brasao-256x256.png"
        alt="Brasao Filarmonica 25 de Marco"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

export default LogoBadge;
