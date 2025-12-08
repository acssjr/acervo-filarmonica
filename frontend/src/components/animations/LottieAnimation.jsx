// ===== LOTTIE ANIMATION =====
// Wrapper reutilizável para animações Lottie
// Carrega animações de CDN público (LottieFiles)

import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';

// URLs das animações no LottieFiles CDN (animações gratuitas e públicas)
const ANIMATION_URLS = {
  // Checkmark de sucesso verde animado
  success: 'https://assets2.lottiefiles.com/packages/lf20_jbrw3hcz.json',
  // Ícone de atenção/warning laranja pulsante
  attention: 'https://assets10.lottiefiles.com/packages/lf20_vvpxhboz.json',
  // X de erro vermelho
  error: 'https://assets4.lottiefiles.com/packages/lf20_qp1q7mct.json',
  // Lupa/scan - análise
  scan: 'https://assets9.lottiefiles.com/packages/lf20_t24tpvcu.json',
  // Upload com seta
  upload: 'https://assets3.lottiefiles.com/packages/lf20_oyi9a28g.json'
};

// Fallback simples caso a URL não carregue
const fallbackAnimation = {
  v: '5.5.7',
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: 'Fallback',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Circle',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [360] }] },
        p: { a: 0, k: [100, 100] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] }
      },
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'el',
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [60, 60] }
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.83, 0.69, 0.22, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 4 },
              d: [{ n: 'd', nm: 'dash', v: { a: 0, k: 15 } }, { n: 'g', nm: 'gap', v: { a: 0, k: 15 } }]
            }
          ]
        }
      ]
    }
  ]
};

// Cache de animações carregadas
const animationCache = {};

/**
 * Componente wrapper para animações Lottie
 * Carrega animações de CDN com cache e fallback
 * @param {Object} props
 * @param {string} props.name - Nome da animação pré-definida (success, attention, error, scan, upload)
 * @param {Object} props.animationData - Dados JSON da animação (alternativa a name)
 * @param {boolean} props.loop - Se deve repetir (padrão: true)
 * @param {boolean} props.autoplay - Se deve iniciar automaticamente (padrão: true)
 * @param {number} props.size - Tamanho em pixels (padrão: 120)
 * @param {Object} props.style - Estilos adicionais
 * @param {Function} props.onComplete - Callback quando a animação completa
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
  const [animation, setAnimation] = useState(animationData || fallbackAnimation);
  const [loading, setLoading] = useState(!animationData && !!name);

  // Carrega animação da URL
  useEffect(() => {
    if (animationData) {
      setAnimation(animationData);
      setLoading(false);
      return;
    }

    if (!name || !ANIMATION_URLS[name]) {
      setAnimation(fallbackAnimation);
      setLoading(false);
      return;
    }

    // Verifica cache
    if (animationCache[name]) {
      setAnimation(animationCache[name]);
      setLoading(false);
      return;
    }

    // Carrega da URL
    const loadAnimation = async () => {
      try {
        const response = await fetch(ANIMATION_URLS[name]);
        if (!response.ok) throw new Error('Failed to load animation');
        const data = await response.json();
        animationCache[name] = data;
        setAnimation(data);
      } catch (error) {
        console.warn(`Failed to load animation "${name}":`, error);
        setAnimation(fallbackAnimation);
      } finally {
        setLoading(false);
      }
    };

    loadAnimation();
  }, [name, animationData]);

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
      {loading ? (
        <div style={{
          width: '50%',
          height: '50%',
          border: '3px solid var(--border)',
          borderTopColor: '#D4AF37',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      ) : (
        <Lottie
          lottieRef={lottieRef}
          animationData={animation}
          loop={loop}
          autoplay={autoplay}
          style={{ width: '100%', height: '100%' }}
        />
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LottieAnimation;
