"use client";

import type { ReactNode } from "react";
import { Icons } from "@constants/icons";
import IconButton from "./IconButton";
import useAnimatedVisibility from "@hooks/useAnimatedVisibility";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const { shouldRender, isExiting } = useAnimatedVisibility(isOpen, 200);

  if (!shouldRender) return null;

  const backdropAnimation = isExiting
    ? "modalBackdropOut 0.2s ease forwards"
    : "modalBackdropIn 0.2s ease";

  const contentAnimation = isExiting
    ? "slideDownModal 0.2s ease forwards"
    : "slideUpModal 0.3s ease";

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-end", zIndex: 2000, animation: backdropAnimation,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-secondary)",
          borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
          width: "100%", maxWidth: "430px", maxHeight: "85vh", overflow: "auto",
          margin: "0 auto", animation: contentAnimation,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: "36px", height: "4px", background: "var(--border)", borderRadius: "2px", margin: "10px auto" }} />
        <div style={{ padding: "0 20px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "Outfit, sans-serif", fontSize: "20px", fontWeight: "700" }}>{title}</h2>
            <IconButton icon={Icons.Close} onClick={onClose} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
