"use client";

import { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useUI } from "@contexts/UIContext";
import { Icons } from "@constants/icons";
import CategoryIcon from "@components/common/CategoryIcon";

interface FileCardProps {
  sheet: { id: string; title: string; composer: string; category: string; downloads?: number; featured?: boolean };
  category?: { id: string; name: string };
  isFavorite: boolean;
  onToggleFavorite?: () => void;
  index?: number;
}

const FileCard = memo(({ sheet, category, isFavorite, onToggleFavorite, index = 0 }: FileCardProps) => {
  const router = useRouter();
  const { setSelectedSheet } = useUI();

  const handleCardClick = useCallback(() => {
    setSelectedSheet(sheet);
    router.push(`/acervo/${sheet.category}/${sheet.id}`);
  }, [sheet, setSelectedSheet, router]);

  const handleDownloadClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSheet(sheet);
    router.push(`/acervo/${sheet.category}/${sheet.id}`);
  }, [sheet, setSelectedSheet, router]);

  return (
    <motion.div
      data-walkthrough="sheet-card"
      className="file-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'var(--bg-card)', borderRadius: 'var(--radius)', cursor: 'pointer', border: '1px solid var(--border)' }}
    >
      <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(145deg, #3a3a4a 0%, #2a2a38 100%)', border: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <CategoryIcon categoryId={category?.id ?? ""} size={24} color="#D4AF37" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{sheet.title}</h4>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{sheet.composer}</p>
      </div>

      <button
        data-walkthrough="favorite-btn"
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: isFavorite ? 'rgba(232, 90, 79, 0.1)' : 'transparent', color: isFavorite ? 'var(--primary)' : 'var(--text-muted)' }}
        onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
      >
        <div style={{ width: '16px', height: '16px' }}><Icons.Heart filled={isFavorite} /></div>
      </button>

      <button
        aria-label={`Baixar partitura ${sheet.title}`}
        title="Baixar partitura"
        style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent', color: 'var(--primary)' }}
        onClick={handleDownloadClick}
      >
        <div style={{ width: '18px', height: '18px' }}><Icons.Download /></div>
      </button>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.sheet.id === nextProps.sheet.id &&
    prevProps.isFavorite === nextProps.isFavorite &&
    prevProps.category?.id === nextProps.category?.id &&
    prevProps.index === nextProps.index
  );
});

FileCard.displayName = "FileCard";

export default FileCard;
