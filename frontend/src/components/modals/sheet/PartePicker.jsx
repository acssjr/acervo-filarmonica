// ===== PARTE PICKER MODAL =====
// Modal para selecao quando existem multiplas partes do mesmo instrumento
// Ex: "Trompete Bb 1", "Trompete Bb 2"

import PropTypes from 'prop-types';

const PartePicker = ({
  isOpen,
  partes,
  instrumentName,
  downloading,
  onSelectParte,
  onClose
}) => {
  if (!isOpen || partes.length === 0) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        role="presentation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 2002,
          animation: 'fadeIn 0.15s ease'
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="parte-picker-title"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '24px',
          zIndex: 2003,
          width: '340px',
          maxWidth: '90vw',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #722F37 0%, #5C1A1B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 4px 12px rgba(114, 47, 55, 0.3)'
          }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F4E4BC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <h3
            id="parte-picker-title"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '6px'
            }}
          >
            Escolha sua parte
          </h3>
          <p style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '13px',
            color: 'var(--text-muted)'
          }}>
            Encontramos {partes.length} partes de{' '}
            <strong style={{ color: 'var(--accent)' }}>{instrumentName}</strong>
          </p>
        </div>

        {/* Lista de partes */}
        <div
          role="list"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '20px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {partes.map((parte, idx) => (
            <button
              key={parte.id}
              role="listitem"
              onClick={() => onSelectParte(parte)}
              disabled={downloading}
              aria-label={`Baixar ${parte.instrumento}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                cursor: downloading ? 'wait' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: downloading ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--accent)'
                }}>
                  {idx + 1}
                </span>
                <span>{parte.instrumento}</span>
              </div>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            </button>
          ))}
        </div>

        {/* Botao cancelar */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Cancelar
        </button>
      </div>
    </>
  );
};

PartePicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  partes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    instrumento: PropTypes.string.isRequired
  })).isRequired,
  instrumentName: PropTypes.string,
  downloading: PropTypes.bool,
  onSelectParte: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

PartePicker.defaultProps = {
  instrumentName: '',
  downloading: false
};

export default PartePicker;
