"use client";

import { useUI } from "@contexts/UIContext";
import { Icons } from "@constants/icons";
import { useMediaQuery } from "@hooks/useMediaQuery";
import useAnimatedVisibility from "@hooks/useAnimatedVisibility";

const ShareCartFAB = () => {
  const { shareCart, setShowShareCart } = useUI();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { shouldRender, isExiting } = useAnimatedVisibility(shareCart.length > 0, 200);

  if (!shouldRender) return null;

  return (
    <button
      onClick={() => setShowShareCart(true)}
      aria-label={`Carrinho de compartilhamento: ${shareCart.length} itens`}
      style={{
        position: "fixed",
        bottom: isMobile ? "100px" : "90px",
        right: "20px", width: "56px", height: "56px", borderRadius: "50%",
        background: "linear-gradient(145deg, #25D366 0%, #128C7E 100%)",
        border: "none", boxShadow: "0 4px 16px rgba(37, 211, 102, 0.4)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 998,
        animation: isExiting
          ? "slideDownFAB 0.2s ease forwards"
          : "slideUpFAB 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div style={{ width: "24px", height: "24px", color: "#FFFFFF" }}>
        <Icons.Share />
      </div>
      <div style={{
        position: "absolute", top: "-4px", right: "-4px",
        minWidth: "22px", height: "22px", borderRadius: "11px",
        background: "var(--primary)", color: "#FFFFFF",
        fontSize: "12px", fontWeight: "700", fontFamily: "Outfit, sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 6px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      }}>
        {shareCart.length}
      </div>
    </button>
  );
};

export default ShareCartFAB;
