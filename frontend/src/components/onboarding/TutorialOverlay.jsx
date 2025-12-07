// ===== TUTORIAL OVERLAY =====
// Componente de onboarding com spotlight para guiar usuarios

import { useState, useEffect, useCallback } from 'react';
import Storage from '@services/storage';

const STORAGE_KEY = 'tutorial_admin_partituras_completed';

// Definicao dos passos do tutorial
const TUTORIAL_STEPS = [
  {
    targetSelector: '[data-tutorial="upload-pasta"]',
    title: 'Upload de Pasta - Funcao Principal',
    description: 'Esta e a forma mais rapida de adicionar partituras! Selecione uma pasta inteira e o sistema detecta automaticamente os instrumentos pelos nomes dos arquivos (Grade, Clarinetes, Saxes, Trompetes, etc.)',
    position: 'bottom',
    highlightPadding: 8
  },
  {
    targetSelector: '[data-tutorial="expand-button"]',
    title: 'Visualizar Todas as Partes',
    description: 'Clique aqui para expandir e ver todas as partes de instrumentos desta partitura. Voce pode visualizar, substituir ou adicionar novas partes individualmente.',
    position: 'right',
    highlightPadding: 4,
    beforeStep: 'expandFirst'
  },
  {
    targetSelector: '[data-tutorial="add-parte"]',
    title: 'Adicionar Parte de Instrumento',
    description: 'Use este botao para adicionar uma nova parte de instrumento que nao foi detectada automaticamente no upload.',
    position: 'top',
    highlightPadding: 6
  },
  {
    targetSelector: '[data-tutorial="action-buttons"]',
    title: 'Gerenciar Partes Individuais',
    description: 'Aqui voce pode substituir o arquivo de uma parte especifica ou deleta-la. Os botoes aparecem ao passar o mouse sobre cada parte.',
    position: 'left',
    highlightPadding: 4
  }
];

