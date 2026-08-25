// ===== USE LOGIN FORM HOOK =====
// Hook com toda a logica de autenticacao do login

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import Storage from '@services/storage';
import { API, USE_API } from '@services/api';
import { API_BASE_URL } from '@constants/api';

const useLoginForm = ({ onClose }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { showToast } = useUI();
  const { setFavorites } = useData();

  // Estados do formulario
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [rememberMe, setRememberMe] = useState(() => Storage.get('rememberMe', false));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userFound, setUserFound] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userCheckError, setUserCheckError] = useState('');

  // Refs
  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const cardRef = useRef(null);
  const checkUserTimeout = useRef(null);
  const checkUserRequestId = useRef(0);

  // Scroll suave para o card quando teclado abre (mobile)
  const scrollToCard = useCallback(() => {
    if (cardRef.current && window.innerWidth < 768) {
      setTimeout(() => {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, []);

  // Funcao para verificar usuario na API
  const checkUserExists = useCallback(async (usernameToCheck) => {
    if (!usernameToCheck || usernameToCheck.length < 2) {
      setUserFound(false);
      setUserNotFound(false);
      setUserInfo(null);
      setUserCheckError('');
      return;
    }

    const requestId = ++checkUserRequestId.current;
    setCheckingUser(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/check-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameToCheck })
      });
      const data = await response.json().catch(() => ({}));

      if (requestId !== checkUserRequestId.current) return;

      if (!response.ok) {
        setUserFound(false);
        setUserNotFound(false);
        setUserInfo(null);
        setUserCheckError(
          response.status === 429
            ? (data.error || 'Muitas tentativas. Aguarde um momento.')
            : 'Não foi possível verificar agora. Tente novamente.'
        );
        return;
      }

      if (data.exists) {
        setUserFound(true);
        setUserNotFound(false);
        setUserInfo({ name: data.nome, instrument: data.instrumento });
        setUserCheckError('');
        setTimeout(() => pinRefs[0].current?.focus(), 100);
      } else {
        setUserFound(false);
        setUserNotFound(true);
        setUserInfo(null);
        setUserCheckError('');
      }
    } catch (e) {
      if (requestId !== checkUserRequestId.current) return;
      console.error('Erro ao verificar usuario:', e);
      setUserFound(false);
      setUserNotFound(false);
      setUserInfo(null);
      setUserCheckError('Não foi possível verificar agora. Tente novamente.');
    } finally {
      if (requestId === checkUserRequestId.current) {
        setCheckingUser(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pinRefs é ref estável
  }, []);

  // Carrega usuario salvo se "Lembrar-me" estava ativo
  useEffect(() => {
    if (rememberMe) {
      const savedUsername = Storage.get('savedUsername', '');
      if (savedUsername) {
        setUsername(savedUsername);
        checkUserExists(savedUsername);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- executa apenas na montagem
  }, []);

  // Verifica se usuario existe quando digita (com debounce reduzido)
  const handleUsernameChange = useCallback((value) => {
    const normalized = value.toLowerCase().replace(/\s/g, '');
    setUsername(normalized);
    setError('');
    setUserCheckError('');
    checkUserRequestId.current += 1;

    if (checkUserTimeout.current) {
      clearTimeout(checkUserTimeout.current);
    }

    if (!normalized || normalized.length < 2) {
      setUserFound(false);
      setUserNotFound(false);
      setUserInfo(null);
      setUserCheckError('');
      setCheckingUser(false);
      return;
    }

    // Inicia loading imediatamente ao digitar
    setCheckingUser(true);

    // Evita uma consulta a cada tecla sem deixar a interface lenta.
    checkUserTimeout.current = setTimeout(() => {
      checkUserExists(normalized);
    }, 300);
  }, [checkUserExists]);

  // Handler do PIN - autologin quando completo
  const handlePinChange = useCallback(async (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      pinRefs[index + 1].current?.focus();
    }

    // Verifica se completou o PIN - AUTOLOGIN
    if (value && index === 3) {
      const fullPin = newPin.join('');
      const normalizedUsername = username.toLowerCase().replace(/\s/g, '');

      if (!normalizedUsername) {
        setError('Digite seu usuário');
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
              name: result.user.nome,
              isAdmin: result.user.admin,
              instrument: result.user.instrumento_nome || 'Músico',
              instrumento_id: result.user.instrumento_id,
              foto_url: result.user.foto_url
            };

            setUser(userData);
            Storage.set('user', userData);

            try {
              const favoritosIds = await API.getFavoritosIds();
              if (favoritosIds && Array.isArray(favoritosIds)) {
                const favoritosStr = favoritosIds.map(id => String(id));
                setFavorites(favoritosStr);
                Storage.set('favorites', favoritosStr);
              }
            } catch {
              // Silencioso - favoritos serão carregados depois
            }

            showToast(`Bem-vindo, ${result.user.nome.split(' ')[0]}!`, 'success', { instrument: result.user.instrumento_nome });

            // Redireciona apos login bem-sucedido
            if (onClose) {
              onClose();
            } else {
              // TODOS os usuarios (admin ou nao) vao para home /
              // Admin pode acessar area administrativa via AdminToggle no header
              navigate('/', { replace: true });
            }

            setIsLoading(false);
            return;
          }
        }

        setError('Usuário ou PIN incorreto');
        setPin(['', '', '', '']);
        // Delay para garantir que o PIN foi limpo antes de focar
        setTimeout(() => {
          pinRefs[0].current?.focus();
        }, 100);

        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } catch (err) {
        console.error('Erro no login:', err);
        const message = err?.message || '';
        const invalidCredentials = message.includes('Usuário ou PIN')
          || message.includes('Credenciais inválidas');
        const operationalMessage = message.includes('Muitas tentativas')
          || message.includes('temporariamente indisponível')
          ? message
          : 'Não foi possível entrar agora. Tente novamente.';
        setError(invalidCredentials ? 'Usuário ou PIN incorreto' : operationalMessage);
        setPin(['', '', '', '']);
        // Delay para garantir que o PIN foi limpo antes de focar
        setTimeout(() => {
          pinRefs[0].current?.focus();
        }, 100);

        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }

      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pinRefs é ref estável
  }, [pin, username, rememberMe, onClose, navigate, setUser, setFavorites, showToast]);

  // Handler do backspace no PIN
  const handlePinKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pinRefs é ref estável
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
    userCheckError,
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
