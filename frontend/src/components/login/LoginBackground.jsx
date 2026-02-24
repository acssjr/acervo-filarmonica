// ===== LOGIN BACKGROUND COMPONENT =====
// Background decorativo com carrosel de imagens e overlay do login

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lista de imagens para o background (adicione novos arquivos WebP aqui)
const BACKGROUND_IMAGES = [
  '/assets/images/banda/foto-banda-sao-goncalo.webp',
  // Adicione outras fotos aqui, ex:
  // '/assets/images/banda/foto-banda-2.webp',
  // '/assets/images/banda/foto-banda-3.webp',
];

const LoginBackground = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Troca de imagem a cada 8 segundos
  useEffect(() => {
    if (BACKGROUND_IMAGES.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

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
            key={BACKGROUND_IMAGES[currentIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${BACKGROUND_IMAGES[currentIndex]}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.7)'
            }}
          />
        </AnimatePresence>

        {/* Overlay de gradiente luxuoso para garantir legibilidade do login */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(61, 21, 24, 0.94) 0%, rgba(30, 10, 12, 0.8) 50%, rgba(61, 21, 24, 0.94) 100%)',
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
