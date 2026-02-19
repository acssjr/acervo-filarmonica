"use client";

import type { ReactNode } from "react";
import type { IconProps } from "@constants/icons";

const SIZES = {
  small: { icon: 48, title: 14, subtitle: 12, padding: "30px 20px", iconOpacity: 0.4 },
  default: { icon: 64, title: 15, subtitle: 13, padding: "60px 40px", iconOpacity: 0.3 },
  large: { icon: 80, title: 16, subtitle: 14, padding: "80px 40px", iconOpacity: 0.2 },
} as const;

interface EmptyStateProps {
  icon?: (props?: IconProps) => ReactNode;
  title?: string;
  subtitle?: string;
  size?: keyof typeof SIZES;
}

const EmptyState = ({ icon: Icon, title, subtitle, size = "default" }: EmptyStateProps) => {
  const s = SIZES[size] || SIZES.default;

  return (
    <div style={{
      textAlign: "center", padding: s.padding,
      color: "var(--text-muted)", animation: "fadeIn 0.3s ease"
    }}>
      {Icon && (
        <div style={{
          width: `${s.icon}px`, height: `${s.icon}px`,
          margin: "0 auto 16px", opacity: s.iconOpacity, color: "var(--primary)"
        }}>
          <Icon />
        </div>
      )}
      {title && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: `${s.title}px`, marginBottom: subtitle ? "8px" : 0 }}>
          {title}
        </p>
      )}
      {subtitle && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: `${s.subtitle}px`, opacity: 0.7 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
