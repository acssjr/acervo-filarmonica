"use client";

// ===== STAT CARD =====
// Card de estatistica para o dashboard

import { useMediaQuery } from "@hooks/useMediaQuery";

interface StatCardProps {
  icon: "users" | "music" | "download" | "folder";
  label: string;
  value: number | string;
  color: string;
  loading: boolean;
}

interface StatIconProps {
  type: string;
  iconColor: string;
}

const StatIcon = ({ type, iconColor }: StatIconProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const size = isMobile ? 18 : 22;
  const icons: Record<string, React.ReactNode> = {
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    music: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    download: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    folder: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  };
  return <>{icons[type] || icons.music}</>;
};

const StatCard = ({ icon, label, value, color, loading }: StatCardProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className="card-hover" style={{
      background: "var(--bg-secondary)",
      borderRadius: "16px",
      padding: isMobile ? "12px" : "16px",
      textAlign: "center",
      border: "1px solid var(--border)",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{ marginBottom: isMobile ? "8px" : "10px", display: "flex", justifyContent: "center" }}>
        <div style={{
          width: isMobile ? "36px" : "44px",
          height: isMobile ? "36px" : "44px",
          borderRadius: isMobile ? "8px" : "10px",
          background: `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <StatIcon type={icon} iconColor={color} />
        </div>
      </div>
      <div style={{
        fontSize: isMobile ? "22px" : "28px",
        fontWeight: "700",
        color: color || "var(--text-primary)",
        marginBottom: "2px",
        fontFamily: "var(--font-sans)",
      }}>
        {loading ? "..." : value}
      </div>
      <div style={{
        fontSize: isMobile ? "11px" : "12px",
        color: "var(--text-secondary)",
        fontFamily: "var(--font-sans)",
      }}>
        {label}
      </div>
    </div>
  );
};

export default StatCard;
