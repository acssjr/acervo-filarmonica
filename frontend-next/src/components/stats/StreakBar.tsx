"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

interface StreakBarProps {
  streak?: number;
  percentual?: number;
}

const StreakBar = ({ streak = 0, percentual = 0 }: StreakBarProps) => {
  const [count, setCount] = useState(0);
  const prevStreakRef = useRef(streak);

  useEffect(() => {
    prevStreakRef.current = streak;
  });

  useEffect(() => {
    if (streak === 0) return;
    const duration = 1000;
    const steps = 30;
    const increment = streak / steps;
    const interval = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= streak) {
        setCount(streak);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [streak]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "relative",
        width: "80px",
        background:
          "linear-gradient(145deg, #722F37 0%, #5C1A1B 50%, #3D1011 100%)",
        borderRadius: "16px",
        padding: "20px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        overflow: "hidden",
        border: "2px solid transparent",
        backgroundClip: "padding-box",
      }}
    >
      {/* Animated golden border via pseudo-element simulation */}
      <div
        style={{
          position: "absolute",
          inset: "-2px",
          borderRadius: "16px",
          padding: "2px",
          background:
            "linear-gradient(145deg, #D4AF37, #F4E4BC, #D4AF37)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: "borderGlow 2s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "48px",
          fontWeight: "800",
          background:
            "linear-gradient(145deg, #D4AF37 0%, #F4E4BC 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1,
          filter: "drop-shadow(0 2px 8px rgba(212, 175, 55, 0.3))",
        }}
      >
        {count}
      </div>

      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "11px",
          fontWeight: "600",
          color: "rgba(255, 255, 255, 0.7)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          textAlign: "center",
        }}
      >
        Sequ\u00eancia
      </div>

      <div
        style={{
          flex: 1,
          width: "6px",
          borderRadius: "3px",
          background: "rgba(255, 255, 255, 0.1)",
          position: "relative",
          overflow: "hidden",
          minHeight: "60px",
        }}
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${Math.min(percentual, 100)}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            borderRadius: "3px",
            background: "linear-gradient(to top, #D4AF37, #F4E4BC)",
          }}
        />
      </div>

      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M12 2C10 6 9 9 9 12C9 15.31 11.69 18 15 18C15.34 18 15.67 17.97 16 17.92C15.38 19.73 13.82 21 12 21C9.24 21 7 18.76 7 16C7 13 8 10 12 2Z"
          fill="url(#fireGradient)"
        />
        <defs>
          <linearGradient
            id="fireGradient"
            x1="7"
            y1="2"
            x2="16"
            y2="21"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F4E4BC" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default StreakBar;
