// ===== USER WALKTHROUGH =====
// Walkthrough guiado para usuários na primeira vez

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import { useMediaQuery } from '@hooks/useMediaQuery';
import TutorialOverlay from './TutorialOverlay';
import {
  MOBILE_WALKTHROUGH_STEPS,
  DESKTOP_WALKTHROUGH_STEPS,
  USER_WALKTHROUGH_STORAGE_KEY
} from './walkthroughSteps';

const UserWalkthrough = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setSelectedSheet } = useUI();
  const { sheets } = useData();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const [modalOpen, setModalOpen] = useState(false);

  // Seleciona os passos corretos baseado no dispositivo
  const steps = useMemo(() => {
    return isMobile ? MOBILE_WALKTHROUGH_STEPS : DESKTOP_WALKTHROUGH_STEPS;
  }, [isMobile]);

  // Handler para mudança de passo
  const handleStepChange = useCallback((stepIndex, step) => {
    // Ação: abrir modal
    if (step.action === 'openModal' && sheets.length > 0) {
      // Pega a primeira partitura das populares (que aparecem na Home)
      const popularSheets = [...sheets].sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      const firstSheet = popularSheets[0];
      if (firstSheet) {
        setSelectedSheet(firstSheet);
        navigate(`/acervo/${firstSheet.category}/${firstSheet.id}`, { replace: true });
        setModalOpen(true);
      }
    }

    // Ação: fechar modal
    if (step.action === 'closeModal') {
      setSelectedSheet(null);
      navigate('/', { replace: true });
      setModalOpen(false);
    }
  }, [sheets, setSelectedSheet, navigate]);

  // Limpa modal ao fechar walkthrough
  useEffect(() => {
    if (!isOpen && modalOpen) {
      setSelectedSheet(null);
      navigate('/', { replace: true });
      setModalOpen(false);
    }
  }, [isOpen, modalOpen, setSelectedSheet, navigate]);

  const handleClose = useCallback(() => {
    if (modalOpen) {
      setSelectedSheet(null);
      navigate('/', { replace: true });
      setModalOpen(false);
    }
    onClose();
  }, [onClose, setSelectedSheet, navigate, modalOpen]);

  return (
    <TutorialOverlay
      isOpen={isOpen}
      onClose={handleClose}
      steps={steps}
      storageKey={USER_WALKTHROUGH_STORAGE_KEY}
      onStepChange={handleStepChange}
      finalButtonText="Começar a explorar!"
      allowMobile={true}
    />
  );
};

export default UserWalkthrough;
