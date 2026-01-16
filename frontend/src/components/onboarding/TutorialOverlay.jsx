// ===== TUTORIAL OVERLAY =====
// Componente de onboarding com spotlight para guiar usuários

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useMediaQuery } from '@hooks/useMediaQuery';
import Storage from '@services/storage';

const STORAGE_KEY = 'tutorial_admin_partituras_completed';

// Definição dos passos do tutorial
// Ordem: Upload → Expandir → Substituir → Remover → Adicionar
const TUTORIAL_STEPS = [
  {
    targetSelector: '[data-tutorial="upload-pasta"]',
    title: 'Upload de Pasta',
    subtitle: 'Função Principal',
    description: 'Esta é a forma mais rápida de <strong>adicionar partituras</strong>! Selecione uma pasta inteira e o sistema <strong>detecta automaticamente</strong> os instrumentos pelos nomes dos arquivos.',
    position: 'bottom',
    highlightPadding: 12
  },
  {
    targetSelector: '[data-tutorial="expand-button"]',
    title: 'Visualizar Todas as Partes',
    subtitle: 'Expandir Partitura',
    description: 'Clique aqui para <strong>expandir</strong> e ver todas as partes de instrumentos desta partitura. Você pode visualizar, substituir ou adicionar novas partes.',
    position: 'right',
    highlightPadding: 20,
    beforeStep: 'collapseFirst'
  },
  {
    targetSelector: '[data-tutorial="btn-replace"]',
    title: 'Substituir Arquivo',
    subtitle: 'Atualizar Parte',
    description: 'Clique aqui para <strong>substituir o arquivo</strong> de uma parte específica por uma versão atualizada.',
    position: 'left',
    highlightPadding: 8,
    beforeStep: 'expandFirst'
  },
  {
    targetSelector: '[data-tutorial="btn-delete"]',
    title: 'Remover Parte',
    subtitle: 'Deletar Arquivo',
    description: 'Use este botão para <strong>remover permanentemente</strong> uma parte da partitura.',
    position: 'left',
    highlightPadding: 8
  },
  {
    targetSelector: '[data-tutorial="add-parte"]',
    title: 'Adicionar Parte',
    subtitle: 'Novo Instrumento',
    description: 'Use este botão para <strong>adicionar uma nova parte</strong> de instrumento que não foi detectada automaticamente no upload.',
    position: 'left',
    highlightPadding: 10
  }
];

