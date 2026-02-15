"use client";

import { motion } from "motion/react";

interface Ensaio {
  data_ensaio: string;
  dia_semana?: string;
  usuario_presente: number;
  total_partituras?: number;
}

interface AttendanceCalendarProps {
  ensaios?: Ensaio[];
  onEnsaioClick?: (ensaio: Ensaio) => void;
}

const AttendanceCalendar = ({
  ensaios = [],
  onEnsaioClick,
}: AttendanceCalendarProps) => {
  if (!ensaios || ensaios.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          background: "var(--bg-card)",
          borderRadius: "12px",
          padding: "16px",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "32px 16px",
            color: "var(--text-muted)",
            fontSize: "14px",
            fontFamily: "var(--font-sans)",
          }}
        >
          Nenhum ensaio registrado ainda
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div
      style={{
        flex: 1,
        background: "var(--bg-card)",
        borderRadius: "12px",
        padding: "16px",
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          fontWeight: "700",
          color: "var(--text-primary)",
          marginBottom: "16px",
        }}
      >
        \u00DAltimos ensaios
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(55px, 1fr))",
          gap: "10px",
        }}
      >
        {ensaios.map((ensaio) => {
          const data = new Date(ensaio.data_ensaio + "T00:00:00Z");
          const dia = data.getDate();
          const diaSemana =
            ensaio.dia_semana ||
            data.toLocaleDateString("pt-BR", { weekday: "short" });
          const presente = ensaio.usuario_presente === 1;
          const totalPartituras = ensaio.total_partituras || 0;

          return (
            <motion.button
              key={ensaio.data_ensaio}
              variants={itemVariants}
              onClick={() => onEnsaioClick?.(ensaio)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                padding: "12px 8px",
                borderRadius: "12px",
                cursor: "pointer",
                position: "relative",
                minHeight: "70px",
                border: "none",
                background: presente
                  ? "rgba(67, 185, 127, 0.1)"
                  : "rgba(150, 150, 150, 0.08)",
                borderBottom: presente
                  ? "2px solid #43B97F"
                  : "2px solid transparent",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: presente ? "#43B97F" : "var(--text-muted)",
                }}
              >
                {presente ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>

              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  lineHeight: 1,
                }}
              >
                {dia}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  fontWeight: "500",
                  color: "var(--text-muted)",
                  textTransform: "capitalize",
                }}
              >
                {diaSemana.slice(0, 3)}
              </div>

              {totalPartituras > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "rgba(212, 175, 55, 0.2)",
                    color: "#D4AF37",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-sans)",
                    fontSize: "9px",
                    fontWeight: "700",
                  }}
                >
                  {totalPartituras}
                </div>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AttendanceCalendar;
