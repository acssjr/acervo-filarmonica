"use client";

// ===== USER WALKTHROUGH =====
// Walkthrough guiado para usuarios na primeira vez

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { useMediaQuery } from '@hooks/useMediaQuery';
import TutorialOverlay from './TutorialOverlay';
import type { TutorialStep } from './TutorialOverlay';
import {
  MOBILE_WALKTHROUGH_STEPS,
  DESKTOP_WALKTHROUGH_STEPS,
  USER_WALKTHROUGH_STORAGE_KEY
} from './walkthroughSteps';

interface UserWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserWalkthrough = ({ isOpen, onClose }: UserWalkthroughProps) => {
  const router = useRouter();
  const { setSelectedSheet } = useUI();
  const { sheets } = useData();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const [modalOpen, setModalOpen] = useState(false);

  // Seleciona os passos corretos baseado no dispositivo
  const steps = useMemo(() => {
    return isMobile ? MOBILE_WALKTHROUGH_STEPS : DESKTOP_WALKTHROUGH_STEPS;
  }, [isMobile]);

  // Handler para mudanca de passo
  const handleStepChange = useCallback((stepIndex: number, step: TutorialStep) => {
    // Acao: abrir modal
    if (step.action === 'openModal' && sheets.length > 0) {
      // Pega a primeira partitura das populares (que aparecem na Home)
      const popularSheets = [...sheets].sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      const firstSheet = popularSheets[0];
      if (firstSheet) {
        setSelectedSheet(firstSheet);
        router.replace(`/acervo/${firstSheet.category}/${firstSheet.id}`);
        setModalOpen(true);
      }
    }

    // Acao: fechar modal
    if (step.action === 'closeModal') {
      setSelectedSheet(null);
      router.replace('/');
      setModalOpen(false);
    }
  }, [sheets, setSelectedSheet, router]);

  // Limpa modal ao fechar walkthrough
  useEffect(() => {
    if (!isOpen && modalOpen) {
      setSelectedSheet(null);
      router.replace('/');
      queueMicrotask(() => setModalOpen(false));
    }
  }, [isOpen, modalOpen, setSelectedSheet, router]);

  const handleClose = useCallback(() => {
    if (modalOpen) {
      setSelectedSheet(null);
      router.replace('/');
      setModalOpen(false);
    }
    onClose();
  }, [onClose, setSelectedSheet, router, modalOpen]);

  return (
    <TutorialOverlay
      isOpen={isOpen}
      onClose={handleClose}
      steps={steps}
      storageKey={USER_WALKTHROUGH_STORAGE_KEY}
      onStepChange={handleStepChange}
      finalButtonText="Comecar a explorar!"
      allowMobile={true}
    />
  );
};

export default UserWalkthrough;
