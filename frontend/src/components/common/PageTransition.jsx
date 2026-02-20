// ===== PAGE TRANSITION =====
// Wrapper para transicoes de pagina com Framer Motion
// Otimizado: transições mais rápidas para fluidez

import { motion } from 'framer-motion';

// Variantes otimizadas - duração reduzida para melhor percepção de velocidade
const pageVariants = {
  initial: {
    opacity: 0,
    y: 4,          // Menor movimento = mais rápido
    scale: 0.995   // Menor escala = mais sutil
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.15,  // Reduzido de 0.25 para 0.15s
      ease: [0.25, 0.1, 0.25, 1] // Curva suave
    }
  },
  exit: {
    opacity: 0,
    y: -4,          // Movimento sutil para cima ao sair
    scale: 0.995,
    transition: {
      duration: 0.1,   // Saída mais rápida
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
