"use client";

// ===== LOTTIE ANIMATION =====
// Wrapper reutilizavel para animacoes Lottie
// Usa next/dynamic para evitar SSR (lottie-react precisa de browser APIs)

import { CSSProperties } from 'react';
import dynamic from 'next/dynamic';

// Import lottie-react com SSR desabilitado
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Importacao estatica dos arquivos JSON (Metodo 4.2 do guia)
// O bundler valida a existencia dos arquivos em tempo de compilacao
import successAnimation from '@/assets/animations/success.json';
import warningAnimation from '@/assets/animations/warning.json';
import errorAnimation from '@/assets/animations/error.json';
import scanAnimation from '@/assets/animations/scan.json';
import uploadAnimation from '@/assets/animations/upload.json';

type AnimationName = 'success' | 'warning' | 'attention' | 'error' | 'scan' | 'upload';

// Mapeamento de nomes para os dados de animacao importados
const ANIMATIONS: Record<AnimationName, unknown> = {
  success: successAnimation,
  warning: warningAnimation,
  attention: warningAnimation, // alias para compatibilidade
  error: errorAnimation,
  scan: scanAnimation,
  upload: uploadAnimation
};

interface LottieAnimationProps {
  /** Nome da animacao pre-definida (success, warning, error, scan, upload) */
  name?: AnimationName;
  /** Dados JSON da animacao (alternativa a name) */
  animationData?: unknown;
  /** Se deve repetir (padrao: true) */
  loop?: boolean;
  /** Se deve iniciar automaticamente (padrao: true) */
  autoplay?: boolean;
  /** Tamanho em pixels (padrao: 120) */
  size?: number;
  /** Estilos adicionais */
  style?: CSSProperties;
  /** Callback quando a animacao completa */
  onComplete?: () => void;
}

const SpinnerFallback = ({ size, style }: { size: number; style?: CSSProperties }) => (
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

const LottieAnimation = ({
  name,
  animationData,
  loop = true,
  autoplay = true,
  size = 120,
  style = {},
  onComplete
}: LottieAnimationProps) => {
  // Determina os dados da animacao: prop direta ou pelo nome
  const animation = animationData || (name ? ANIMATIONS[name] : undefined);

  // Callback de conclusao via prop do lottie-react
  const handleLottieComplete = () => {
    if (!loop && onComplete) {
      onComplete();
    }
  };

  // Se nao encontrar a animacao, mostra fallback
  if (!animation) {
    console.warn(`LottieAnimation: animacao "${name}" nao encontrada`);
    return <SpinnerFallback size={size} style={style} />;
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
        animationData={animation}
        loop={loop}
        autoplay={autoplay}
        onComplete={handleLottieComplete}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LottieAnimation;
