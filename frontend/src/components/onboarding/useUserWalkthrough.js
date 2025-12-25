// ===== USE USER WALKTHROUGH =====
// Hook para controlar exibição do walkthrough de usuário

import { useState, useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useData } from '@contexts/DataContext';
import Storage from '@services/storage';
import { USER_WALKTHROUGH_STORAGE_KEY } from './walkthroughSteps';

export const useUserWalkthrough = () => {
  const { user } = useAuth();
  const { sheets, loading } = useData();
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughPending, setWalkthroughPending] = useState(false);

  useEffect(() => {
    const completed = Storage.get(USER_WALKTHROUGH_STORAGE_KEY, false);

    // Não mostra se não estiver autenticado
    if (!user) return;

    // Verifica se já completou
    if (completed) return;

    // Não mostra enquanto carrega
    if (loading) return;

    // Não mostra se não tiver partituras
    if (!sheets || sheets.length === 0) return;

    // Marca como pendente
    setWalkthroughPending(true);

    // Delay para garantir UI pronta
    const timer = setTimeout(() => {
      setShowWalkthrough(true);
      setWalkthroughPending(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      setWalkthroughPending(false);
    };
  }, [user, sheets, loading]);

  const completeWalkthrough = () => {
    Storage.set(USER_WALKTHROUGH_STORAGE_KEY, true);
    setShowWalkthrough(false);
  };

  return [showWalkthrough, setShowWalkthrough, walkthroughPending, completeWalkthrough];
};