const TutorialOverlay = ({ isOpen, onClose, onExpandFirst }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const step = TUTORIAL_STEPS[currentStep];

  // Calcula posicao do tooltip baseado no elemento alvo
  const calculateTooltipPosition = useCallback((rect, preferredPosition) => {
    if (!rect) return { top: 0, left: 0 };

    const SPACING = 20;
    const TOOLTIP_WIDTH = 340;
    const TOOLTIP_HEIGHT_ESTIMATE = 220;

    let top, left;

    switch (preferredPosition) {
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

    // Ajusta para nao sair da viewport
    const padding = 20;
    if (left < padding) left = padding;
    if (left + TOOLTIP_WIDTH > window.innerWidth - padding) {
      left = window.innerWidth - TOOLTIP_WIDTH - padding;
    }
    if (top < padding) top = padding;
    if (top + TOOLTIP_HEIGHT_ESTIMATE > window.innerHeight - padding) {
      top = window.innerHeight - TOOLTIP_HEIGHT_ESTIMATE - padding;
    }

    return { top, left };
  }, []);

  // Atualiza posicao do elemento alvo
  const updateTargetPosition = useCallback(() => {
    if (!step) return;

    const targetElement = document.querySelector(step.targetSelector);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setTargetRect(rect);
      setTooltipPosition(calculateTooltipPosition(rect, step.position));
    }
  }, [step, calculateTooltipPosition]);

  // Efeito para atualizar posicao quando muda o passo
  useEffect(() => {
    if (!isOpen) return;

    setIsAnimating(true);

    // Executa acao antes do passo se necessario
    if (step?.beforeStep === 'expandFirst' && onExpandFirst) {
      onExpandFirst();
      // Aguarda expansao carregar
      setTimeout(updateTargetPosition, 500);
    } else {
      updateTargetPosition();
    }

    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [isOpen, currentStep, step, updateTargetPosition, onExpandFirst]);

  // Listener para resize
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => updateTargetPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, updateTargetPosition]);

  // Bloqueia scroll durante tutorial
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep === TUTORIAL_STEPS.length - 1) {
      handleFinish();
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    if (dontShowAgain) {
      Storage.set(STORAGE_KEY, true);
    }
    setCurrentStep(0);
    onClose();
  };

  const handleSkip = () => {
    setCurrentStep(0);
    onClose();
  };

  if (!isOpen || !step) return null;

  const padding = step.highlightPadding || 8;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      pointerEvents: 'auto'
    }}>
      {/* Overlay escuro */}
      <div
        onClick={handleSkip}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
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
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.85)',
            pointerEvents: 'none',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'pulse-spotlight 2s infinite'
          }}
        >
          {/* Borda destacada */}
          <div style={{
            position: 'absolute',
            inset: -2,
            borderRadius: '14px',
            border: '2px solid rgba(212, 175, 55, 0.6)',
            animation: 'pulse-border 2s infinite'
          }} />
        </div>
      )}

      {/* Tooltip Card */}
      <div
        style={{
          position: 'absolute',
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: '340px',
          background: 'var(--bg-primary, #1a1a2e)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.2)',
          zIndex: 10001,
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          fontFamily: 'Outfit, sans-serif'
        }}
      >
        {/* Indicador de progresso */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '20px'
        }}>
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '3px',
                background: i <= currentStep
                  ? 'linear-gradient(90deg, #D4AF37, #B8860B)'
                  : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                transition: 'background 0.3s'
              }}
            />
          ))}
        </div>

        {/* Contador de passos */}
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: 'rgba(212, 175, 55, 0.8)',
          marginBottom: '12px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          Passo {currentStep + 1} de {TUTORIAL_STEPS.length}
        </div>

        {/* Titulo */}
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: 'var(--text-primary, #fff)',
          marginBottom: '12px',
          lineHeight: '1.3'
        }}>
          {step.title}
        </h3>

        {/* Descricao */}
        <p style={{
          fontSize: '14px',
          lineHeight: '1.7',
          color: 'var(--text-secondary, rgba(255,255,255,0.7))',
          marginBottom: '24px'
        }}>
          {step.description}
        </p>

        {/* Botoes de navegacao */}
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'var(--text-secondary, rgba(255,255,255,0.7))',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
                fontFamily: 'Outfit, sans-serif'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              padding: '12px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
              fontFamily: 'Outfit, sans-serif'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
            }}
          >
            {currentStep === TUTORIAL_STEPS.length - 1 ? (
              <>
                Finalizar
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </>
            ) : (
              <>
                Proximo
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Checkbox "Nao mostrar novamente" - apenas no primeiro passo */}
        {currentStep === 0 && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                border: dontShowAgain
                  ? '2px solid #D4AF37'
                  : '2px solid rgba(255, 255, 255, 0.3)',
                background: dontShowAgain
                  ? 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)'
                  : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              onClick={() => setDontShowAgain(!dontShowAgain)}
            >
              {dontShowAgain && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
            <span style={{
              fontSize: '13px',
              color: 'var(--text-muted, rgba(255,255,255,0.5))'
            }}>
              Nao mostrar este tutorial novamente
            </span>
          </label>
        )}

        {/* Botao de pular */}
        <button
          onClick={handleSkip}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
          }}
          title="Fechar tutorial"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Estilos de animacao */}
      <style>{`
        @keyframes pulse-spotlight {
          0%, 100% {
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.85);
          }
          50% {
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.82);
          }
        }

        @keyframes pulse-border {
          0%, 100% {
            border-color: rgba(212, 175, 55, 0.6);
            transform: scale(1);
          }
          50% {
            border-color: rgba(212, 175, 55, 0.9);
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
};

// Hook para verificar se deve mostrar o tutorial
export const useTutorial = (partituras, loading) => {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Verifica se:
    // 1. Nao foi completado antes
    // 2. Existem partituras carregadas
    // 3. Nao esta em loading
    const tutorialCompleted = Storage.get(STORAGE_KEY, false);
    if (!tutorialCompleted && !loading && partituras && partituras.length > 0) {
      // Pequeno delay para garantir que a UI esta pronta
      const timer = setTimeout(() => setShowTutorial(true), 800);
      return () => clearTimeout(timer);
    }
  }, [loading, partituras]);

  return [showTutorial, setShowTutorial];
};

export default TutorialOverlay;
