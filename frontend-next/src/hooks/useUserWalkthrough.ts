"use client";

// ===== USE USER WALKTHROUGH =====
// Hook para controlar exibicao do walkthrough de usuario

import { useState, useEffect } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useData } from '@contexts/DataContext';
import Storage from '@lib/storage';
import { USER_WALKTHROUGH_STORAGE_KEY } from '@components/onboarding/walkthroughSteps';

interface UseUserWalkthroughReturn {
  showWalkthrough: boolean;
  setShowWalkthrough: (value: boolean) => void;
  walkthroughPending: boolean;
  completeWalkthrough: () => void;
}

export const useUserWalkthrough = (): UseUserWalkthroughReturn => {
  const { user } = useAuth();
  const { sheets } = useData();
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [walkthroughPending, setWalkthroughPending] = useState(false);
  const loading = sheets.length === 0;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const completed = Storage.get(USER_WALKTHROUGH_STORAGE_KEY, false);

    // Nao mostra se nao estiver autenticado
    if (!user) return;

    // Verifica se ja completou
    if (completed) return;

    // Nao mostra enquanto carrega
    if (loading) return;

    // Nao mostra se nao tiver partituras
    if (!sheets || sheets.length === 0) return;

    // Delay para garantir UI pronta
    const timer = setTimeout(() => {
      setShowWalkthrough(true);
    }, 1500);

    // Marca como pendente via microtask para evitar setState sincrono no effect
    queueMicrotask(() => setWalkthroughPending(true));

    return () => {
      clearTimeout(timer);
      setWalkthroughPending(false);
    };
  }, [user, sheets, loading]);

  const completeWalkthrough = () => {
    Storage.set(USER_WALKTHROUGH_STORAGE_KEY, true);
    setShowWalkthrough(false);
  };

  return { showWalkthrough, setShowWalkthrough, walkthroughPending, completeWalkthrough };
};
