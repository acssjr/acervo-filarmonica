// ===== AUTH CONTEXT =====
// Gerencia autenticacao do usuario
// Separado para evitar re-renders desnecessarios em outros componentes

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Storage from '@services/storage';
import { API, USE_API } from '@services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children, onTokenExpired }) => {
  const [user, setUser] = useState(() => Storage.get('user', null));

  // Funcao de logout
  const logout = useCallback(() => {
    API.logout();
    setUser(null);
    Storage.remove('user');
    Storage.remove('favorites');
    Storage.remove('authToken');
  }, []);

  // Registra callback para expiracao de token
  useEffect(() => {
    API.setOnTokenExpired(() => {
      logout();
      if (onTokenExpired) {
        onTokenExpired();
      }
    });

    return () => {
      API.setOnTokenExpired(null);
    };
  }, [logout, onTokenExpired]);

  // Verifica token ao iniciar
  useEffect(() => {
    if (USE_API && API.isTokenExpired()) {
      logout();
    }
  }, [logout]);

  // Persiste usuario
  useEffect(() => {
    Storage.set('user', user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
