"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "@contexts/AuthContext";
import { API } from "@lib/api";
import StreakBar from "./StreakBar";
import AttendanceCalendar from "./AttendanceCalendar";
import EnsaioDetailModal from "./EnsaioDetailModal";

interface Ensaio {
  data_ensaio: string;
  dia_semana?: string;
  usuario_presente: number;
  total_partituras?: number;
}

interface PresencaData {
  streak?: number;
  percentual_frequencia?: number;
  ultimos_ensaios?: Ensaio[];
}

const SkeletonLoader = () => (
  <div style={{ display: "flex", gap: "20px" }}>
    <div
      style={{
        width: "80px",
        height: "300px",
        background:
          "linear-gradient(90deg, var(--bg-card) 0%, rgba(255,255,255,0.05) 50%, var(--bg-card) 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        borderRadius: "16px",
      }}
    />
    <div
      style={{
        flex: 1,
        height: "300px",
        background:
          "linear-gradient(90deg, var(--bg-card) 0%, rgba(255,255,255,0.05) 50%, var(--bg-card) 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        borderRadius: "12px",
      }}
    />
  </div>
);

const PresenceStats = () => {
  const { user } = useAuth();
  const [presencaData, setPresencaData] = useState<PresencaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnsaio, setSelectedEnsaio] = useState<Ensaio | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchPresenca = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await API.getMinhaPresenca();
        setPresencaData(data);
      } catch (err: unknown) {
        console.error("Erro ao buscar presen\u00e7a:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    fetchPresenca();
  }, [user]);

  const handleEnsaioClick = (ensaio: Ensaio) => {
    setSelectedEnsaio(ensaio);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedEnsaio(null), 300);
  };

  if (!user) return null;
  if (loading) return <SkeletonLoader />;
  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "32px 16px",
          color: "var(--text-muted)",
          fontSize: "14px",
          fontFamily: "'Outfit', sans-serif",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
        }}
      >
        <p style={{ margin: 0 }}>Erro ao carregar dados de presen\u00e7a</p>
      </div>
    );
  }
  if (!presencaData) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: "flex", gap: "20px", alignItems: "stretch" }}
      >
        <StreakBar
          streak={presencaData.streak || 0}
          percentual={presencaData.percentual_frequencia || 0}
        />
        <AttendanceCalendar
          ensaios={presencaData.ultimos_ensaios || []}
          onEnsaioClick={handleEnsaioClick}
        />
      </motion.div>

      <EnsaioDetailModal
        ensaio={selectedEnsaio}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default PresenceStats;
