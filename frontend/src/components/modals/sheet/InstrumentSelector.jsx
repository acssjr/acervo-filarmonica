// ===== INSTRUMENT SELECTOR =====
// Componente de selecao de instrumento para download
// NOTA: Lista de instrumentos agora vem do DataContext (API com fallback)

import PropTypes from 'prop-types';
import { Icons } from '@constants/icons';

const InstrumentSelector = ({
  isOpen,
  instruments,
  userInstrument = '',
  isMaestro = false,
  downloading = false,
  onToggle,
  onSelectInstrument
}) => {
  // Determina qual instrumento destacar
  const highlightedInstrument = isMaestro ? 'Grade' : userInstrument;

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
              <button
                key={instrument}
                role="option"
                aria-selected={isHighlighted}
                onClick={() => onSelectInstrument(instrument)}
                disabled={downloading}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: idx < instruments.length - 1 ? '1px solid var(--border)' : 'none',
                  color: isHighlighted ? 'var(--accent)' : 'var(--text-primary)',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '13px',
                  fontWeight: isHighlighted ? '600' : '500',
                  cursor: downloading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  opacity: downloading ? 0.6 : 1
                }}
              >
                <span>{instrument}</span>
                {isHighlighted && (
                  <span style={{
                    fontSize: '9px',
                    background: 'rgba(212,175,55,0.2)',
                    color: 'var(--accent)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: '700'
                  }}>
                    {isMaestro ? '\u2605' : 'MEU'}
                  </span>
                )}
              </button>
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
  onToggle: PropTypes.func.isRequired,
  onSelectInstrument: PropTypes.func.isRequired
};

export default InstrumentSelector;
