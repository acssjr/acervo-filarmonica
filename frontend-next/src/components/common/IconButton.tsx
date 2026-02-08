"use client";

import type { CSSProperties, ReactNode } from "react";
import type { IconProps } from "@constants/icons";

interface IconButtonProps {
  icon: (props?: IconProps) => ReactNode;
  onClick?: () => void;
  primary?: boolean;
  style?: CSSProperties;
  ariaLabel?: string;
}

const IconButton = ({ icon: Icon, onClick, primary, style, ariaLabel }: IconButtonProps) => (
  <button
    className="btn-hover"
    aria-label={ariaLabel}
    style={{
      width: "44px", height: "44px", borderRadius: "var(--radius-sm)",
      background: primary ? "var(--primary)" : "var(--bg-card)",
      border: primary ? "none" : "1px solid var(--border)",
      color: primary ? "#fff" : "var(--text-primary)",
      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", ...style
    }}
    onClick={onClick}
  >
    <div style={{ width: "20px", height: "20px" }}><Icon /></div>
  </button>
);

export default IconButton;
