"use client";

// ===== USE LOGIN FORM HOOK =====
// Hook com toda a logica de autenticacao do login

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import Storage from '@lib/storage';
import { API, USE_API } from '@lib/api';
import { API_BASE_URL } from '@constants/api';

interface UseLoginFormOptions {
  onClose?: () => void;
}

interface UserInfo {
  name: string;
  instrument: string;
}

const useLoginForm = ({ onClose }: UseLoginFormOptions) => {
  const router = useRouter();
  const { setUser } = useAuth();
  const { showToast } = useUI();
  const { setFavorites } = useData();

  // Estados do formulario
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [rememberMe, setRememberMe] = useState<boolean>(() => Storage.get<boolean>('rememberMe', false));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userFound, setUserFound] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Refs
  const pinRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const checkUserTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll suave para o card quando teclado abre (mobile)
  const scrollToCard = useCallback(() => {
    if (cardRef.current && window.innerWidth < 768) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, []);

  // Funcao para verificar usuario na API
  const checkUserExists = useCallback(async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck.length < 2) {
      setUserFound(false);
      setUserNotFound(false);
      setUserInfo(null);
      return;
    }

    setCheckingUser(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/check-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameToCheck })
      });
      const data = await response.json();

      if (data.exists) {
        setUserFound(true);
        setUserNotFound(false);
        setUserInfo({ name: data.nome, instrument: data.instrumento });
        setTimeout(() => pinRefs.current[0]?.focus(), 100);
      } else {
        setUserFound(false);
        setUserNotFound(true);
        setUserInfo(null);
      }
    } catch (e) {
      console.error('Erro ao verificar usuario:', e);
      setUserFound(false);
      setUserNotFound(false);
      setUserInfo(null);
    } finally {
      setCheckingUser(false);
    }
  }, []);

  // Carrega usuario salvo se "Lembrar-me" estava ativo
  useEffect(() => {
    if (rememberMe) {
      const savedUsername = Storage.get<string>('savedUsername', '');
      if (savedUsername) {
        setUsername(savedUsername);
        checkUserExists(savedUsername);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- executa apenas na montagem
  }, []);

  // Verifica se usuario existe quando digita (com debounce reduzido)
  const handleUsernameChange = useCallback((value: string) => {
    const normalized = value.toLowerCase().replace(/\s/g, '');
    setUsername(normalized);
    setError('');

    if (checkUserTimeout.current) {
      clearTimeout(checkUserTimeout.current);
    }

    if (!normalized || normalized.length < 2) {
      setUserFound(false);
      setUserNotFound(false);
      setUserInfo(null);
      setCheckingUser(false);
      return;
    }

    // Inicia loading imediatamente ao digitar
    setCheckingUser(true);

    // Debounce reduzido para 150ms
    checkUserTimeout.current = setTimeout(() => {
      checkUserExists(normalized);
    }, 150);
  }, [checkUserExists]);

  // Handler do PIN - autologin quando completo
  const handlePinChange = useCallback(async (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }

    // Verifica se completou o PIN - AUTOLOGIN
    if (value && index === 3) {
      const fullPin = newPin.join('');
      const normalizedUsername = username.toLowerCase().replace(/\s/g, '');

      if (!normalizedUsername) {
        setError('Digite seu usuario');
        setPin(['', '', '', '']);
        return;
      }

      setIsLoading(true);

      try {
        if (USE_API) {
          const result = await API.login(normalizedUsername, fullPin, rememberMe);

          if (result.success && result.user) {
            Storage.set('rememberMe', rememberMe);
            if (rememberMe) {
              Storage.set('savedUsername', normalizedUsername);
            } else {
              Storage.remove('savedUsername');
            }

            const userData = {
              id: result.user.id,
              username: result.user.username,
              nome: result.user.nome,
              is_admin: result.user.admin,
              instrumento: result.user.instrumento_nome || 'Musico',
              instrumento_id: result.user.instrumento_id,
              foto_url: result.user.foto_url
            };

            setUser(userData);
            Storage.set('user', userData);

            try {
              const favoritosIds = await API.getFavoritosIds();
              if (favoritosIds && Array.isArray(favoritosIds)) {
                const favoritosStr = favoritosIds.map((id: unknown) => String(id));
                setFavorites(favoritosStr);
                Storage.set('favorites', favoritosStr);
              }
            } catch {
              // Silencioso - favoritos serao carregados depois
            }

            showToast(`Bem-vindo, ${result.user.nome.split(' ')[0]}!`);

            // Redireciona apos login bem-sucedido
            if (onClose) {
              onClose();
            } else {
              // TODOS os usuarios (admin ou nao) vao para home /
              // Admin pode acessar area administrativa via AdminToggle no header
              router.push('/');
            }

            setIsLoading(false);
            return;
          }
        }

        setError('Usuario ou PIN incorreto');
        setPin(['', '', '', '']);
        // Delay para garantir que o PIN foi limpo antes de focar
        setTimeout(() => {
          pinRefs.current[0]?.focus();
        }, 100);

        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } catch (err) {
        console.error('Erro no login:', err);
        setError('Usuario ou PIN incorreto');
        setPin(['', '', '', '']);
        // Delay para garantir que o PIN foi limpo antes de focar
        setTimeout(() => {
          pinRefs.current[0]?.focus();
        }, 100);

        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }

      setIsLoading(false);
    }
  }, [pin, username, rememberMe, onClose, router, setUser, setFavorites, showToast]);

  // Handler do backspace no PIN
  const handlePinKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  }, [pin]);

  // Toggle remember me
  const toggleRememberMe = useCallback(() => {
    setRememberMe(prev => !prev);
  }, []);

  return {
    // Estados
    username,
    pin,
    rememberMe,
    isLoading,
    error,
    userFound,
    userNotFound,
    checkingUser,
    userInfo,
    // Refs
    pinRefs,
    cardRef,
    // Handlers
    handleUsernameChange,
    handlePinChange,
    handlePinKeyDown,
    toggleRememberMe,
    scrollToCard
  };
};

export default useLoginForm;
