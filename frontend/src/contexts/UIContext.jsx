// ===== UI CONTEXT =====
// Gerencia tema, toast e estados de UI
// Separado para evitar re-renders quando dados mudam

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Storage from '@services/storage';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  // Tema
  const [themeMode, setThemeMode] = useState(() => Storage.get('themeMode', 'system'));

  // Calcula o tema efetivo
  const getEffectiveTheme = useCallback(() => {
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode]);

  const [theme, setTheme] = useState(getEffectiveTheme);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const clearToast = useCallback(() => setToast(null), []);

  // Estados de UI
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Carrinho de compartilhamento
  const [shareCart, setShareCart] = useState([]);
  const [showShareCart, setShowShareCart] = useState(false);

  const addToShareCart = useCallback((item) => {
    // Evita duplicatas (mesmo parteId)
    setShareCart(prev => {
      if (prev.some(i => i.parteId === item.parteId)) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const removeFromShareCart = useCallback((parteId) => {
    setShareCart(prev => prev.filter(i => i.parteId !== parteId));
  }, []);

  const clearShareCart = useCallback(() => {
    setShareCart([]);
  }, []);

  // Atualiza tema quando muda preferencia do sistema
  useEffect(() => {
    const updateTheme = () => setTheme(getEffectiveTheme());
    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [themeMode, getEffectiveTheme]);

  // Aplica tema ao documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persiste tema
  useEffect(() => {
    Storage.set('themeMode', themeMode);
  }, [themeMode]);

  return (
    <UIContext.Provider value={{
      theme,
      themeMode,
      setThemeMode,
      toast,
      showToast,
      clearToast,
      sidebarCollapsed,
      setSidebarCollapsed,
      selectedSheet,
      setSelectedSheet,
      showNotifications,
      setShowNotifications,
      shareCart,
      showShareCart,
      setShowShareCart,
      addToShareCart,
      removeFromShareCart,
      clearShareCart
    }}>
      {children}
    </UIContext.Provider>
  );
};

export default UIContext;