const TutorialOverlay = ({
  isOpen,
  onClose,
  onExpandFirst,
  onCollapseFirst,
  steps = TUTORIAL_STEPS,
  storageKey = STORAGE_KEY,
  onStepChange,
  finalButtonText = 'Finalizar',
  allowMobile = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipWidth, setTooltipWidth] = useState(360);
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [highlightNextButton, setHighlightNextButton] = useState(false);

  const step = steps[currentStep];

  // Calcula posição do tooltip baseado no elemento alvo
  const calculateTooltipPosition = useCallback((rect, preferredPosition, mobile = false) => {
    if (!rect) return { top: 0, left: 0, tooltipWidth: 360 };

    const SPACING = mobile ? 12 : 20;
    const TOOLTIP_WIDTH = mobile ? Math.min(320, window.innerWidth - 32) : 360;
    const TOOLTIP_HEIGHT_ESTIMATE = mobile ? 280 : 320;

    let top, left;
    let actualPosition = preferredPosition;

    // Verifica se há espaço suficiente na posição preferida
    const spaceBottom = window.innerHeight - rect.bottom;
    const spaceTop = rect.top;
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;

    // Se não houver espaço na posição preferida, encontra melhor alternativa
    if (preferredPosition === 'bottom' && spaceBottom < TOOLTIP_HEIGHT_ESTIMATE + SPACING) {
      actualPosition = spaceTop > spaceBottom ? 'top' : 'left';
    } else if (preferredPosition === 'top' && spaceTop < TOOLTIP_HEIGHT_ESTIMATE + SPACING) {
      actualPosition = spaceBottom > spaceTop ? 'bottom' : 'left';
    } else if (preferredPosition === 'right' && spaceRight < TOOLTIP_WIDTH + SPACING) {
      actualPosition = spaceLeft > spaceRight ? 'left' : 'bottom';
    } else if (preferredPosition === 'left' && spaceLeft < TOOLTIP_WIDTH + SPACING) {
      actualPosition = spaceRight > spaceLeft ? 'right' : 'bottom';
    }

    switch (actualPosition) {
      case 'bottom':
        top = rect.bottom + SPACING;
        left = rect.left + (rect.width / 2) - (TOOLTIP_WIDTH / 2);
        break;
      case 'top':
        top = rect.top - SPACING - TOOLTIP_HEIGHT_ESTIMATE;
        left = rect.left + (rect.width / 2) - (TOOLTIP_WIDTH / 2);
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (TOOLTIP_HEIGHT_ESTIMATE / 2);
        left = rect.right + SPACING;
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (TOOLTIP_HEIGHT_ESTIMATE / 2);
        left = rect.left - SPACING - TOOLTIP_WIDTH;
        break;
      default:
        top = rect.bottom + SPACING;
        left = rect.left;
    }

    // Ajusta para não sair da viewport
    const padding = mobile ? 16 : 20;
    if (left < padding) left = padding;
    if (left + TOOLTIP_WIDTH > window.innerWidth - padding) {
      left = window.innerWidth - TOOLTIP_WIDTH - padding;
    }
    if (top < padding) top = padding;
    if (top + TOOLTIP_HEIGHT_ESTIMATE > window.innerHeight - padding) {
      top = window.innerHeight - TOOLTIP_HEIGHT_ESTIMATE - padding;
    }

    return { top, left, tooltipWidth: TOOLTIP_WIDTH };
  }, []);

  // Atualiza posição do elemento alvo (com scroll automático se necessário)
  // Suporta retry para elementos que demoram a renderizar (ex: modal)
  const updateTargetPosition = useCallback((retryCount = 0) => {
    if (!step) return;

    const targetElement = document.querySelector(step.targetSelector);

    // Se elemento não encontrado e ainda temos retries, tenta novamente após delay
    if (!targetElement && retryCount < 10) {
      setTimeout(() => updateTargetPosition(retryCount + 1), 200);
      return;
    }

    if (targetElement) {
      // Verifica se o elemento está visível na viewport
      const rect = targetElement.getBoundingClientRect();
      const MARGIN = isMobile ? 60 : 100; // Margem menor para mobile

      const isElementVisible = (
        rect.top >= MARGIN &&
        rect.bottom <= window.innerHeight - MARGIN &&
        rect.left >= 0 &&
        rect.right <= window.innerWidth
      );

      // Se o elemento não está totalmente visível, faz scroll
      if (!isElementVisible) {
        // Temporariamente permite scroll para fazer o scrollIntoView
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        const mainContent = document.querySelector('main');
        if (mainContent) {
          mainContent.style.overflow = '';
        }

        // Scroll suave até o elemento, centralizando-o na tela
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });

        // Aguarda o scroll terminar e então atualiza a posição
        setTimeout(() => {
          // Rebloqueia scroll após o scrollIntoView
          document.body.style.overflow = 'hidden';
          document.documentElement.style.overflow = 'hidden';
          if (mainContent) {
            mainContent.style.overflow = 'hidden';
          }

          // Atualiza o rect após o scroll
          const newRect = targetElement.getBoundingClientRect();
          setTargetRect(newRect);
          const pos = calculateTooltipPosition(newRect, step.position, isMobile);
          setTooltipPosition({ top: pos.top, left: pos.left });
          setTooltipWidth(pos.tooltipWidth);
        }, 500);
      } else {
        // Elemento já visível, apenas atualiza posição
        setTargetRect(rect);
        const pos = calculateTooltipPosition(rect, step.position, isMobile);
        setTooltipPosition({ top: pos.top, left: pos.left });
        setTooltipWidth(pos.tooltipWidth);
      }
    }
  }, [step, calculateTooltipPosition, isMobile]);

  // Efeito para atualizar posição quando muda o passo
  useEffect(() => {
    if (!isOpen || (isMobile && !allowMobile)) return;

    setIsAnimating(true);

    // Executa ação antes do passo se necessário
    if (step?.beforeStep === 'expandFirst' && onExpandFirst) {
      onExpandFirst();
      // Aguarda expansão carregar
      setTimeout(updateTargetPosition, 600);
    } else if (step?.beforeStep === 'collapseFirst' && onCollapseFirst) {
      onCollapseFirst();
      setTimeout(updateTargetPosition, 300);
    } else {
      // Pequeno delay para garantir que o DOM está pronto
      setTimeout(updateTargetPosition, 100);
    }

    const timer = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timer);
  }, [isOpen, currentStep, step, updateTargetPosition, onExpandFirst, onCollapseFirst, isMobile, allowMobile]);

  // Listener para resize (atualiza apenas posição)
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => updateTargetPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, updateTargetPosition]);

  // Bloqueia scroll durante tutorial (em todos os elementos)
  useEffect(() => {
    if (isOpen && (!isMobile || allowMobile)) {
      // Bloqueia scroll no body
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Bloqueia scroll em qualquer container scrollável
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.style.overflow = 'hidden';
      }

      // Previne scroll com touch/wheel
      const preventScroll = (e) => {
        e.preventDefault();
      };

      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        if (mainContent) {
          mainContent.style.overflow = '';
        }
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
      };
    }
  }, [isOpen, isMobile, allowMobile]);

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      handleFinish();
      return;
    }
    const nextStep = currentStep + 1;

    // PRIMEIRO atualiza o step para que o walkthrough mostre o passo correto
    setCurrentStep(nextStep);

    // DEPOIS executa a ação (como abrir modal) com delay para o state atualizar
    setTimeout(() => {
      onStepChange?.(nextStep, steps[nextStep]);
    }, 150);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      onStepChange?.(prevStep, steps[prevStep]);
      setTimeout(() => setCurrentStep(prevStep), 100);
    }
  };

  const handleFinish = () => {
    // Sempre salva preferência ao finalizar - não mostra novamente
    Storage.set(storageKey, true);
    setCurrentStep(0);
    onClose();
  };

  const handleSkip = () => {
    // Também salva preferência ao pular - não mostra novamente
    Storage.set(storageKey, true);
    setCurrentStep(0);
    onClose();
  };

  // Não renderiza em mobile (exceto se allowMobile) ou se não estiver aberto
  if (!isOpen || !step || (isMobile && !allowMobile)) return null;

  const padding = step.highlightPadding || 12;

  // Usa Portal para renderizar direto no body, garantindo que fique acima de todos os modais
  return createPortal(
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      pointerEvents: 'auto',
      isolation: 'isolate'
    }}>
      {/* Overlay escuro - destaca botão próximo ao clicar */}
      <div
        onClick={() => {
          setHighlightNextButton(true);
          setTimeout(() => setHighlightNextButton(false), 1200);
        }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          transition: 'background 0.3s ease',
          cursor: 'pointer'
        }}
      />

      {/* Spotlight - buraco transparente */}
      {targetRect && (
        <div
          style={{
            position: 'absolute',
            top: targetRect.top - padding,
            left: targetRect.left - padding,
            width: targetRect.width + (padding * 2),
            height: targetRect.height + (padding * 2),
            borderRadius: '12px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            pointerEvents: 'none',
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            willChange: 'top, left, width, height'
          }}
        >
          {/* Borda destacada animada */}
          <div style={{
            position: 'absolute',
            inset: -3,
            borderRadius: '14px',
            border: '2px solid rgba(212, 175, 55, 0.8)',
            animation: 'pulse-border 1.5s ease-in-out infinite',
            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }} />
        </div>
      )}

      {/* Tooltip Card */}
      <div
        style={{
          position: 'absolute',
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: tooltipWidth,
          background: '#fff',
          borderRadius: isMobile ? '12px' : '16px',
          padding: isMobile ? '20px' : '28px',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          zIndex: 100000,
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateY(12px) scale(0.98)' : 'translateY(0) scale(1)',
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          fontFamily: 'Outfit, sans-serif',
          willChange: 'transform, opacity, top, left'
        }}
      >
        {/* Indicador de progresso */}
        <div style={{
          display: 'flex',
          gap: isMobile ? '4px' : '6px',
          marginBottom: isMobile ? '14px' : '20px'
        }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '4px',
                background: i <= currentStep
                  ? 'linear-gradient(90deg, #D4AF37, #B8860B)'
                  : '#e5e5e5',
                borderRadius: '999px',
                transition: 'background 0.4s ease'
              }}
            />
          ))}
        </div>

        {/* Contador de passos */}
        <div style={{
          fontSize: isMobile ? '11px' : '12px',
          fontWeight: '700',
          color: '#D4AF37',
          marginBottom: isMobile ? '6px' : '8px',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          Passo {currentStep + 1} de {steps.length}
        </div>

        {/* Título */}
        <h3 style={{
          fontSize: isMobile ? '17px' : '20px',
          fontWeight: '700',
          color: '#1a1a2e',
          marginBottom: '4px',
          lineHeight: '1.3'
        }}>
          {step.title}
        </h3>

        {/* Subtítulo */}
        {step.subtitle && (
          <div style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#888',
            marginBottom: '12px'
          }}>
            {step.subtitle}
          </div>
        )}

        {/* Descrição com HTML */}
        <p
          style={{
            fontSize: isMobile ? '13px' : '14px',
            lineHeight: isMobile ? '1.5' : '1.7',
            color: '#555',
            marginBottom: isMobile ? '18px' : '24px'
          }}
          dangerouslySetInnerHTML={{ __html: step.description }}
        />

        {/* Botões de navegação */}
        <div style={{
          display: 'flex',
          gap: isMobile ? '8px' : '10px'
        }}>
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              style={{
                flex: 1,
                padding: isMobile ? '12px 14px' : '14px 16px',
                borderRadius: isMobile ? '8px' : '10px',
                background: '#f5f5f5',
                border: 'none',
                color: '#666',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                fontFamily: 'Outfit, sans-serif'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#eee';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#f5f5f5';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Anterior
            </button>
          )}
          <button
            onClick={handleNext}
            style={{
              flex: currentStep > 0 ? 1 : 'auto',
              minWidth: currentStep > 0 ? 'auto' : '100%',
              padding: isMobile ? '12px 18px' : '14px 24px',
              borderRadius: isMobile ? '8px' : '10px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: highlightNextButton
                ? '0 0 0 4px rgba(212, 175, 55, 0.4), 0 8px 25px rgba(212, 175, 55, 0.6)'
                : '0 4px 15px rgba(212, 175, 55, 0.4)',
              fontFamily: 'Outfit, sans-serif',
              transform: highlightNextButton ? 'scale(1.05)' : 'scale(1)',
              animation: highlightNextButton ? 'pulse-next 0.6s ease-in-out 2' : 'none'
            }}
            onMouseEnter={e => {
              if (!highlightNextButton) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.5)';
              }
            }}
            onMouseLeave={e => {
              if (!highlightNextButton) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
              }
            }}
          >
            {currentStep === steps.length - 1 ? (
              <>
                {finalButtonText}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </>
            ) : (
              <>
                Próximo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Botão de pular tutorial - discreto */}
        <button
          onClick={handleSkip}
          style={{
            marginTop: '16px',
            padding: '6px 12px',
            borderRadius: '6px',
            background: 'transparent',
            border: 'none',
            color: '#bbb',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: '400',
            fontFamily: 'Outfit, sans-serif',
            transition: 'all 0.2s ease',
            alignSelf: 'center'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#888';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#bbb';
          }}
        >
          Pular tutorial
        </button>

      </div>

      {/* Estilos de animação */}
      <style>{`
        @keyframes pulse-border {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }
        @keyframes pulse-next {
          0%, 100% {
            transform: scale(1.05);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>,
    document.body
  );
};

// Hook para verificar se deve mostrar o tutorial
// Retorna [showTutorial, setShowTutorial, tutorialPending]
// tutorialPending = true durante o delay antes do tutorial aparecer (bloqueia interações)
export const useTutorial = (partituras, loading) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialPending, setTutorialPending] = useState(false);

  useEffect(() => {
    // Não mostra em mobile
    if (window.innerWidth < 768) return;

    // Verifica se:
    // 1. Não foi completado antes
    // 2. Existem partituras carregadas
    // 3. Não está em loading
    const tutorialCompleted = Storage.get(STORAGE_KEY, false);
    if (!tutorialCompleted && !loading && partituras && partituras.length > 0) {
      // Marca como pendente imediatamente (bloqueia interações)
      setTutorialPending(true);

      // Pequeno delay para garantir que a UI está pronta
      const timer = setTimeout(() => {
        setShowTutorial(true);
        setTutorialPending(false); // Não está mais pendente, agora está ativo
      }, 1000);

      return () => {
        clearTimeout(timer);
        setTutorialPending(false);
      };
    }
  }, [loading, partituras]);

  return [showTutorial, setShowTutorial, tutorialPending];
};

export default TutorialOverlay;
