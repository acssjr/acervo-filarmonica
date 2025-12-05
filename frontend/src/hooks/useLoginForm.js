// ===== USE LOGIN FORM HOOK =====
// Hook com toda a logica de autenticacao do login

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { useUI } from '@contexts/UIContext';
import { useData } from '@contexts/DataContext';
import Storage from '@services/storage';
import { API, USE_API } from '@services/api';
import { API_BASE_URL } from '@constants/api';

const useLoginForm = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [userInfo, setUserInfo] = useState(null);

  // Refs
  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const cardRef = useRef(null);
  const checkUserTimeout = useRef(null);

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
      setUserInfo(null);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/check-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameToCheck })
      });
      const data = await response.json();

      if (data.exists) {
        setUserFound(true);
        setUserInfo({ name: data.nome, instrument: data.instrumento });
        setTimeout(() => pinRefs[0].current?.focus(), 100);
      } else {
        setUserFound(false);
        setUserInfo(null);
      }
    } catch (e) {
      console.error('Erro ao verificar usuario:', e);
      setUserFound(false);
      setUserInfo(null);
    }
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
  }, []);

  // Verifica se usuario existe quando digita (com debounce)
  const handleUsernameChange = useCallback((value) => {
    const normalized = value.toLowerCase().replace(/\s/g, '');
    setUsername(normalized);
    setError('');

    if (checkUserTimeout.current) {
      clearTimeout(checkUserTimeout.current);
    }

    if (!normalized || normalized.length < 2) {
      setUserFound(false);
      setUserInfo(null);
      return;
    }

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
        setError('Digite seu usuario');
        setPin(['', '', '', '']);
        return;
      }

      setIsLoading(true);

      try {
        if (USE_API) {
          const result = await API.login(normalizedUsername, fullPin);

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
              instrument: result.user.instrumento_nome || 'Musico',
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
            } catch (e) {
              console.log('Favoritos serao carregados depois');
            }

            showToast(`Bem-vindo, ${result.user.nome.split(' ')[0]}!`);

            // Redireciona apos login bem-sucedido
            if (onClose) {
              onClose();
            } else {
              // Determina destino baseado no papel do usuario
              const from = location.state?.from?.pathname;
              let destino = userData.isAdmin ? '/admin' : '/';

              // Se veio de uma rota especifica (exceto login), volta para la
              if (from && from !== '/login' && from !== '/') {
                // Mas admin nao deve ir para rotas de musico
                if (!userData.isAdmin || from.startsWith('/admin')) {
                  destino = from;
                }
              }

              navigate(destino, { replace: true });
            }

            setIsLoading(false);
            return;
          }
        }

        setError('Usuario ou PIN incorreto');
        setPin(['', '', '', '']);
        pinRefs[0].current?.focus();

        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } catch (err) {
        console.error('Erro no login:', err);
        setError('Usuario ou PIN incorreto');
        setPin(['', '', '', '']);
        pinRefs[0].current?.focus();

        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }

      setIsLoading(false);
    }
  }, [pin, username, rememberMe, onClose, location, navigate, setUser, setFavorites, showToast]);

  // Handler do backspace no PIN
  const handlePinKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
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
