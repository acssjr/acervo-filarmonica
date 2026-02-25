// ===== LOGIN BACKGROUND COMPONENT =====
// Background decorativo com carrosel de imagens e overlay do login

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../constants/api';

const FALLBACK_IMAGE = '/assets/images/banda/foto-banda-sao-goncalo.webp';

const LoginBackground = () => {
  const [images, setImages] = useState([FALLBACK_IMAGE]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [_isLoading, setIsLoading] = useState(true);

  // Carregar lista de backgrounds do servidor
  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/assets/list/backgrounds`);
        if (!response.ok) throw new Error('Erro ao carregar backgrounds');
        const data = await response.json();

        if (data.assets && data.assets.length > 0) {
          const urls = data.assets.map(a => `${API_BASE_URL}${a.url}`);
          // Embaralhar a lista para não ser sempre o mesmo ao entrar
          const shuffled = urls.sort(() => Math.random() - 0.5);
          setImages(shuffled);

          // Pré-carregar primeira imagem imediatamente
          const firstImg = new Image();
          firstImg.onload = () => setIsFirstLoad(false);
          firstImg.onerror = () => {
            console.warn('Erro ao carregar primeira imagem, usando fallback');
            setIsFirstLoad(false);
          };
          firstImg.src = shuffled[0];

          // Pré-carregar restante
          shuffled.slice(1).forEach(url => {
            const img = new Image();
            img.src = url;
          });
        } else {
          setIsFirstLoad(false);
        }
      } catch (error) {
        console.warn('Usando background padrão:', error.message);
        setIsFirstLoad(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackgrounds();
  }, []);

  // Troca de imagem a cada 8 segundos
  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [images.length]);

  // Pré-carregar próxima imagem para evitar flicker na transição
  useEffect(() => {
    if (images.length <= 1) return;

    const nextIndex = (currentIndex + 1) % images.length;
    const img = new Image();
    img.src = images[nextIndex];
  }, [currentIndex, images]);

  return (
    <>
      {/* Container fixo para as imagens com cross-fade */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: -2,
        background: '#1a1a1a', // Cor de fundo sólida enquanto carrega
        overflow: 'hidden'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={images[currentIndex]}
            initial={isFirstLoad && currentIndex === 0 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: isFirstLoad && currentIndex === 0 ? 0 : 2, 
              ease: "easeOut" 
            }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${images[currentIndex]}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.7)'
            }}
          />
        </AnimatePresence>

        {/* Overlay de gradiente - transparência reduzida para foto mais visível */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(61, 21, 24, 0.85) 0%, rgba(30, 10, 12, 0.75) 50%, rgba(61, 21, 24, 0.85) 100%)',
          zIndex: 1
        }} />
      </div>

      {/* Padrao decorativo sutil */}
      <div style={{
        position: 'fixed',
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        zIndex: -1
      }} />
    </>
  );
};

export default LoginBackground;
