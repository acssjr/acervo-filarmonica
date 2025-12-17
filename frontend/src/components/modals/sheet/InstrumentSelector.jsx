// ===== INSTRUMENT SELECTOR =====
// Componente de selecao de instrumento para download/impressao/compartilhamento
// NOTA: Lista de instrumentos agora vem do DataContext (API com fallback)

import PropTypes from 'prop-types';
import { Icons } from '@constants/icons';

const InstrumentSelector = ({
  isOpen,
  instruments,
  userInstrument = '',
  isMaestro = false,
  downloading = false,
  canShare = false,
  onToggle,
  onSelectInstrument,
  onPrintInstrument,
  onShareInstrument,
  onAddToCart
}) => {
  // Determina qual instrumento destacar
  const highlightedInstrument = isMaestro ? 'Grade' : userInstrument;

  // Estilo dos botoes de acao
  const actionButtonStyle = {
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    cursor: downloading ? 'wait' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: downloading ? 0.5 : 1
  };

  return (
    <>
      {/* Botao para expandir/recolher */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="instrument-list"
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: isOpen ? '10px 10px 0 0' : '10px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderBottom: isOpen ? 'none' : '1px solid var(--border)',
          color: 'var(--text-primary)',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px' }}>
            <Icons.Music />
          </div>
          <span>{isMaestro ? 'Escolher Parte' : 'Outro Instrumento'}</span>
        </div>
        <div style={{
          width: '16px',
          height: '16px',
          transition: 'transform 0.2s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          <Icons.ChevronDown />
        </div>
      </button>

      {/* Lista de instrumentos */}
      {isOpen && (
        <div
          id="instrument-list"
          role="listbox"
          aria-label="Lista de instrumentos"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {instruments.map((instrument, idx) => {
            const isHighlighted = instrument === highlightedInstrument;

            return (
              <div
                key={instrument}
                role="option"
                aria-selected={isHighlighted}
                style={{
                  width: '100%',
                  padding: '8px 14px',
                  background: 'transparent',
                  borderBottom: idx < instruments.length - 1 ? '1px solid var(--border)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
              >
                {/* Nome do instrumento */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: 0
                }}>
                  <span style={{
                    color: isHighlighted ? 'var(--accent)' : 'var(--text-primary)',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '13px',
                    fontWeight: isHighlighted ? '600' : '500',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {instrument}
                  </span>
                  {isHighlighted && (
                    <span style={{
                      fontSize: '9px',
                      background: 'rgba(212,175,55,0.2)',
                      color: 'var(--accent)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>
                      {isMaestro ? '\u2605' : 'MEU'}
                    </span>
                  )}
                </div>

                {/* Botoes de acao */}
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  {/* Baixar */}
                  <button
                    onClick={() => onSelectInstrument(instrument)}
                    disabled={downloading}
                    aria-label={`Baixar ${instrument}`}
                    title="Baixar"
                    style={{
                      ...actionButtonStyle,
                      background: 'rgba(114, 47, 55, 0.15)',
                      color: '#722F37'
                    }}
                  >
                    <div style={{ width: '14px', height: '14px' }}><Icons.Download /></div>
                  </button>

                  {/* Imprimir */}
                  {onPrintInstrument && (
                    <button
                      onClick={() => onPrintInstrument(instrument)}
                      disabled={downloading}
                      aria-label={`Imprimir ${instrument}`}
                      title="Imprimir"
                      style={{
                        ...actionButtonStyle,
                        background: 'rgba(52, 152, 219, 0.15)',
                        color: '#3498db'
                      }}
                    >
                      <div style={{ width: '14px', height: '14px' }}><Icons.Printer /></div>
                    </button>
                  )}

                  {/* Compartilhar */}
                  {canShare && onShareInstrument && (
                    <button
                      onClick={() => onShareInstrument(instrument)}
                      disabled={downloading}
                      aria-label={`Enviar ${instrument}`}
                      title="Enviar"
                      style={{
                        ...actionButtonStyle,
                        background: 'rgba(37, 211, 102, 0.15)',
                        color: '#25D366'
                      }}
                    >
                      <div style={{ width: '14px', height: '14px' }}><Icons.Share /></div>
                    </button>
                  )}

                  {/* Adicionar ao carrinho (para envio em lote) */}
                  {canShare && onAddToCart && (
                    <button
                      onClick={() => onAddToCart(instrument)}
                      disabled={downloading}
                      aria-label={`Adicionar ${instrument} ao carrinho`}
                      title="Adicionar ao carrinho"
                      style={{
                        ...actionButtonStyle,
                        background: 'rgba(155, 89, 182, 0.15)',
                        color: '#9b59b6'
                      }}
                    >
                      <div style={{ width: '14px', height: '14px' }}><Icons.Plus /></div>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

InstrumentSelector.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  instruments: PropTypes.arrayOf(PropTypes.string).isRequired,
  userInstrument: PropTypes.string,
  isMaestro: PropTypes.bool,
  downloading: PropTypes.bool,
  canShare: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  onSelectInstrument: PropTypes.func.isRequired,
  onPrintInstrument: PropTypes.func,
  onShareInstrument: PropTypes.func,
  onAddToCart: PropTypes.func
};

export default InstrumentSelector;
