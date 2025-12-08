// ===== LOTTIE ANIMATION =====
// Wrapper reutilizavel para animacoes Lottie
// Usa importacao estatica conforme recomendado para evitar erros 404

import { useRef, useEffect } from 'react';
import Lottie from 'lottie-react';

// Importacao estatica dos arquivos JSON (Metodo 4.2 do guia)
// O bundler valida a existencia dos arquivos em tempo de compilacao
import successAnimation from '../../assets/animations/success.json';
import warningAnimation from '../../assets/animations/warning.json';
import errorAnimation from '../../assets/animations/error.json';
import scanAnimation from '../../assets/animations/scan.json';
import uploadAnimation from '../../assets/animations/upload.json';

// Mapeamento de nomes para os dados de animacao importados
const ANIMATIONS = {
  success: successAnimation,
  warning: warningAnimation,
  attention: warningAnimation, // alias para compatibilidade
  error: errorAnimation,
  scan: scanAnimation,
  upload: uploadAnimation
};

/**
 * Componente wrapper para animacoes Lottie
 * Usa importacao estatica para garantir confiabilidade (sem erros 404)
 * @param {Object} props
 * @param {string} props.name - Nome da animacao pre-definida (success, warning, error, scan, upload)
 * @param {Object} props.animationData - Dados JSON da animacao (alternativa a name)
 * @param {boolean} props.loop - Se deve repetir (padrao: true)
 * @param {boolean} props.autoplay - Se deve iniciar automaticamente (padrao: true)
 * @param {number} props.size - Tamanho em pixels (padrao: 120)
 * @param {Object} props.style - Estilos adicionais
 * @param {Function} props.onComplete - Callback quando a animacao completa
 */
const LottieAnimation = ({
  name,
  animationData,
  loop = true,
  autoplay = true,
  size = 120,
  style = {},
  onComplete
}) => {
  const lottieRef = useRef(null);

  // Determina os dados da animacao: prop direta ou pelo nome
  const animation = animationData || ANIMATIONS[name];

  // Callback de conclusao
  useEffect(() => {
    if (onComplete && lottieRef.current) {
      const handleComplete = () => {
        if (!loop) {
          onComplete();
        }
      };

      lottieRef.current.addEventListener('complete', handleComplete);
      return () => {
        lottieRef.current?.removeEventListener('complete', handleComplete);
      };
    }
  }, [loop, onComplete]);

  // Se nao encontrar a animacao, mostra fallback
  if (!animation) {
    console.warn(`LottieAnimation: animacao "${name}" nao encontrada`);
    return (
      <div style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        ...style
      }}>
        <div style={{
          width: '50%',
          height: '50%',
          border: '3px solid var(--border)',
          borderTopColor: '#D4AF37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto',
      ...style
    }}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animation}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LottieAnimation;
