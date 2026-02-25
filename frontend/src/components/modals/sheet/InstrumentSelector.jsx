// ===== INSTRUMENT SELECTOR =====
// Componente de selecao de instrumento para download/impressao/compartilhamento
// NOTA: Lista de instrumentos agora vem do DataContext (API com fallback)

import PropTypes from 'prop-types';
import { Icons } from '@constants/icons';
import { useMediaQuery } from '@hooks/useMediaQuery';

const InstrumentSelector = ({
  isOpen,
  instruments,
  userInstrument = '',
  isMaestro = false,
  downloading = false,
  canShare = false,
  shareCart = [],
  onToggle,
  onSelectInstrument,
  onPrintInstrument,
  onViewInstrument,
  onShareInstrument,
  onAddToCart,
  onRemoveFromCart
}) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
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
            overflowY: 'auto',
            animation: 'expandDown 0.2s ease-out'
          }}
        >
          {instruments.map((instrument, idx) => {
            const isHighlighted = instrument === highlightedInstrument;
            const isInCart = shareCart.some(item => item.instrument === instrument);

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
                {/* Nome do instrumento - clicável para download */}
                <button
                  onClick={() => onSelectInstrument(instrument)}
                  disabled={downloading}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: 0,
                    background: 'transparent',
                    border: 'none',
                    padding: '4px 0',
                    cursor: downloading ? 'wait' : 'pointer',
                    textAlign: 'left'
                  }}
                >
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
                </button>

                {/* Botoes de acao - compactos */}
                <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                  {/* Visualizar (Olho) - Disponível em PC e Mobile */}
                  {onViewInstrument && (
                    <button
                      onClick={() => onViewInstrument(instrument)}
                      disabled={downloading}
                      aria-label={`Visualizar ${instrument}`}
                      title="Visualizar"
                      className="action-btn"
                      style={{
                        ...actionButtonStyle,
                        background: 'rgba(52, 152, 219, 0.12)',
                        color: '#3498db',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ width: '13px', height: '13px' }}><Icons.Eye /></div>
                    </button>
                  )}

                  {/* Imprimir - Apenas PC (isMobile === false) */}
                  {!isMobile && onPrintInstrument && (
                    <button
                      onClick={() => onPrintInstrument(instrument)}
                      disabled={downloading}
                      aria-label={`Imprimir ${instrument}`}
                      title="Imprimir"
                      className="action-btn"
                      style={{
                        ...actionButtonStyle,
                        background: 'rgba(30, 132, 73, 0.12)',
                        color: '#1e8449',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ width: '13px', height: '13px' }}><Icons.Printer /></div>
                    </button>
                  )}

                  {/* Compartilhar individual */}
                  {canShare && onShareInstrument && (
                    <button
                      onClick={() => onShareInstrument(instrument)}
                      disabled={downloading}
                      aria-label={`Enviar ${instrument}`}
                      title="Enviar"
                      className="action-btn"
                      style={{
                        ...actionButtonStyle,
                        background: 'rgba(25, 127, 58, 0.12)',
                        color: '#197f3a',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ width: '13px', height: '13px' }}><Icons.Share /></div>
                    </button>
                  )}

                  {/* Adicionar/Remover do carrinho (para envio em lote) */}
                  {onAddToCart && (
                    <button
                      onClick={() => {
                        if (isInCart && onRemoveFromCart) {
                          const cartItem = shareCart.find(item => item.instrument === instrument);
                          if (cartItem) onRemoveFromCart(cartItem.parteId);
                        } else {
                          onAddToCart(instrument);
                        }
                      }}
                      disabled={downloading}
                      aria-label={isInCart ? `Remover ${instrument} do carrinho` : `Adicionar ${instrument} ao carrinho`}
                      title={isInCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
                      className="action-btn"
                      style={{
                        ...actionButtonStyle,
                        background: isInCart ? 'rgba(39, 174, 96, 0.2)' : 'rgba(155, 89, 182, 0.12)',
                        color: isInCart ? '#27ae60' : '#9b59b6',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ width: '13px', height: '13px' }}>
                        {isInCart ? <Icons.Check /> : <Icons.Plus />}
                      </div>
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
  shareCart: PropTypes.arrayOf(PropTypes.shape({
    instrument: PropTypes.string.isRequired,
    parteId: PropTypes.number
  })),
  onToggle: PropTypes.func.isRequired,
  onSelectInstrument: PropTypes.func.isRequired,
  onPrintInstrument: PropTypes.func,
  onViewInstrument: PropTypes.func,
  onShareInstrument: PropTypes.func,
  onAddToCart: PropTypes.func,
  onRemoveFromCart: PropTypes.func
};

export default InstrumentSelector;
