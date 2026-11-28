// ===== AUTH CONTEXT =====
// Gerencia autenticacao do usuario
// Separado para evitar re-renders desnecessarios em outros componentes

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Storage from '@services/storage';
import { API, USE_API } from '@services/api';
import { identifyPostHogUser, resetPostHogUser } from '@services/posthog';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children, onTokenExpired }) => {
  const [user, setUser] = useState(() => {
    if (USE_API && (!Storage.get('authToken', null) || API.isTokenExpired())) return null;
    return Storage.get('user', null);
  });

  // Funcao de logout
  const logout = useCallback(async () => {
    await API.logout();
    await resetPostHogUser();
    setUser(null);
    Storage.remove('user');
    Storage.remove('favorites');
    Storage.remove('authToken');
  }, []);

  // Registra callback para expiracao de token
  useEffect(() => {
    API.setOnTokenExpired(() => {
      setUser(null);
      Storage.remove('favorites');
      void resetPostHogUser();
      onTokenExpired?.();
    });

    return () => {
      API.setOnTokenExpired(null);
    };
  }, [onTokenExpired]);

  // Verifica token ao iniciar
  useEffect(() => {
    if (USE_API && API.isTokenExpired()) {
      API.clearAuth();
    }
  }, []);

  // Persiste usuario
  useEffect(() => {
    Storage.set('user', user);
    if (user) void identifyPostHogUser(user);
  }, [user]);

  // Nome que o sistema usa para chamar o usuário (nome_exibicao se definido, senão nome)
  const displayName = user?.nome_exibicao || user?.name || user?.nome || '';

  return (
    <AuthContext.Provider value={{ user, setUser, logout, displayName }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
