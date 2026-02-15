"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useUI } from "@contexts/UIContext";
import { getNextRehearsal } from "@hooks/useNextRehearsal";
import { API } from "@lib/api";
import { useMediaQuery } from "@hooks/useMediaQuery";
import HeaderActions from "./HeaderActions";
import LogoBadge from "./LogoBadge";

interface HomeHeaderProps {
  userName: string;
  instrument: string;
  actions?: ReactNode;
}

const HomeHeader = ({ userName, instrument, actions }: HomeHeaderProps) => {
  const { theme } = useUI();
  const isDark = theme === "dark";
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [modoRecesso, setModoRecesso] = useState(false);

  useEffect(() => {
    API.getModoRecesso().then((res) => setModoRecesso(res.ativo));
  }, []);

  const renderRehearsalInfo = () => {
    if (modoRecesso) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px" }}>
          <div style={{
            background: "#D4AF37", color: "#3D1518", fontSize: "10px",
            fontFamily: "Outfit, sans-serif", fontWeight: "700",
            padding: "5px 10px", borderRadius: "8px",
            textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap",
          }}>
            EM RECESSO
          </div>
        </div>
      );
    }

    const rehearsalInfo = getNextRehearsal();
    if (rehearsalInfo.isNow) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px" }}>
          <div style={{
            width: "10px", height: "10px", borderRadius: "50%",
            background: "#22C55E", animation: "pulse 2s ease-in-out infinite",
          }} />
          <span style={{
            fontFamily: "Outfit, sans-serif", fontSize: "14px", fontWeight: "700", color: "#22C55E",
          }}>
            Ensaio acontecendo agora!
          </span>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px" }}>
        <span style={{
          fontFamily: "Outfit, sans-serif", fontSize: "13px", fontWeight: "700", color: "var(--text-muted)",
        }}>
          Proximo ensaio:
        </span>
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "rgba(212, 175, 55, 0.15)", padding: "4px 10px", borderRadius: "8px",
        }}>
          {rehearsalInfo.days !== undefined && rehearsalInfo.days > 0 && (
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "14px", fontWeight: "800", color: "#D4AF37" }}>
              {rehearsalInfo.days}d
            </span>
          )}
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "14px", fontWeight: "800", color: "#D4AF37" }}>
            {rehearsalInfo.hours}h{rehearsalInfo.minutes !== undefined && rehearsalInfo.minutes > 0 ? ` ${rehearsalInfo.minutes}m` : ""}
          </span>
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>
            ({rehearsalInfo.dayName})
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Header institucional - apenas mobile */}
      {!isDesktop && (
        <div style={{
          background: "linear-gradient(135deg, #722F37 0%, #5C1A1B 100%)",
          padding: "14px 20px 18px",
          paddingTop: "max(env(safe-area-inset-top), 14px)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <LogoBadge size={38} variant="dark" />
            <div>
              <h2 style={{
                fontFamily: "Outfit, sans-serif", fontSize: "14px", fontWeight: "700",
                color: "#F4E4BC", marginBottom: "1px", lineHeight: "1.2",
              }}>
                S.F. 25 de Março
              </h2>
              <p style={{
                fontFamily: "Outfit, sans-serif", fontSize: "9px", fontWeight: "600",
                color: "#D4AF37", letterSpacing: "1px", textTransform: "uppercase",
              }}>
                Acervo Digital
              </p>
            </div>
          </div>
          <HeaderActions inDarkHeader={true} />
        </div>
      )}

      {/* Header de saudacao */}
      <header style={{
        padding: isDesktop ? "20px 0 24px" : "16px 20px 20px",
        paddingTop: isDesktop ? "max(env(safe-area-inset-top), 20px)" : "16px",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px",
      }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: "Outfit, sans-serif", fontSize: "14px",
            color: isDark ? "rgba(255,255,255,0.7)" : "rgba(26,26,26,0.6)", marginBottom: "2px",
          }}>
            Ola,
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h1 style={{
              fontFamily: "Outfit, sans-serif", fontSize: "28px", fontWeight: "800",
              letterSpacing: "-0.5px", position: "relative", display: "inline-flex", alignItems: "center",
              color: isDark ? "#FFFFFF" : "#1a1a1a", margin: 0,
            }}>
              {userName}
              <span style={{ marginLeft: "4px", fontSize: "16px" }}>&#10024;</span>
            </h1>
            <div style={{
              background: "#D4AF37", color: "#3D1518", fontSize: "10px",
              fontFamily: "Outfit, sans-serif", fontWeight: "700",
              padding: "5px 10px", borderRadius: "8px",
              textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap",
            }}>
              {instrument}
            </div>
          </div>
          {!isDesktop && renderRehearsalInfo()}
        </div>
        {isDesktop && actions && <div style={{ display: "flex", gap: "10px" }}>{actions}</div>}
      </header>
    </>
  );
};

export default HomeHeader;
